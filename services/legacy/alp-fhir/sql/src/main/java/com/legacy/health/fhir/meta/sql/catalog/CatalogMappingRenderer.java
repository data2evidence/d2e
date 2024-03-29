package com.legacy.health.fhir.meta.sql.catalog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.content.model.CatalogDefinition;
import com.legacy.health.fhir.content.model.CatalogDefinition.Mapping;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.FhirRuntimeException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.fhirpath.FhirPathBuilder;
import com.legacy.health.fhir.meta.fhirpath.node.MapBasedCollectionNode;
import com.legacy.health.fhir.meta.instance.ArrayElement;
import com.legacy.health.fhir.meta.instance.ComplexElement;
import com.legacy.health.fhir.meta.instance.DefaultValueElement;
import com.legacy.health.fhir.meta.instance.Element;
import com.legacy.health.fhir.meta.instance.ElementContainer;
import com.legacy.health.fhir.meta.instance.InstanceNavigator;
import com.legacy.health.fhir.meta.instance.InstanceType;
import com.legacy.health.fhir.meta.instance.PojoArrayElement;
import com.legacy.health.fhir.meta.instance.PojoComplexElement;
import com.legacy.health.fhir.meta.instance.PojoStructure;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.instance.ValueElement;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.SQLContext;

public class CatalogMappingRenderer implements StructureBuilder {
	static ObjectMapper mapper = new ObjectMapper();
	static Logger log = Logger.getLogger(CatalogMappingRenderer.class.getName());

	@Override
	public void build(StructureConsumer consumer, Context context, CatalogDefinition def,
			HashMap<String, HashMap<String, Object>> allContext) throws FhirException {
		Set<String> keySet = allContext.keySet();
		for (String key : keySet) {
			this.buildSingleResource(consumer, context, def, allContext.get(key));
		}
	}

