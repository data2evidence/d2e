package com.legacy.health.fhir.meta.sql.queryengine.consumer;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.DefaultValueElement;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.impl.StructureImpl;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;

public class DetailedQueryConsumer implements SQLQueryConsumer {

	protected static ObjectMapper mapper = new ObjectMapper();

	@Override
	public void executeQuery(StructureDefinition definition, Query query, SQLQuery sqlQuery, StructureConsumer consumer,
			SQLSchemaController schemaControl, SQLContext context) throws Exception {
		List<Expression> re = query.getResultElements();
		PreparedStatement stmt = sqlQuery.getStatement(context.getConnection());
		ResultSet rs = stmt.executeQuery();
		while (rs.next()) {
			StructureImpl ret = new StructureImpl(null);
			ret.setDefinition(definition);
			for (int c = 0; c < re.size(); c++) {
				Expression e = re.get(c);
				DataElement de;
				DefaultValueElement element;
				if (e instanceof ResultElement) {
					DataElementStructureLink link = ((ResultElement) e).getDataElementStructureLink();
					element = new DefaultValueElement();
					element.setDefinition(link.getDataElement());
					de = link.getDataElement();
				} else {
					element = new DefaultValueElement();
					de = definition.getDataElementByName(e.label());
				}
				element.setDefinition(de);
				ret.addElement(element);
				String type = de.getType().getId();
				switch (type) {
					case "string":
					case "code":
					case "id":
						element.setValue(rs.getString(c + 1));
						break;
					case "decimal":
						element.setValue(rs.getDouble(c + 1));
						break;
					default:
						element.setValue(rs.getObject(c + 1));
				}
			}
			consumer.writeStructure(ret, context);
		}
		stmt.close();

	}
}