package legacy.health.genomics.vcf.parser.capability;

import legacy.health.genomics.vcf.environment.EnvironmentDetails;
import legacy.health.genomics.vcf.parser.datamodel.*;
import legacy.health.genomics.vcf.parser.exceptions.BodyParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.inputmodels.IDataConsumer;
import legacy.health.genomics.vcf.parser.inputmodels.IErrorConsumer;
import legacy.health.genomics.vcf.parser.capability.InvalidDataline;

import java.sql.*;
import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.logging.Level;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by D058991 on 23.02.2018.
 */
public class HDBConsumer implements IDataConsumer, IErrorConsumer {

	private static final Logger LOGGER = LoggerFactory.getLogger(HDBConsumer.class);
	private BlockingQueue<Dataline> blockingQueue;
	private BlockingQueue<Exception> errorQueue;
	private int parallelCount;
	private int errorCount;
	private Connection connection;
	private List<DataRowProcessor> processor;
	private List<Thread> threads;
	private ImportConfiguration config;
	private String schemaName;

	private Connection getConnection(ImportConfiguration config) throws EnvironmentException, SQLException {
		EnvironmentDetails env = new EnvironmentDetails(config);
		Connection conn = null;
		try {
			conn = env.getConnection();
			if (conn == null) {
				conn = DriverManager.getConnection("jdbc:sap://" + config.getHost() + "/?autocommit=false",
						config.getUser(), config.getPassword());
			}

			this.schemaName = env.getSchemaName();
		} catch (SQLException e) {
			conn.close();
			LOGGER.error("Error connecting to database", e);
			throw e;
		} catch (EnvironmentException e) {
			if (conn != null) {
				conn.close();
			}
			LOGGER.error("Error : Could not get schema name", e);
			throw e;
		}

		return conn;
	}

	static class DataRowProcessor implements Runnable {

		private Connection connection;
		private List<TableBase> tables;

		private BlockingQueue<Dataline> blockingQueue;
		private BlockingQueue<Exception> errorQueue;
		private ImportConfiguration config;

		DataRowProcessor(BlockingQueue<Dataline> queue, BlockingQueue<Exception> errorQueue, ImportConfiguration config)
				throws SQLException, EnvironmentException {
			connection = getConnection(config);
			connection.setAutoCommit(false);
			tables = new LinkedList<>();
			this.blockingQueue = queue;
			this.config = config;
			this.errorQueue = errorQueue;
		}

		void consumeDataRow(Dataline line) throws Exception {
			for (TableBase t : tables) {
				try {
					t.consumeDataRow(line);
				} catch (Exception e) {
					for (TableBase t2 : tables) {
						t2.rollback(line.getSourceLine(), config.getDwid());
					}
					throw e;
				}
			}
		}

		@Override
		public void run() {
			while (true) {
				Dataline line;
				try {
					line = this.blockingQueue.take();
				} catch (InterruptedException ex) {
					java.util.logging.Logger.getLogger(HDBConsumer.class.getName()).log(Level.SEVERE, null, ex);
					return;
				}
				if (line instanceof InvalidDataline) {
					try {
						close();
					} catch (SQLException e) {
						LOGGER.error("Error closing Consumer SubJob", e);
					}
					return;
				} else {
					try {
						consumeDataRow(line);
					} catch (Exception ex) {
						errorQueue.add(ex);
					}
				}

			}
		}

		private void addTable(TableBase snvVariants) {
			tables.add(snvVariants);
		}

		private void checkHeaderAgainstDatabase(Map<String, List<String>> tableToMissingFieldsMap) throws SQLException {
			for (TableBase table : tables) {
				table.checkHeaderAgainstDatabase(tableToMissingFieldsMap);
			}
		}

		private void init() throws SQLException, EnvironmentException {
			for (TableBase table : tables) {
				table.init();
			}
		}

		void close() throws SQLException {
			for (TableBase table : tables) {
				table.close();
			}
			connection.close();

		}

		Connection getConnection() throws EnvironmentException {
			EnvironmentDetails env = new EnvironmentDetails(config);
			return env.getConnection();
		}

		Connection getConnection(ImportConfiguration config) throws EnvironmentException {
			EnvironmentDetails env = new EnvironmentDetails(config);
			return env.getConnection();
		}
	}