	protected Element handleMapping(MetaRepository repo,
			Mapping mapping,
			HashMap<String, Object> row,
			MapBasedCollectionNode node,
			Structure root,
			HashMap<String, Element> elementCache) {
		Element ret = null;
		node.setType(mapping.getTableid());
		if (row == null) {
			log.error("Row is null for Mapping" + mapping.getDataelement());
			throw new FhirRuntimeException("Row is null for Mapping" + mapping.getDataelement(), null);
		}
		if (mapping.getColumn() != null && row.get(mapping.getColumn()) == null)
			return null;
		if (!checkCondition(mapping, node))
			return null;
		DataElementStructureLink link = getDataElementStructureLink(repo, root.getDefinition(),
				mapping.getDataelement());
		if (link == null) {
			log.error("Doesn't found DataElement for path" + mapping.getDataelement());
			throw new FhirRuntimeException("Link is null for Mapping" + mapping.getDataelement(), null);
		}
		log.debug("Render for Link:" + link.getPath());
		DataElement de = link.getDataElement();
		DataType dt = de.getType();
		// if(!dt.isComplex()){
		Object value = null;
		if ("value".equals(mapping.getType())) {
			value = mapping.getValue();
		}
		if ("column".equals(mapping.getType())) {
			String column = mapping.getColumn();
			value = row.get(column);
			if (value != null) {
				if (mapping.getConceptmap() != null
						&& mapping.getConceptmap().getElementByPath("ConceptMap.group") != null) {
					Object obj = mapping.getConceptmap().getElementByPath("ConceptMap.group").getElementNode();
					String fieldType = getFieldType(repo, repo.getStructureDefinitionById(root.getDefinition().getId()),
							mapping.getDataelement().toString());
					if (fieldType != null && fieldType.equals("string")) {
						fieldType = "display";
					}

					String returnValue = fetchValue(obj, value, fieldType);
					if (returnValue != null) {
						value = returnValue;
					}

				}
			}
		}
		if ("expression".equals(mapping.getType())) {
			Object result = FhirPathBuilder.parseExpression(mapping.getExpression()).evaluate(node).getValue()
					.getRawValue();
			value = "" + result;
		}
		if ("complex".equals(mapping.getType())) {
			Element chk1 = InstanceNavigator.getElementByPath(root, mapping.getDataelement());
			if (chk1 == null) {// could be that direct parent is not yet integrated
				chk1 = elementCache.get(mapping.getDataelement());
			}
			InstanceNavigator.getElementsByDataElement(root, de);
			if (de.getMax() != 1) {
				if (chk1 != null && chk1 instanceof ArrayElement) {
					ArrayElement chkArray = (ArrayElement) chk1;
					if (chkArray.getDefinition().getId().equals(de.getId())) {
						ret = chkArray;
					}
				} else {
					PojoArrayElement arrElement = new PojoArrayElement();
					arrElement.setDefinition(de);
					elementCache.put(de.getId(), arrElement);
					ret = arrElement;
				}
			} else {
				PojoComplexElement complexElement = new PojoComplexElement();
				complexElement.setDefinition(de);
				ret = complexElement;
			}
		}
		if (value != null) {
			DefaultValueElement element = new DefaultValueElement();
			element.setDefinition(de);
			element.setValue(getValue(dt, value));
			ret = element;
		}
		if (mapping.getChildren() != null && mapping.getChildren().size() > 0) {
			boolean firstChild = true;
			for (Mapping children : mapping.getChildren()) {
				Element child = null;

				if (mapping.getTableid().equals(children.getTableid())) {
					child = handleMapping(repo, children, row, node, root, elementCache);
				} else {
					List<Mapping> childMappings = new ArrayList<Mapping>();
					childMappings.add(children);
					Object childData = row.get(children.getTableid());
					if (childData != null) {
						if (childData instanceof List<?>) {
							List<HashMap<String, Object>> childRows = (List<HashMap<String, Object>>) childData;
							PojoArrayElement childArray = new PojoArrayElement();
							for (HashMap<String, Object> childRow : childRows) {
								Element entry = this.handleMapping(repo, children, childRow, node, root, elementCache);
								childArray.addElement(entry);
								childArray.setDefinition(entry.getDefinition());
								child = childArray;

							}
						} else {
							HashMap<String, Object> childRow = (HashMap<String, Object>) childData;
							child = this.handleMapping(repo, children, childRow, node, root, elementCache);

						}
					}
					// set node for FHIR PathExpression back to this level.
					node.setType(mapping.getTableid());
				}
				if (child != null) {
					if (ret instanceof ElementContainer) {
						ElementContainer parent = resolveContainer(root, (ElementContainer) ret,
								mapping.getDataelement(), children.getDataelement());
						if (parent instanceof ArrayElement) {
							ArrayElement pArr = (ArrayElement) parent;
							if (pArr.getDefinition().getType().isComplex()) {
								if (firstChild) {
									firstChild = false;
									PojoComplexElement cElement = new PojoComplexElement();
									cElement.setDefinition(pArr.getDefinition());
									pArr.addElement(cElement);
								}
								parent = ((ElementContainer) pArr.getElements().get(pArr.getElements().size() - 1));
							}
							if (child.getDefinition().getMax() != 1 && !child.getDefinition().getType().isComplex()) {
								InstanceType type = getById(parent, child.getDefinition().getShortName());
								if (type == null) {
									PojoArrayElement arrChild = new PojoArrayElement();
									arrChild.setDefinition(child.getDefinition());
									arrChild.addElement(child);
									child = arrChild;
								}
								if (type instanceof ArrayElement) {
									parent = (ElementContainer) type;
								}
							}
							parent.addElement(child);
						} else {
							if (child.getDefinition().getMax() != 1 && !child.getDefinition().getType().isComplex()) {
								InstanceType type = getById(parent, child.getDefinition().getShortName());
								if (type == null) {
									PojoArrayElement arrChild = new PojoArrayElement();
									arrChild.setDefinition(child.getDefinition());
									arrChild.addElement(child);
									child = arrChild;
								}
								if (type instanceof ArrayElement) {
									parent = (ElementContainer) type;
								}
							}
							parent.addElement(child);
						}
					} else {// ValueElement
						if ("Extension".equals(child.getDefinition().getType().getId())) {
							if (ret instanceof ValueElement && child instanceof ArrayElement) {
								ValueElement vElement = (ValueElement) ret;
								ArrayElement extArr = (ArrayElement) child;
								if (vElement.getValueExtension() != null) {
									for (int i = 0; i < extArr.getElements().size(); i++) {
										vElement.getValueExtension().addElement(extArr.getElements().get(i));
									}
								} else {
									((ValueElement) ret).setFieldExtension((ArrayElement) child);
								}
							}
						}
					}
				}
			}
		}
		// }
		return ret;
	}

