package com.legacy.health.fhir.meta.sql;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class SchemaFlatener {
	private Log log = LogFactory.getLog(SchemaFlatener.class);

	ArrayList<String> registeredViews = new ArrayList<String>();
	String sqlSchema;

	public SchemaFlatener(String sqlSchema) {
		this.sqlSchema = sqlSchema.toUpperCase();
	}

	public void flattenSchema(StructureDefinition sd) {
		Context context = new Context();
		context.root = sd;
		context.isRoot = true;
		flattenSchemaInternal(sd, context, "");
	}

	protected List<View> flattenSchemaInternal(StructureDefinition definition, Context context, String prefix) {
		handleComplexTypes(definition, context, prefix);
		List<View> simpleViews = handleSimpleTypeArray(definition, context, prefix);
		List<View> rootViews = handleRootElements(definition, context, simpleViews, prefix);

		return rootViews;
	}

	protected List<View> handleRootElements(StructureDefinition definition, Context context, List<View> childViews,
			String prefix) {
		String rootTableName = prefix + definition.getId().toUpperCase();
		String viewName = buildViewName(context, definition, prefix);
		List<DataElement> rootElements = definition.getDataElements().stream()
				.filter(element -> element.getMax() == 1
						&& element.getType() != null
						&& !element.getType().isComplex())
				.collect(Collectors.toList());
		String v = "";
		String idColumns = qte("ID");
		if (!context.isRoot) {
			idColumns = qte("PARENT_ID") + "," + qte("DATA_ELEMENT_ID");
		}
		v += "CREATE VIEW " + viewName + "AS (select %%L1_OWN_COLUMNS%% %%VIEW_COLUMNS%% from (";
		v += " select %%L2_OWNCOLUMNS%% from ( ";
		v += " select %%L2_OWNCOLUMNS%% ";
		v += " ROW_NUMBER() OVER(PARTITION BY \"PARENT_ID\", \"DATAELEMENT_ID\" ORDER BY REFERENCE_PATH ASC) row_num ";
		v += " FROM " + rootTableName;
		v += ") where row_num=1) s1 ";
		int s = 1;
		for (View view : childViews) {
			String alias = "s" + s;
			v += " left outer join \"" + view.name + '"' + alias + " on s1.\"PARENT_ID\"=" + alias
					+ ".\"PARENT_ID\" and s1.\"REFERENCE_PATH\"=" + alias + ".\"PARENT_PATH\"";
			s++;
		}
		v += ")";
		log.info(v);
		if (!context.isRoot) {
		}
		rootElements.forEach(element -> {
		});
		registeredViews.add(qte("FLAT_" + rootTableName));

		context.isRoot = false;
		return null;
	}

	public static String qte(String in) {
		return '"' + in + '"';
	}

	protected List<View> handleSimpleTypeArray(StructureDefinition definition, Context context, String prefix) {
		String rootTableName = prefix + definition.getId().toUpperCase();
		List<DataElement> arrayElements = definition.getDataElements().stream()
				.filter(element -> element.getMax() > 1 && element.getType() != null && !element.getType().isComplex())
				.collect(Collectors.toList());
		ArrayList<View> ret = new ArrayList<View>();
		arrayElements.forEach(element -> {
			String columnName = element.getShortName().toUpperCase();
			String viewName = qte(sqlSchema) + "." + qte("FLAT_" + rootTableName + "_" + columnName);
			String v = "";
			v += "CREATE VIEW " + viewName + " AS (select";
			v += " \"PARENT_ID\",";
			v += " \"PARENT_PATH\",";
			v += " \"VALUE\" as " + qte(columnName);
			v += " FROM( select \"PARENT_ID\",\"PARENT_PATH\",\"VALUE\",";
			v += " ROW_NUMBER() OVER(PARTITION BY \"PARENT_ID\",\"PARENT_PATH\" ORDER BY POS ASC) row_num ";
			v += " FROM " + qte(sqlSchema) + "." + qte(rootTableName + "_" + columnName) + " ) ";
			v += " where row_num=1)";
			log.info(v);
			View nView = new View();
			nView.name = viewName;
			nView.values = new ArrayList<String>();
			nView.values.add(columnName);
			ret.add(nView);
		});
		return ret;
	}

	protected void handleComplexTypes(StructureDefinition definition, Context context, String prefix) {
		List<DataElement> complexElements = definition.getDataElements().stream()
				.filter(element -> element.getType() != null && element.getType().isComplex())
				.collect(Collectors.toList());
		if (definition.getId().equals("Extension"))
			return;
		complexElements.forEach(element -> {
			String tableName = buildViewName(context, element.getType(), prefix);
			if (!hasView(tableName)) {
				registeredViews.add(tableName);
				this.flattenSchemaInternal(element.getType(), context, prefix);
			}

		});
	}

	private boolean hasView(String viewName) {
		return this.registeredViews.contains(viewName);
	}

	protected String buildViewName(Context context, StructureDefinition definition, String prefix) {
		String ret = (context.isRoot ? "" : context.root.getId() + "_") + prefix + definition.getId();
		return '"' + "FLAT_" + ret.toUpperCase().replaceAll("\\.", "_") + '"';
	}

	class View {
		String name;
		ArrayList<String> values;
	}

	class Context {
		StructureDefinition root;
		boolean isRoot;
	}
}