	public HDBConsumer(ImportConfiguration config) throws EnvironmentException, SQLException {
		this.config = config;
		connection = getConnection(this.config);
		connection.setAutoCommit(false);
		errorCount = 0;
		this.processor = new LinkedList<>();
		this.parallelCount = config.getParallelCount();
		this.blockingQueue = new LinkedBlockingQueue<>(parallelCount * 10);
		this.errorQueue = new LinkedBlockingQueue<>();
		this.threads = new LinkedList<>();
		for (int i = 0; i < this.parallelCount; i++) {
			this.processor.add(new DataRowProcessor(blockingQueue, errorQueue, config));
		}
	}

	@Override
	public boolean consumeDataRow(Dataline line) throws Exception {
		if (this.parallelCount == 1) {
			this.processor.get(0).consumeDataRow(line);
			return true;
		} else {
			this.blockingQueue.put(line);
			while (!this.errorQueue.isEmpty()) {
				Exception take = this.errorQueue.take();
				this.errorCount += 1;
				this.consumeError(take, line.getSourceLine());
			}
			return this.errorCount < 10;
		}
	}

	@Override
	public void consumeHeader(VCFStructureDefinition vcfFileDefintion)
			throws BodyParseException, SQLException, EnvironmentException {

		LOGGER.info("Consumer received Header information");

		for (DataRowProcessor processor : this.processor) {
			processor.addTable(new SNVVariants(vcfFileDefintion, processor.getConnection(), config));
			processor.addTable(new SNVVariantAlleles(vcfFileDefintion, processor.getConnection(), config));
			processor.addTable(new SNVVariantMV(vcfFileDefintion, processor.getConnection(), config));
			processor.addTable(new SNVGenotypes(vcfFileDefintion, processor.getConnection(), config));
			processor.addTable(new SNVGenotypeAlleles(vcfFileDefintion, processor.getConnection(), config));
			processor.addTable(new SNVGenotypeMV(vcfFileDefintion, processor.getConnection(), config));
			processor.addTable(new SNVVariantIds(processor.getConnection(), config));
			processor.addTable(new SNVHaplotype(processor.getConnection(), config));
			processor.addTable(new SNVVariantStructuredAttributes(processor.getConnection(), config));

		}
		Map<String, List<String>> tableToMissingFieldsMap = new HashMap<>();

		processor.get(0).checkHeaderAgainstDatabase(tableToMissingFieldsMap);

		if (!tableToMissingFieldsMap.isEmpty()) {
			StringBuilder builder = new StringBuilder();
			builder.append("Following entries are missing or wrong type\n");
			for (Map.Entry<String, List<String>> x : tableToMissingFieldsMap.entrySet()) {
				builder.append("##### ").append(x.getKey()).append("\n");
				for (String attr : x.getValue()) {
					builder.append("\t").append(attr).append("\n");
				}
			}
			LOGGER.info(builder.toString());
			extendVCFDataModel(tableToMissingFieldsMap);
			// throw new BodyParseException("DataModel does not match VCF file");
		}

		for (DataRowProcessor processor : this.processor) {
			processor.init();
		}

		if (this.parallelCount > 1) {
			for (DataRowProcessor processor : this.processor) {
				Thread thread = new Thread(processor);
				this.threads.add(thread);
				thread.start();
			}
		}

	}

	private void extendVCFDataModel(Map<String, List<String>> tableToMissingFieldsMap)
			throws EnvironmentException, SQLException {
		for (Map.Entry<String, List<String>> x : tableToMissingFieldsMap.entrySet()) {
			String tableName = x.getKey();
			List<String> missingColumns = x.getValue();
			extendTable(tableName, missingColumns);
		}

	}