	protected void handleRow(MetaRepository repo,
			PojoStructure root,
			List<Mapping> mappings,
			HashMap<String, Object> row,
			HashMap<String, Element> elementCache) {
		MapBasedCollectionNode node = null;
		node = MapBasedCollectionNode.create(row);
		for (Mapping mapping : mappings) {
			Element child = handleMapping(repo, mapping, row, node, root, elementCache);
			if (child != null) {
				ElementContainer parent = resolveContainer(root, root, root.getLogicalPath(), mapping.getDataelement());
				if (child.getDefinition().getMax() != 1 && !child.getDefinition().getType().isComplex()) {
					InstanceType type = getById(parent, child.getDefinition().getShortName());
					if (type == null) {
						PojoArrayElement arrChild = new PojoArrayElement();
						arrChild.setDefinition(child.getDefinition());
						arrChild.addElement(child);
						child = arrChild;
					}
					if (type instanceof ArrayElement) {
						((ArrayElement) type).addElement(child);
					}
				}
				if (parent != null) {
					parent.addElement(child);
				}
			}
		}
	}

	protected InstanceType getById(ElementContainer context, String id) {
		for (Element element : context.getElements()) {
			if (element.getDefinition().getShortName().equals(id)) {
				return element;
			}
		}
		return null;
	}

	public DataElement getChildElement(ElementContainer parent, String name) {
		DataElement ret = null;
		if (parent instanceof Structure) {
			StructureDefinition sd = ((Structure) parent).getDefinition();
			ret = sd.getDataElementByName(name);
		}
		if (parent instanceof ComplexElement) {
			ret = ((ComplexElement) parent).getDefinition().getType().getDataElementByName(name);
		}
		return ret;
	}

	public ElementContainer resolveContainer(Structure root, ElementContainer context, String contextPath,
			String path) {

		int index = path.indexOf(contextPath);
		if (index == 0) {
			String relPath = path.substring(contextPath.length() + 1);
			String[] segments = relPath.split("\\.");
			InstanceType current = context;
			for (int i = 0; i < segments.length - 1; i++) {
				if (current instanceof ElementContainer) {
					ElementContainer parent = (ElementContainer) current;
					current = getById(parent, segments[i]);
					if (current == null) {
						DataElement childElement = getChildElement(parent, segments[i]);
						DataType childType = childElement.getType();
						if (childElement.getMax() != 1 && childType.isComplex()) {//
							PojoArrayElement aElement = new PojoArrayElement();
							aElement.setDefinition(childElement);
							parent.addElement(aElement);
							PojoComplexElement cElement = new PojoComplexElement();
							cElement.setDefinition(childElement);
							aElement.addElement(cElement);
							current = cElement;
						}
						if (childElement.getMax() == 1 && childType.isComplex()) {//
							PojoComplexElement cElement = new PojoComplexElement();
							cElement.setDefinition(childElement);
							parent.addElement(cElement);
							current = cElement;
						}
					} else {
						if (current instanceof ArrayElement) {
							ArrayElement arr = (ArrayElement) current;
							int pos = arr.getElements().size() - 1;
							if (pos == -1) {
								log.error("not able to resolve last element of Array");
							} else {
								current = arr.getElements().get(arr.getElements().size() - 1);

							}
						}
					}
				}
			}
			if (current instanceof ElementContainer) {
				return (ElementContainer) current;
			}
		}
		return null;
	}

	protected MetaRepository getRepo(Context context) {
		if (context instanceof SQLContext) {
			return ((SQLContext) context).getRepo();
		}
		if (context instanceof RequestContext) {
			return ((RequestContext) context).getMetaRepo();
		}
		return null;
	}

