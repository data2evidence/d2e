package com.legacy.health.fhir.meta.sql;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.zip.GZIPOutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.json.JSONNodeConsumer;
import com.legacy.health.fhir.meta.json.JSONStructureConsumer;
import com.legacy.health.fhir.util.Utils;

public class DataWalker {
	private static Log log = LogFactory.getLog(DataWalker.class);

	protected HashMap<Table, RowBuffer> buffers = new HashMap<Table, RowBuffer>();

	protected String idPrefix = "urn:uuid:";
	protected RelationSchemaController controller;

	public void setIdPrefix(String idprefix) {
		this.idPrefix = idprefix;
	}

	protected RowBuffer getRowBuffer(Table table, Connection connection) {
		RowBuffer ret = buffers.get(table);
		if (ret == null) {
			ret = new RowBuffer(controller.getProviderFactory().createSQLTypeMapper());// new RowBuffer();
			ret.setConnection(connection);
			ret.table = table;
			buffers.put(table, ret);
		}
		return ret;
	}

	protected HashMap<String, Table> asHashMap(List<Table> tables) {
		HashMap<String, Table> ret = new HashMap<String, Table>();
		for (Iterator<Table> iterator = tables.iterator(); iterator.hasNext();) {
			Table table = iterator.next();
			ret.put(table.name, table);
		}
		return ret;
	}

	protected String buildTableName(String prefix, String name) {
		String ret = "\"" + prefix + name + "\"";
		return ret.toUpperCase(Locale.ENGLISH);
	}

	protected String buildColumnName(String name) {
		String ret = "\"" + name + "\"";
		return ret.toUpperCase(Locale.ENGLISH);
	}

	protected void setController(RelationSchemaController controller) {
		this.controller = controller;
	}

	public boolean writeStructure(Structure structure, List<Table> tables, Table resourceTable, SQLContext context)
			throws SQLException {
		RowBuffer resourceBuffer = this.getRowBuffer(resourceTable, context.getConnection());
		HashMap<String, Object> rowResource = new HashMap<String, Object>();

		// System.out.println("---------------------------");
		String name = structure.getResourceType();
		HashMap<String, Table> namedTables = asHashMap(tables);
		String tableName = buildTableName("", name);
		Table root = namedTables.get(tableName);
		RowBuffer rootBuffer = this.getRowBuffer(root, context.getConnection());
		HashMap<String, Object> row = new HashMap<String, Object>();
		JSONStructureConsumer consumer = new JSONStructureConsumer();
		consumer.addResultListener(new JSONNodeConsumer() {
			@Override
			public void convertedStructure(JsonNode node) {
				String resource = node.toString();
				try {
					byte[] b = resource.getBytes();
					ByteArrayOutputStream baos = new ByteArrayOutputStream();

					GZIPOutputStream gzip = new GZIPOutputStream(baos);
					gzip.write(b);
					gzip.close();
					byte[] c = baos.toByteArray();
					rowResource.put("\"RESOURCE_COMPRESSED\"", c);
				} catch (IOException e) {
					// e.printStackTrace();
					throw new FhirRuntimeException(
							"Error During compression Resource body:" + node.path("id").asText("<Resource without id>"),
							e);
				}
			}
		});
		try {
			consumer.writeStructure(structure, context);
		} catch (Exception e1) {
			throw new FhirRuntimeException("Error During compression Resource body", e1);
		}
		rowResource.put("\"TYPE\"", name);
		ValueElement eLastUpdated = (ValueElement) structure.getElementByPath(name + ".meta.lastUpdated");

		// TODO: LastUpdated could be null in a bundle/resource... Throw an exception or
		// null or handle differently?
		String lastUpdated = eLastUpdated == null ? null : (String) eLastUpdated.getValue();
		rowResource.put("\"VALID_FROM\"", lastUpdated);
		ValueElement eVersion = (ValueElement) structure.getElementByPath(name + ".meta.versionId");

		// TODO: Version could be null in a bundle/resource... Throw an exception or
		// null or handle differently?
		String versionId = eVersion == null ? null : (String) eVersion.getValue();
		rowResource.put("\"VID\"", versionId);
		rowResource.put("\"IS_DELETED\"", false);
		rowResource.put("\"CANONICAL_ID\"", structure.getCanonicalReference());
		List<Element> elements = structure.getElements();
		row.put("\"CANONICAL_ID\"", structure.getCanonicalReference());
		for (int e = 0; e < elements.size(); e++) {
			Element element = elements.get(e);
			if (element instanceof ValueElement) {

				String col = buildColumnName(element.getDefinition().getShortName());
				if (col.equals("\"ID\"")) {
					String helper = (String) ((ValueElement) element).getValue();
					String uuidPattern = "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";

					if (Pattern.matches(uuidPattern, helper)) {// TODO
						row.put(col, idPrefix + ((ValueElement) element).getValue());
						rowResource.put("\"ID\"", idPrefix + ((ValueElement) element).getValue());
					} else {
						row.put(col, ((ValueElement) element).getValue());
						rowResource.put("\"ID\"", ((ValueElement) element).getValue());
					}
				} else {
					row.put(col, ((ValueElement) element).getValue());
				}
			}
			if (element instanceof ArrayElement) {
				writeArrayElement((ArrayElement) element, structure, namedTables, name + "_", context);
				continue;
			}
			if (element instanceof ComplexElement) {
				writeComplexElement((ComplexElement) element, structure, namedTables, name + "_", context);
			}
		}
		rootBuffer.addRow(row);
		resourceBuffer.addRow(rowResource);
		return false;
	}