	private void extendTable(String tableName, List<String> allColumns) throws EnvironmentException, SQLException {

		LOGGER.debug("\n Extending table :" + tableName);

		String ATTRIBUTE_TABLEEXTENSION_DELIMITER = "-Attr.";
		String FILTER_TABLEEXTENSION_DELIMITER = "-Filter.";
		String actualTableName = "";
		Boolean isAttribute = true;
		List<String> tableExtensionQueryList;

		if (tableName.endsWith(ATTRIBUTE_TABLEEXTENSION_DELIMITER)) {
			actualTableName = tableName.split(ATTRIBUTE_TABLEEXTENSION_DELIMITER)[0];
		} else if (tableName.endsWith(FILTER_TABLEEXTENSION_DELIMITER)) {
			actualTableName = tableName.split(FILTER_TABLEEXTENSION_DELIMITER)[0];
			isAttribute = false;
		}
		EnvironmentDetails environment = new EnvironmentDetails(this.config);
		try (Connection dtConnection = environment.getDTUserConnection()) {
			if (isAttribute) {
				tableExtensionQueryList = formTableExtensionQuery(actualTableName, allColumns);
			}

			else {
				tableExtensionQueryList = formTableExtensionQueryForFilters(actualTableName, allColumns);

			}

			for (String query : tableExtensionQueryList) {

				if (query.contentEquals(tableExtensionQueryList.get(tableExtensionQueryList.size() - 4))) {
					CallableStatement stmt = dtConnection.prepareCall(query);
					stmt.registerOutParameter("RETURN_CODE", java.sql.Types.INTEGER);
					stmt.execute();
					int statusActivation = stmt.getInt("RETURN_CODE");
					if (statusActivation == 0 || statusActivation == 1) {
						LOGGER.info("\n-----------Table :" + actualTableName + " extended Successfully------------");

					} else {
						LOGGER.error("\n-----------Error Extending Table :" + actualTableName + " ------------");
						throw new BodyParseException("Error extending table :" + actualTableName);
					}
				}

				else {
					PreparedStatement preSQL = dtConnection.prepareStatement(query);
					preSQL.executeUpdate();
					LOGGER.debug("\n----------Query :" + query + " executed successfully---------");

				}

				
			}
		}

		catch (Exception e) {
			LOGGER.error("An error occured " + "\n" + "Error Message :" + e.getMessage());
			throw new SQLException("An error occurred in sql execution " + e.getMessage());
		}

	}

