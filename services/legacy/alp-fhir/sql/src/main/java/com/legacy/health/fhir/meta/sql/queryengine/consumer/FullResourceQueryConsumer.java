package com.legacy.health.fhir.meta.sql.queryengine.consumer;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.zip.GZIPInputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;
import com.legacy.health.fhir.meta.sql.Column;
import com.legacy.health.fhir.meta.sql.RelationSchemaController;
import com.legacy.health.fhir.meta.sql.SQLContext;
import com.legacy.health.fhir.meta.sql.SQLSchemaController;
import com.legacy.health.fhir.meta.sql.queryengine.PreparedStatementValues;
import com.legacy.health.fhir.meta.sql.queryengine.SQLBaseTable;
import com.legacy.health.fhir.meta.sql.queryengine.SQLBinaryExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLFrom;
import com.legacy.health.fhir.meta.sql.queryengine.SQLIntegerValue;
import com.legacy.health.fhir.meta.sql.queryengine.SQLIsXXNullExpression;
import com.legacy.health.fhir.meta.sql.queryengine.SQLJoin;
import com.legacy.health.fhir.meta.sql.queryengine.SQLLimit;
import com.legacy.health.fhir.meta.sql.queryengine.SQLQuery;
import com.legacy.health.fhir.meta.sql.queryengine.SQLResultColumn;

public class FullResourceQueryConsumer implements SQLQueryConsumer {

	private static final Logger log = LoggerFactory.getLogger(FullResourceQueryConsumer.class);

	protected static ObjectMapper mapper = new ObjectMapper();

	private SQLQuery wrapToGetFullResource(SQLQuery query, SQLSchemaController sqlSchemaControl) {
		assert (sqlSchemaControl instanceof RelationSchemaController);
		RelationSchemaController schemaControl = (RelationSchemaController) sqlSchemaControl;
		Column RESOURCE_COMPRESSED = schemaControl.getResourceTable().getColumnByName("\"RESOURCE_COMPRESSED\"");
		Column ID = schemaControl.getResourceTable().getColumnByName("\"ID\"");
		Column VALID_TO = schemaControl.getResourceTable().getColumnByName("\"VALID_TO\"");
		SQLQuery ret = new SQLQuery();

		ret.column(
				new SQLResultColumn().column(RESOURCE_COMPRESSED).alias("resourceTable"))
				.from(
						new SQLFrom()
								.table((SQLBaseTable) new SQLBaseTable().table(schemaControl.getResourceTable())
										.alias("resourceTable")))
				.join((SQLJoin) new SQLJoin().tableExpression(query).on(new SQLBinaryExpression()
						.left(new SQLResultColumn().alias("i2").column(query.getFromTable().getStructureLinkColumn()))
						.op("=").right(new SQLResultColumn().column(ID).alias("resourceTable"))).label("i2"))
				.filter(new SQLIsXXNullExpression().expression(new SQLResultColumn().column(VALID_TO)));
		return ret;
	}

	@Override
	public void executeQuery(StructureDefinition targetType, Query query, SQLQuery sqlQuery, StructureConsumer consumer,
			SQLSchemaController schemaControl, SQLContext context) throws Exception {
		long start = System.currentTimeMillis();
		SQLQuery wrappedQuery = wrapToGetFullResource(sqlQuery, schemaControl);

		if (query.isLastN()) {
			wrappedQuery.filter(
					new SQLBinaryExpression().left(new SQLResultColumn().alias("i2").column(new Column("rownum", null)))
							.op("<=").right(new SQLIntegerValue().value(query.getLastNMax())));
		}
		if (query.limit() != null) {
			SQLLimit limit = new SQLLimit().limit(query.limit().limit());
			if (query.limit().offset() != null) {
				limit.offset(query.limit().offset());
			}
			wrappedQuery.limit(limit);
		}
		log.debug(wrappedQuery.getSQL(new PreparedStatementValues()));

		try (PreparedStatement stmt = wrappedQuery.getStatement(context.getConnection());) {

			ResultSet rs = stmt.executeQuery();
			while (rs.next()) {
				try (InputStream bis = rs.getBinaryStream(1);
						GZIPInputStream is = new GZIPInputStream(bis);
						InputStreamReader reader = new InputStreamReader(is, Charset.forName("UTF-8"));) {
					StringWriter writer = new StringWriter();
					char[] buffer = new char[5000];
					for (int length = 0; (length = reader.read(buffer)) > 0;) {
						writer.write(buffer, 0, length);
					}
					String resourceString = writer.toString();
					JsonNode resource = mapper.readTree(resourceString);
					String type = resource.get("resourceType").asText();
					StructureDefinition sd = query.getQueryBuilder().getMetaRepository()
							.getStructureDefinitionById(type);
					JSONWalker jwalker = new JSONWalker();

					Structure structure = jwalker.fromJSON(resource, sd);
					consumer.writeStructure(structure, context);
				}
			}
			long stop = System.currentTimeMillis();
			log.info("SQL Execution:" + (stop - start));
		}

	}

}
