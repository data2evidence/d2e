package legacy.health.genomics.vcf.parser;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.zip.GZIPInputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import legacy.health.genomics.di.DIJob;
import legacy.health.genomics.vcf.environment.EnvironmentDetails;
import legacy.health.genomics.vcf.parser.capability.AdditionalParameters;
import legacy.health.genomics.vcf.parser.capability.HDBConsumer;
import legacy.health.genomics.vcf.parser.capability.ImportConfiguration;
import legacy.health.genomics.vcf.parser.capability.VCFParser;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;
import legacy.health.genomics.vcf.parser.exceptions.AbortImportException;
import legacy.health.genomics.vcf.parser.exceptions.BodyParseException;
import legacy.health.genomics.vcf.parser.exceptions.DIJobStatusException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;
import legacy.health.genomics.vcf.parser.inputmodels.DefaultContextImpl;
import legacy.health.genomics.vcf.parser.inputmodels.IDataConsumer;
import legacy.health.genomics.vcf.parser.inputmodels.IErrorConsumer;

public class ImportHandler {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationController.class);
	private InputParameter inputParameter;

	public ImportHandler(InputParameter inputParameter) {
		this.setInputParameter(inputParameter);
	}

	public InputParameter getInputParameter() {
		return inputParameter;
	}

	public void setInputParameter(InputParameter inputParameter) {
		this.inputParameter = inputParameter;
	}

	private InputStream wrapIfZip(InputStream inputStream) throws IOException {
		if (!inputStream.markSupported()) {
			inputStream = new BufferedInputStream(inputStream);
		}
		inputStream.mark(1000);
		try {
			return new GZIPInputStream(inputStream);
		} catch (Exception e) {
			inputStream.reset();
			return inputStream;
		}
	}

	public void handleVCFImport() throws EnvironmentException, BodyParseException {
		LOGGER.debug("Class:" + this.getClass().getName() + " Method: importVCFFile");
		DIJob diJob = null;
		String fileName = "";
		InputParameter input = this.getInputParameter();
		String remoteSourceName = input.getRemoteSource();
		String parentAuditLogID = input.getParentAuditLogID();
		AdditionalParameters ajp;
		EnvironmentDetails env = null;
		Connection conn = null;
		try {
			env = new EnvironmentDetails();
			conn = env.getConnection();
			String schemaName = env.getSchemaName();
			ajp = new ObjectMapper().readValue(input.getProperties(), AdditionalParameters.class);
			String incomingJSON = new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(input);
			LOGGER.debug("Incoming request body :"+incomingJSON);
			Iterator<Entry<String, ImportConfiguration>> importIterator = ajp.getImportConfigurationMap().entrySet()
					.iterator();
			diJob = new DIJob(conn, schemaName, parentAuditLogID, remoteSourceName, fileName);
			diJob.createVirtualTable();
			diJob.setAuditLogRunning(null, "Set Profile run status from Java");
			Boolean isJobExecutionSuccess = true;
			while (importIterator.hasNext()) {
				Entry<String, ImportConfiguration> fileImportEntry = importIterator.next();
				fileName = fileImportEntry.getKey();
				LOGGER.debug("\n------------- Running import for File :" + fileName + " -------------");
				ImportConfiguration config = fileImportEntry.getValue();
				try {
					
					DefaultContextImpl importContext = new DefaultContextImpl();
					importContext.setAttrFilter(config.getAttrFilter());
					int auditID = (int) diJob.getAuditLogID(fileName);
					importContext.setDwid(auditID);
					importContext.setFilterExpr(config.getFilterExpr());
					diJob.addSampleMapping(parentAuditLogID);
					importContext.setSampleMapping(diJob.getSampleMapping());
					config.setDwid(auditID);
					config.setSampleMapping(diJob.getSampleMapping());
					env.setConfiguration(config);
					IDataConsumer hdbconsumer = new HDBConsumer(config);
					IErrorConsumer errorConsumer = (IErrorConsumer) hdbconsumer;
					diJob.setAuditLogRunning(fileName, "Status set from VCF Java");
					String sql = String.format(
							"SELECT \"DOCUMENTCONTENT\" FROM " + schemaName + ".\"%s\" WHERE \"DOCUMENTID\"=?",
							diJob.getJobID());
					PreparedStatement pstmt = conn.prepareStatement(sql);
					pstmt.setString(1, fileName);

					try (ResultSet rs = pstmt.executeQuery()) {
						if (rs.next()) {

							Blob blobContent = rs.getBlob(1);

							try (InputStream binaryStream = blobContent.getBinaryStream()) {

								try (InputStream is = wrapIfZip(binaryStream);
										BufferedReader bufferedReader = new BufferedReader(
												new InputStreamReader(is, StandardCharsets.UTF_8))) {
									VCFParser vcfParser = new VCFParser(hdbconsumer, errorConsumer, importContext);
									vcfParser.parse(bufferedReader);
									diJob.setAuditLogCompleted(input.getParentAuditLogID(), fileName,
											"Running import for File :" + fileName + " Succeeded");
									diJob.createLogTrace(fileName, "Running import for File :" + fileName + " Succeded",
											"Completed");
									LOGGER.debug("\n-------------Running import for File :" + fileName
											+ " Succeded-------------");
								} catch (BodyParseException e) {
									isJobExecutionSuccess = false;
									LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
									diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
											BodyParseException.getBaseErrorMessage());
									diJob.createLogTrace(fileName, BodyParseException.getBaseErrorMessage(), " Failed");
								} catch (AbortImportException e) {
									isJobExecutionSuccess = false;
									LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
									diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
											BodyParseException.getBaseErrorMessage());
									diJob.createLogTrace(fileName, BodyParseException.getBaseErrorMessage(), " Failed");
								} catch (Exception e) {
									isJobExecutionSuccess = false;
									LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
									diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
											BodyParseException.getBaseErrorMessage());
									diJob.createLogTrace(fileName, BodyParseException.getBaseErrorMessage(), " Failed");
								}
							}

							catch (IOException e) {
								LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
								isJobExecutionSuccess = false;
								diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
										BodyParseException.getBaseErrorMessage());
								diJob.createLogTrace(fileName, BodyParseException.getBaseErrorMessage(), " Failed");
							}

						}
					}

					catch (SQLException e) {
						diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
								BodyParseException.getBaseErrorMessage());
						diJob.setAuditLogFailed(input.getParentAuditLogID(), null,
								BodyParseException.getBaseErrorMessage());
						diJob.createLogTrace(fileName, BodyParseException.getBaseErrorMessage(), " Failed");
						throw new BodyParseException("Error Parsing Body :", e);
					}
					
				} catch (SQLException e1) {
					try {
						isJobExecutionSuccess = false;
						LOGGER.error(BodyParseException.getBaseErrorMessage(), e1);
						diJob.dropVirtualTable();
						diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
								BodyParseException.getBaseErrorMessage());
						diJob.createLogTrace(fileName, BodyParseException.getBaseErrorMessage(), " Failed");
					} catch (DIJobStatusException e) {
						LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
					}

				} catch (DIJobStatusException e1) {
					diJob.dropVirtualTable();
					throw new BodyParseException(BodyParseException.getBaseErrorMessage(), e1);
				}

			}
			diJob.writeDataToCDW();
			
			diJob.dropVirtualTable();
			
		} catch (EnvironmentException envException) {
			throw new BodyParseException(BodyParseException.getBaseErrorMessage(), envException);
		}

		catch (JsonParseException e1) {
			throw new BodyParseException(BodyParseException.getBaseErrorMessage(), e1);
		} catch (JsonMappingException e1) {
			throw new BodyParseException(BodyParseException.getBaseErrorMessage(), e1);
		} catch (IOException e1) {
			throw new BodyParseException(BodyParseException.getBaseErrorMessage(), e1);
		} catch (SQLException sqlException) {
			throw new BodyParseException(BodyParseException.getBaseErrorMessage(), sqlException);
		} catch (DIJobStatusException e) {
			throw new BodyParseException(BodyParseException.getBaseErrorMessage(), e);
		}
		
		finally {
			try {
				if (env != null) {
					env.close();
				}
			} catch (SQLException e) {
				throw new BodyParseException(BodyParseException.getBaseErrorMessage(), e);
			}
		}
	}

	public Map<String, VCFStructureDefinition> extractHeaders() throws DIJobStatusException {
		LOGGER.debug("Class:" + this.getClass().getName() + " Method: importVCFFile");
		Map<String, VCFStructureDefinition> structureDefMap = new HashMap<String, VCFStructureDefinition>();
		DIJob diJob = null;
		String fileName = "";
		InputParameter input = this.getInputParameter();
		String remoteSourceName = input.getRemoteSource();
		String parentAuditLogID = null;
		EnvironmentDetails env = null;
		Connection conn = null;
		try {
			env = new EnvironmentDetails();
			conn = env.getConnection();
			String schemaName = env.getSchemaName();
			ImportConfiguration config = new ImportConfiguration();
			config.setParallelCount(ImportConfiguration.getDefaultParallelCount());
			config.setBatchSize(ImportConfiguration.getDefaultBatchSize());
			IDataConsumer hdbconsumer = new HDBConsumer(config);
			IErrorConsumer errorConsumer = (IErrorConsumer) hdbconsumer;
			DefaultContextImpl importContext = new DefaultContextImpl();
			String incomingJSON = new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(input);
			LOGGER.debug("Incoming request body :"+incomingJSON);
			diJob = new DIJob(conn, schemaName, parentAuditLogID, remoteSourceName, fileName);
			diJob.createVirtualTable();
			
			String sql = String.format(
					"SELECT \"DOCUMENTCONTENT\" FROM " + schemaName + ".\"%s\" WHERE \"DOCUMENTID\"=?",
					diJob.getJobID());
			PreparedStatement pstmt = conn.prepareStatement(sql);
			List<String> files = input.getFiles();
			for (String file : files) {
				pstmt.setString(1, file);
				LOGGER.debug("Parsing file :"+file);
				try (ResultSet rs = pstmt.executeQuery()) {
					if (rs.next()) {

						Blob blobContent = rs.getBlob(1);

						try (InputStream binaryStream = blobContent.getBinaryStream()) {

							try (InputStream is = wrapIfZip(binaryStream);
									BufferedReader bufferedReader = new BufferedReader(
											new InputStreamReader(is, StandardCharsets.UTF_8))) {
								VCFParser vcfParser = new VCFParser(hdbconsumer, errorConsumer, importContext);
								VCFStructureDefinition vcfDef = vcfParser.parseHeader(bufferedReader);
								structureDefMap.put(file, vcfDef);
							} catch (Exception e) {
								LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
								diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
										BodyParseException.getBaseErrorMessage());
								diJob.createLogTrace(fileName, HeaderParseException.getBaseErrorMessage(), " Failed");
							}
						}

						catch (IOException e) {
							LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
							diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
									BodyParseException.getBaseErrorMessage());
							diJob.createLogTrace(fileName, HeaderParseException.getBaseErrorMessage(), " Failed");
						}

					}
				}
			}
			diJob.dropVirtualTable();
			return structureDefMap;
			
	}
		catch (Exception e) {
			LOGGER.error(BodyParseException.getBaseErrorMessage(), e);
			diJob.setAuditLogFailed(input.getParentAuditLogID(), fileName,
			BodyParseException.getBaseErrorMessage());
			diJob.createLogTrace(fileName, HeaderParseException.getBaseErrorMessage(), " Failed");
		}
		return null;

}}