	private List<String> formTableExtensionQuery(String tableName, List<String> allColumns)
			throws EnvironmentException, SQLException {

		List<String> allQueries = new ArrayList<String>();
		String schemaName = this.getSchemaName();
		String[] cdsNameSplit = tableName.split("\\.");
		String cdsFileName = cdsNameSplit[cdsNameSplit.length - 1];
		String attributeName;
		String attributeFileName = "";
		String uniqueID = UUID.randomUUID().toString();
		uniqueID = uniqueID.replaceAll("-", "");
		String PACKAGE_NAME = "com.sap.chp.genomics";
		String packageFileName = ".package"+uniqueID+".hdbcds";
		PACKAGE_NAME += uniqueID;
		if (cdsFileName.contains("MultiValueAttributes")) {
			attributeName = cdsFileName;
		}
		else {
			attributeName = cdsFileName.substring(0, cdsFileName.length() - 1) + "Attributes";
		}
		attributeFileName+= attributeName+uniqueID;
		
		String attributeToExtend = tableName.split("::")[0] + ".generated" + "::SNV." + attributeName;
		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #PATHS LIKE _SYS_DI.TT_FILESFOLDERS_CONTENT");

		allQueries.add(
				"INSERT INTO #PATHS (PATH, CONTENT) VALUES ('.hdiconfig', '{\"plugin_version\":\"2.0.31.0\",\"file_suffixes\":{\"hdbcollection\":{\"plugin_name\":\"com.sap.hana.di.collection\"},\"hdbsystemversioning\":{\"plugin_name\":\"com.sap.hana.di.systemversioning\"},\"hdbsynonym\":{\"plugin_name\":\"com.sap.hana.di.synonym\"},\"hdbsynonymconfig\":{\"plugin_name\":\"com.sap.hana.di.synonym.config\"},\"hdbtable\":{\"plugin_name\":\"com.sap.hana.di.table\"},\"hdbdropcreatetable\":{\"plugin_name\":\"com.sap.hana.di.dropcreatetable\"},\"hdbvirtualtable\":{\"plugin_name\":\"com.sap.hana.di.virtualtable\"},\"hdbvirtualtableconfig\":{\"plugin_name\":\"com.sap.hana.di.virtualtable.config\"},\"hdbindex\":{\"plugin_name\":\"com.sap.hana.di.index\"},\"hdbfulltextindex\":{\"plugin_name\":\"com.sap.hana.di.fulltextindex\"},\"hdbconstraint\":{\"plugin_name\":\"com.sap.hana.di.constraint\"},\"hdbtrigger\":{\"plugin_name\":\"com.sap.hana.di.trigger\"},\"hdbstatistics\":{\"plugin_name\":\"com.sap.hana.di.statistics\"},\"hdbview\":{\"plugin_name\":\"com.sap.hana.di.view\"},\"hdbcalculationview\":{\"plugin_name\":\"com.sap.hana.di.calculationview\"},\"hdbprojectionview\":{\"plugin_name\":\"com.sap.hana.di.projectionview\"},\"hdbprojectionviewconfig\":{\"plugin_name\":\"com.sap.hana.di.projectionview.config\"},\"hdbresultcache\":{\"plugin_name\":\"com.sap.hana.di.resultcache\"},\"hdbcds\":{\"plugin_name\":\"com.sap.hana.di.cds\"},\"hdbfunction\":{\"plugin_name\":\"com.sap.hana.di.function\"},\"hdbvirtualfunction\":{\"plugin_name\":\"com.sap.hana.di.virtualfunction\"},\"hdbvirtualfunctionconfig\":{\"plugin_name\":\"com.sap.hana.di.virtualfunction.config\"},\"hdbhadoopmrjob\":{\"plugin_name\":\"com.sap.hana.di.virtualfunctionpackage.hadoop\"},\"jar\":{\"plugin_name\":\"com.sap.hana.di.virtualfunctionpackage.hadoop\"},\"hdbtabletype\":{\"plugin_name\":\"com.sap.hana.di.tabletype\"},\"hdbprocedure\":{\"plugin_name\":\"com.sap.hana.di.procedure\"},\"hdbvirtualprocedure\":{\"plugin_name\":\"com.sap.hana.di.virtualprocedure\"},\"hdbvirtualprocedureconfig\":{\"plugin_name\":\"com.sap.hana.di.virtualprocedure.config\"},\"hdbafllangprocedure\":{\"plugin_name\":\"com.sap.hana.di.afllangprocedure\"},\"hdblibrary\":{\"plugin_name\":\"com.sap.hana.di.library\"},\"hdbsequence\":{\"plugin_name\":\"com.sap.hana.di.sequence\"},\"hdbrole\":{\"plugin_name\":\"com.sap.hana.di.role\"},\"hdbroleconfig\":{\"plugin_name\":\"com.sap.hana.di.role.config\"},\"hdbstructuredprivilege\":{\"plugin_name\":\"com.sap.hana.di.structuredprivilege\"},\"hdbanalyticprivilege\":{\"plugin_name\":\"com.sap.hana.di.analyticprivilege\"},\"hdbtabledata\":{\"plugin_name\":\"com.sap.hana.di.tabledata\"},\"csv\":{\"plugin_name\":\"com.sap.hana.di.tabledata.source\"},\"properties\":{\"plugin_name\":\"com.sap.hana.di.tabledata.properties\"},\"tags\":{\"plugin_name\":\"com.sap.hana.di.tabledata.properties\"},\"hdbgraphworkspace\":{\"plugin_name\":\"com.sap.hana.di.graphworkspace\"},\"hdbflowgraph\":{\"plugin_name\":\"com.sap.hana.di.flowgraph\"},\"hdbreptask\":{\"plugin_name\":\"com.sap.hana.di.reptask\"},\"hdbsearchruleset\":{\"plugin_name\":\"com.sap.hana.di.searchruleset\"},\"hdbtextconfig\":{\"plugin_name\":\"com.sap.hana.di.textconfig\"},\"hdbtextdict\":{\"plugin_name\":\"com.sap.hana.di.textdictionary\"},\"hdbtextrule\":{\"plugin_name\":\"com.sap.hana.di.textrule\"},\"hdbtextinclude\":{\"plugin_name\":\"com.sap.hana.di.textrule.include\"},\"hdbtextlexicon\":{\"plugin_name\":\"com.sap.hana.di.textrule.lexicon\"},\"hdbtextminingconfig\":{\"plugin_name\":\"com.sap.hana.di.textminingconfig\"},\"txt\":{\"plugin_name\":\"com.sap.hana.di.copyonly\"}}}')");
		allQueries
				.add("INSERT INTO #PATHS (PATH, CONTENT) VALUES ('"+packageFileName+"', 'package " + PACKAGE_NAME + ";')");
		String query = "INSERT INTO #PATHS (PATH, CONTENT) VALUES ('" + attributeFileName + ".hdbcds', 'namespace "
				+ PACKAGE_NAME + ";in package " + PACKAGE_NAME + ";using " + attributeToExtend + ";extend type "
				+ attributeName + " with {";

		for (String column : allColumns) {
			String[] columnArray = column.split(":");
			query += columnArray[0]; // column Name
			query += " : " + columnArray[1] + ";";
		}
		query = query + "};' )";
		allQueries.add(query);
		allQueries.add("CALL " + schemaName + "#DI.WRITE(#PATHS, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?)");
		allQueries.add("DROP TABLE #PATHS");

		// Deploy queries

		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #DEPLOY_PATHS LIKE _SYS_DI.TT_FILESFOLDERS");
		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #UNDEPLOY_PATHS LIKE _SYS_DI.TT_FILESFOLDERS");
		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #PATH_PARAMETERS LIKE _SYS_DI.TT_FILESFOLDERS_PARAMETERS");

		allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('.hdiconfig')");
		//allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('.package.hdbcds' )");
		allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('"+packageFileName+"' )");
		allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('" + attributeFileName + ".hdbcds' )");
		allQueries.add("CALL " + schemaName
				+ "#DI.MAKE(#DEPLOY_PATHS, #UNDEPLOY_PATHS, #PATH_PARAMETERS, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?)");
		allQueries.add("DROP TABLE #DEPLOY_PATHS");
		allQueries.add("DROP TABLE #UNDEPLOY_PATHS");
		allQueries.add("DROP TABLE #PATH_PARAMETERS");
		return allQueries;
	}