	protected void buildSingleResource(StructureConsumer consumer, Context context, CatalogDefinition def,
			HashMap<String, Object> resourceContext) throws FhirException {
		HashMap<String, Element> elementCache = new HashMap<String, Element>();
		JSONWalker walker = new JSONWalker();
		walker.setMetaRepository(getRepo(context));
		def.getTarget().getId();
		Set<String> tables = resourceContext.keySet();
		PojoStructure root = new PojoStructure();
		root.setDefinition(def.getTarget());
		for (String table : tables) {
			Object entry = resourceContext.get(table);
			List<CatalogDefinition.Mapping> mappings = def.getMapping().stream()
					.filter(f -> table.equals(f.getTableid())).collect(Collectors.toList());
			if (entry instanceof List) {
				List<HashMap<String, Object>> entries = (List<HashMap<String, Object>>) entry;
				for (HashMap<String, Object> row : entries) {
					this.handleRow(getRepo(context), root, mappings, row, elementCache);
				}
			} else {
				HashMap<String, Object> row = (HashMap<String, Object>) entry;
				this.handleRow(getRepo(context), root, mappings, row, elementCache);
			}

		}
		JsonNode rootJson = walker.toJSON(root);

		Structure structure = walker.fromJSON(rootJson);
		try {
			consumer.writeStructure(structure, context);
		} catch (Exception e) {
			throw new FhirException("Error during returning structure", e);
		}

	}

	protected boolean checkCondition(CatalogDefinition.Mapping mapping, MapBasedCollectionNode node) {
		if (mapping.getCondition() != null && !mapping.getCondition().equals("false")) {
			Boolean ret = FhirPathBuilder.parseExpression(mapping.getCondition()).evaluate(node).asBoolean();
			return ret;
		}
		if ("false".equals(mapping.getCondition()))
			return false;
		return true;
	}

	private Object getValue(DataType type, Object value) {
		switch (type.getId()) {
			case "decimal":
				return Double.parseDouble(value.toString());
			case "integer":
			case "unsignedint":
			case "positiveint":
				return Integer.parseInt(value.toString());

			default:
				return value.toString();
		}

	}

	private static DataElementStructureLink getDataElementStructureLink(MetaRepository repo,
			StructureDefinition definition, String path) {
		DataElementStructureLink dsl = repo.getElementByPath(definition, path);
		return dsl;
	}

	private String fetchValue(Object obj, Object value, String fieldType) {

		if (obj instanceof ArrayNode) {
			ArrayNode nodeArray = (ArrayNode) obj;
			Iterator<JsonNode> iterator = nodeArray.iterator();
			while (iterator.hasNext()) {
				JsonNode jsonNode = iterator.next();

				String returnValue = fetchValue(jsonNode, value, fieldType);
				if (returnValue != null) {
					if (returnValue instanceof String) {
						return returnValue;
					}
					return fetchValue(jsonNode, value, fieldType);
				}

			}
		}

		if (obj instanceof ObjectNode) {
			ObjectNode objNode = (ObjectNode) obj;
			if (objNode.has("code") && objNode.findValue("code").asText().equals(value.toString())) {
				JsonNode res = objNode.path("target").path(0).path(fieldType);
				if (res.isValueNode()) {
					return res.asText();
				}
			} else if (objNode.has("element")) {
				ArrayNode node1 = (ArrayNode) objNode.get("element");
				String returnValue = fetchValue(node1, value, fieldType);

				if (returnValue == null) {
					if (objNode.has("unmapped")) {
						ObjectNode unmappedObjNode = (ObjectNode) objNode.get("unmapped");
						return fetchValue(unmappedObjNode, value, fieldType);
					}
				}

				return returnValue;
			}
		}

		return null;
	}

	private String getFieldType(MetaRepository repo, StructureDefinition sd, String de) {

		DataElementStructureLink link = repo.getElementByPath(sd, de);
		DataElement element = link.getDataElement();
		if (element != null) {
			return element.getType().getId();
		}

		String strArray[] = de.split("\\.");
		if (strArray.length == 0) {
			return null;
		}

		String temp = null;
		String type = null;
		for (int i = 0; i < strArray.length; i++) {
			if (i == 0) {
				temp = strArray[i];
				continue;
			}
			temp = temp + "." + strArray[i];

			if (i == 1) {
				temp = type = getType(temp, sd);
			} else {
				temp = type = getType(temp, repo.getStructureDefinitionById(type));
			}
		}

		return type;
	}

	private String getType(String path, StructureDefinition sd) {
		DataElement de = sd.getDataElement(path);
		DataType dt = de.getType();
		return dt.getId();
	}

}