	protected Object getValue(Structure definition, String path) {
		List<Element> elements = definition.getElements();
		for (Iterator<Element> iterator = elements.iterator(); iterator.hasNext();) {
			Element element = iterator.next();
			if (element.getPath().equals(path) && element instanceof ValueElement) {
				Object value = ((ValueElement) element).getValue();
				String uuidPattern = "[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}";
				String prefix = "";
				if (Pattern.matches(uuidPattern, "" + value)) {// TODO
					prefix = "urn:uuid:";
				}
				if (path.equals("id") && value != null) {
					return prefix + value;
				}
			}
		}
		return null;
	}

	public boolean writeArrayElement(ArrayElement arrayElement, Structure structure, HashMap<String, Table> namedTables,
			String prefix, SQLContext context) throws SQLException {
		// System.out.println("ArrayElement:"+arrayElement.getPath()+":"+arrayElement.getLogicalPath()+":"+arrayElement);
		List<Element> elements = arrayElement.getElements();
		for (int e = 0; e < elements.size(); e++) {
			Element element = elements.get(e);

			if (element instanceof ValueElement) {
				ValueElement value = (ValueElement) element;
				String tName = structure.getResourceType() + "_" + value.getDefinition().getOwner().getId() + "_"
						+ value.getDefinition().getShortName();
				Table arr = namedTables.get(buildColumnName(tName));

				RowBuffer arrBuffer = this.getRowBuffer(arr, context.getConnection());
				HashMap<String, Object> row = new HashMap<String, Object>();
				row.put("\"PARENT_ID\"", getValue(structure, "id"));
				row.put("\"CANONICAL_ID\"", structure.getCanonicalReference());
				row.put("\"POS\"", e);
				row.put("\"VALUE\"", value.getValue());
				row.put("\"PATH\"", value.getPath());
				if (arrayElement.getContainer() instanceof ComplexElement) {
					ComplexElement parent = (ComplexElement) arrayElement.getContainer();
					row.put("\"PARENT_PATH\"", parent.getPath());
				}
				// arrBuffer.rows.add(row);
				arrBuffer.addRow(row);
			}
			if (element instanceof ArrayElement) {
				writeArrayElement((ArrayElement) element, structure, namedTables, prefix, context);
			}
			if (element instanceof ComplexElement) {
				writeComplexElement((ComplexElement) element, structure, namedTables, prefix, context);
			}
		}
		return false;
	}