	private List<String> formTableExtensionQueryForFilters(String tableName, List<String> allColumns)
			throws EnvironmentException, SQLException {
		
		String filters = "Filters";
		String filterFileName = "";
		List<String> allQueries = new ArrayList<String>();
		String schemaName = this.getSchemaName();
		String uniqueID = UUID.randomUUID().toString();
		uniqueID = uniqueID.replaceAll("-", "");
		
		filterFileName = filters+uniqueID+".hdbcds";
		String PACKAGE_NAME = "com.sap.chp.genomics";
		String packageFileName = ".package"+uniqueID+".hdbcds";
		PACKAGE_NAME += uniqueID;
		String attributeToExtend = tableName.split("::")[0] + ".generated" + "::SNV." + filters;
		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #PATHS LIKE _SYS_DI.TT_FILESFOLDERS_CONTENT");

		allQueries.add(
				"INSERT INTO #PATHS (PATH, CONTENT) VALUES ('.hdiconfig', '{\"plugin_version\":\"2.0.31.0\",\"file_suffixes\":{\"hdbcollection\":{\"plugin_name\":\"com.sap.hana.di.collection\"},\"hdbsystemversioning\":{\"plugin_name\":\"com.sap.hana.di.systemversioning\"},\"hdbsynonym\":{\"plugin_name\":\"com.sap.hana.di.synonym\"},\"hdbsynonymconfig\":{\"plugin_name\":\"com.sap.hana.di.synonym.config\"},\"hdbtable\":{\"plugin_name\":\"com.sap.hana.di.table\"},\"hdbdropcreatetable\":{\"plugin_name\":\"com.sap.hana.di.dropcreatetable\"},\"hdbvirtualtable\":{\"plugin_name\":\"com.sap.hana.di.virtualtable\"},\"hdbvirtualtableconfig\":{\"plugin_name\":\"com.sap.hana.di.virtualtable.config\"},\"hdbindex\":{\"plugin_name\":\"com.sap.hana.di.index\"},\"hdbfulltextindex\":{\"plugin_name\":\"com.sap.hana.di.fulltextindex\"},\"hdbconstraint\":{\"plugin_name\":\"com.sap.hana.di.constraint\"},\"hdbtrigger\":{\"plugin_name\":\"com.sap.hana.di.trigger\"},\"hdbstatistics\":{\"plugin_name\":\"com.sap.hana.di.statistics\"},\"hdbview\":{\"plugin_name\":\"com.sap.hana.di.view\"},\"hdbcalculationview\":{\"plugin_name\":\"com.sap.hana.di.calculationview\"},\"hdbprojectionview\":{\"plugin_name\":\"com.sap.hana.di.projectionview\"},\"hdbprojectionviewconfig\":{\"plugin_name\":\"com.sap.hana.di.projectionview.config\"},\"hdbresultcache\":{\"plugin_name\":\"com.sap.hana.di.resultcache\"},\"hdbcds\":{\"plugin_name\":\"com.sap.hana.di.cds\"},\"hdbfunction\":{\"plugin_name\":\"com.sap.hana.di.function\"},\"hdbvirtualfunction\":{\"plugin_name\":\"com.sap.hana.di.virtualfunction\"},\"hdbvirtualfunctionconfig\":{\"plugin_name\":\"com.sap.hana.di.virtualfunction.config\"},\"hdbhadoopmrjob\":{\"plugin_name\":\"com.sap.hana.di.virtualfunctionpackage.hadoop\"},\"jar\":{\"plugin_name\":\"com.sap.hana.di.virtualfunctionpackage.hadoop\"},\"hdbtabletype\":{\"plugin_name\":\"com.sap.hana.di.tabletype\"},\"hdbprocedure\":{\"plugin_name\":\"com.sap.hana.di.procedure\"},\"hdbvirtualprocedure\":{\"plugin_name\":\"com.sap.hana.di.virtualprocedure\"},\"hdbvirtualprocedureconfig\":{\"plugin_name\":\"com.sap.hana.di.virtualprocedure.config\"},\"hdbafllangprocedure\":{\"plugin_name\":\"com.sap.hana.di.afllangprocedure\"},\"hdblibrary\":{\"plugin_name\":\"com.sap.hana.di.library\"},\"hdbsequence\":{\"plugin_name\":\"com.sap.hana.di.sequence\"},\"hdbrole\":{\"plugin_name\":\"com.sap.hana.di.role\"},\"hdbroleconfig\":{\"plugin_name\":\"com.sap.hana.di.role.config\"},\"hdbstructuredprivilege\":{\"plugin_name\":\"com.sap.hana.di.structuredprivilege\"},\"hdbanalyticprivilege\":{\"plugin_name\":\"com.sap.hana.di.analyticprivilege\"},\"hdbtabledata\":{\"plugin_name\":\"com.sap.hana.di.tabledata\"},\"csv\":{\"plugin_name\":\"com.sap.hana.di.tabledata.source\"},\"properties\":{\"plugin_name\":\"com.sap.hana.di.tabledata.properties\"},\"tags\":{\"plugin_name\":\"com.sap.hana.di.tabledata.properties\"},\"hdbgraphworkspace\":{\"plugin_name\":\"com.sap.hana.di.graphworkspace\"},\"hdbflowgraph\":{\"plugin_name\":\"com.sap.hana.di.flowgraph\"},\"hdbreptask\":{\"plugin_name\":\"com.sap.hana.di.reptask\"},\"hdbsearchruleset\":{\"plugin_name\":\"com.sap.hana.di.searchruleset\"},\"hdbtextconfig\":{\"plugin_name\":\"com.sap.hana.di.textconfig\"},\"hdbtextdict\":{\"plugin_name\":\"com.sap.hana.di.textdictionary\"},\"hdbtextrule\":{\"plugin_name\":\"com.sap.hana.di.textrule\"},\"hdbtextinclude\":{\"plugin_name\":\"com.sap.hana.di.textrule.include\"},\"hdbtextlexicon\":{\"plugin_name\":\"com.sap.hana.di.textrule.lexicon\"},\"hdbtextminingconfig\":{\"plugin_name\":\"com.sap.hana.di.textminingconfig\"},\"txt\":{\"plugin_name\":\"com.sap.hana.di.copyonly\"}}}')");
		allQueries
		        .add("INSERT INTO #PATHS (PATH, CONTENT) VALUES ('"+packageFileName+"', 'package " + PACKAGE_NAME + ";')");
		String query = "INSERT INTO #PATHS (PATH, CONTENT) VALUES ('" + filterFileName + "', 'namespace " + PACKAGE_NAME
				+ ";in package " + PACKAGE_NAME + ";using " + attributeToExtend + ";extend type " + filters + " with {";

		for (String column : allColumns) {
			String[] columnArray = column.split(":");
			query += columnArray[0]; // column Name
			query += " : " + columnArray[1] + ";";
		}
		query = query + "};' )";
		allQueries.add(query);
		allQueries.add("CALL " + schemaName + "#DI.WRITE(#PATHS, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?)");
		allQueries.add("DROP TABLE #PATHS");

		// Deploy queries

		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #DEPLOY_PATHS LIKE _SYS_DI.TT_FILESFOLDERS");
		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #UNDEPLOY_PATHS LIKE _SYS_DI.TT_FILESFOLDERS");
		allQueries.add("CREATE LOCAL TEMPORARY COLUMN TABLE #PATH_PARAMETERS LIKE _SYS_DI.TT_FILESFOLDERS_PARAMETERS");

		allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('.hdiconfig')");
		allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('"+packageFileName+"' )");
		allQueries.add("INSERT INTO #DEPLOY_PATHS (PATH) VALUES ('" + filterFileName +"' )");
		allQueries.add("CALL " + schemaName
				+ "#DI.MAKE(#DEPLOY_PATHS, #UNDEPLOY_PATHS, #PATH_PARAMETERS, _SYS_DI.T_NO_PARAMETERS, ?, ?, ?)");
		allQueries.add("DROP TABLE #DEPLOY_PATHS");
		allQueries.add("DROP TABLE #UNDEPLOY_PATHS");
		allQueries.add("DROP TABLE #PATH_PARAMETERS");
		return allQueries;
	}

