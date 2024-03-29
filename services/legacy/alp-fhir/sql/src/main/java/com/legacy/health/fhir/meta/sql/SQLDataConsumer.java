package com.legacy.health.fhir.meta.sql;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Properties;

import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.meta.repsitory.RepositoryBuilder;
import com.legacy.health.fhir.meta.repsitory.StructureConsumer;

public class SQLDataConsumer implements StructureConsumer {

	protected MetaRepository repo;
	protected DataWalker walker = new DataWalker();
	protected boolean ownConnection = false;
	protected Properties connectionProperties;
	protected String schema;
	protected HashMap<String, RelationSchemaController> controllers = new HashMap<String, RelationSchemaController>();

	public void setPathToSpec(String specPath) throws Exception {
		repo = RepositoryBuilder.createRepository(specPath);
	}

	public void setMetaRepository(MetaRepository repo) {
		this.repo = repo;
	}

	public void setIdPrefix(String idPrefix) {
		walker.setIdPrefix(idPrefix);
	}

	public void setConnectionValues(String driver, String url, String username, String password) {
		Properties prop = new Properties();
		prop.setProperty("datasource.driver", driver);
		prop.setProperty("datasource.url", url);
		prop.setProperty("datasource.username", username);
		prop.setProperty("datasource.password", password);
		this.connectionProperties = prop;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

	private Table resourceTable = null;

	public void writeStructure(Structure structure, Context ctx) throws SQLException {
		SQLContext context = (SQLContext) ctx;
		String type = structure.getResourceType();
		RelationSchemaController controller = controllers.get(type);
		if (controller == null) {
			// DriverManager.getDriver(context.getConnection().getMetaData().getURL()).getClass()
			controller = RelationSchemaController.createRelationSchemaController(schema,
					DriverManager.getDriver(context.getConnection().getMetaData().getURL()).getClass().getName());
			controller.createSchema(structure.getDefinition());
			controllers.put(type, controller);
		}
		walker.setController(controller);
		if (resourceTable == null) {
			resourceTable = controller.getResourceTable();
		}
		walker.writeStructure(structure, controller.getTables(), resourceTable, context);
	}

	public void flushData() throws SQLException {
		walker.flushBuffer();
	}

}