	public boolean writeComplexElement(ComplexElement complexElement, Structure structure,
			HashMap<String, Table> namedTables, String prefix, SQLContext context) throws SQLException {
		if (complexElement.getDefinition().getType().getId().toLowerCase(Locale.ENGLISH).equals("reference")) {
			List<Element> elements = complexElement.getElements();
			Table table = controller.getReferenceTable();
			RowBuffer buffer = this.getRowBuffer(table, context.getConnection());
			HashMap<String, Object> row = new HashMap<String, Object>();
			row.put("\"PARENT_ID\"", getValue(structure, "id"));
			row.put("\"CANONICAL_ID\"", structure.getCanonicalReference());
			row.put("\"DATAELEMENT_ID\"", complexElement.getDefinition().getId());
			row.put("\"REFERENCE_PATH\"", complexElement.getPath());
			row.put("\"LOGICAL_PATH\"", complexElement.getLogicalPath());
			row.put("\"FROM_TYPE\"", structure.getResourceType());
			for (int e = 0; e < elements.size(); e++) {
				Element element = elements.get(e);
				String name = element.getDefinition().getShortName();
				if (element instanceof ValueElement) {
					String ref = (String) ((ValueElement) element).getValue();
					if (name.toUpperCase(Locale.ENGLISH).equals("REFERENCE")) {// workarround

						String[] parts = ref.split("/");
						if (parts.length == 2) {
							// StructureDefinition def =
							// controller.getMetaRepository().getStructureDefinitionById(parts[0]);
							// if(def!=null){
							row.put("\"TO_TYPE\"", parts[0]);
							ref = Utils.checkUUID(parts[1]);
							// }
						}

					}
					String col = buildColumnName(element.getDefinition().getShortName());
					row.put(col, ref);
				}
				if (element instanceof ArrayElement) {
					writeArrayElement((ArrayElement) element, structure, namedTables, prefix + name + "_", context);
					continue;
				}
				if (element instanceof ComplexElement) {
					writeComplexElement((ComplexElement) element, structure, namedTables, prefix + name + "_", context);
				}
			}
			buffer.addRow(row);

		} else {

			// System.out.println("ComplexElement:"+complexElement.getPath()+":"+complexElement.getLogicalPath()+":"+complexElement);
			List<Element> elements = complexElement.getElements();

			// String tName =
			// structure.getResourceType()+"_"+complexElement.getDefinition().getType().getId();
			// TODO: Change this logic to be in sync with
			// com.legacy.health.fhir.meta.sql.SchemaControllerImpl.buildTableName(..)

			String tName = complexElement.getDefinition().getType().getId();
			if (!structure.getResourceType().equals(complexElement.getDefinition().getType().getId())) {
				log.trace("structureResourceType: " + structure.getResourceType() + " Id: "
						+ complexElement.getDefinition().getType().getId());
				if (!complexElement.getDefinition().getType().getId().contains(".")) {
					tName = structure.getResourceType() + "_" + complexElement.getDefinition().getType().getId();
				}
			}

			String fullName = buildColumnName(tName);
			Table table = namedTables.get(fullName);
			if (table == null) {
				// log.warn("Didn't find table " + fullName + " - try workarround to replace '.'
				// with " + fullName.replaceAll("\\.", "_"));
				table = namedTables.get(fullName.replaceAll("\\.", "_"));
			}
			RowBuffer buffer = this.getRowBuffer(table, context.getConnection());
			HashMap<String, Object> row = new HashMap<String, Object>();
			// buffer.rows.add(row);
			if (complexElement.getDefinition().getId() == null) {
				log.warn("complexElement Definition Id is NULL for " + complexElement.toString());
			}
			row.put("\"PARENT_ID\"", getValue(structure, "id"));
			row.put("\"CANONICAL_ID\"", structure.getCanonicalReference());
			row.put("\"DATAELEMENT_ID\"", complexElement.getDefinition().getId());
			row.put("\"REFERENCE_PATH\"", complexElement.getPath());
			row.put("\"LOGICAL_PATH\"", complexElement.getLogicalPath());
			for (int e = 0; e < elements.size(); e++) {
				Element element = elements.get(e);
				String name = element.getDefinition().getShortName();
				if (element instanceof ValueElement) {
					String col = buildColumnName(element.getDefinition().getShortName());
					row.put(col, ((ValueElement) element).getValue());
				}
				if (element instanceof ArrayElement) {
					writeArrayElement((ArrayElement) element, structure, namedTables, prefix + name + "_", context);
					continue;
				}
				if (element instanceof ComplexElement) {
					writeComplexElement((ComplexElement) element, structure, namedTables, prefix + name + "_", context);
				}
			}
			buffer.addRow(row);
		}
		return false;
	}

	public void flushBuffer() throws SQLException {
		Set<Table> keys = buffers.keySet();
		for (Iterator<Table> iterator = keys.iterator(); iterator.hasNext();) {
			Table table = iterator.next();
			if (table == null)
				continue;
			RowBuffer buffer = buffers.get(table);
			buffer.flushBuffer();
		}

	}

}