	private List<String> getAllColumns(String tableName, List<String> missingColumns) throws EnvironmentException {

		List<String> existingColumns = new ArrayList<String>();
		List<String> allColumns = new ArrayList<String>();
		try {
			String schemaName = this.getSchemaName();
			String selectSQL = "Select  \"COLUMN_NAME\",\"DATA_TYPE_NAME\" from SYS.TABLE_COLUMNS where schema_name=? and table_name=?";
			// String selectSQL = "Select \"COLUMN_NAME\",\"DATA_TYPE_NAME\" from
			// SYS.TABLE_COLUMNS where schema_name='SAP_CHP200_1' and
			// table_name='hc.hph.genomics.db.models::SNV.Variants'";
			PreparedStatement preparedStatement = this.connection.prepareStatement(selectSQL);
			preparedStatement.setString(1, schemaName);
			preparedStatement.setString(2, tableName);
			boolean exists;
			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					existingColumns.add("\"" + resultSet.getString(1) + "\" : " + resultSet.getString(2));
				}
			}

			allColumns.addAll(existingColumns);
			allColumns.addAll(missingColumns);

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return allColumns;

	}

	private String getSchemaName() throws EnvironmentException, SQLException {
		if (this.schemaName == null) {
			EnvironmentDetails env = new EnvironmentDetails(this.config);
			this.schemaName = env.getSchemaName();
		}
		return this.schemaName;
	}

	@Override
	public void close() throws SQLException {
		try {
			if (this.parallelCount == 1) {
				this.processor.get(0).close();
			} else {
				for (int i = 0; i < processor.size(); ++i) {
					blockingQueue.put(new InvalidDataline());
				}
			}
			for (Thread t : this.threads) {
				t.join();
			}
		} catch (InterruptedException ex) {
			java.util.logging.Logger.getLogger(HDBConsumer.class.getName()).log(Level.SEVERE, null, ex);
		}
		connection.close();
	}

	public void stopProcessing() {
		blockingQueue.clear();
		try {
			if (this.parallelCount > 0) {
				for (int i = 0; i < processor.size(); ++i) {
					blockingQueue.put(new InvalidDataline());
				}
			}
		} catch (InterruptedException ex) {
			java.util.logging.Logger.getLogger(HDBConsumer.class.getName()).log(Level.SEVERE, null, ex);
		}
	}

	@Override
	public boolean consumeError(Exception e, int i) {
		LOGGER.error("ERROR in line " + i + ": " + e);
		return ++errorCount <= 10;
	}
}
