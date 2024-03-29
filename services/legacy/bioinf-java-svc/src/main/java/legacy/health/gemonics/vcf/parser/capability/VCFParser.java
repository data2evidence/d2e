package legacy.health.genomics.vcf.parser.capability;

import legacy.health.genomics.vcf.parser.datamodel.Dataline;
import legacy.health.genomics.vcf.parser.datamodel.FormatField;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;
import legacy.health.genomics.vcf.parser.exceptions.AbortImportException;
import legacy.health.genomics.vcf.parser.exceptions.BodyParseException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;
import legacy.health.genomics.vcf.parser.inputmodels.*;

import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

public class VCFParser {

	private static final Logger LOGGER = LoggerFactory.getLogger(VCFParser.class);

	private final VCFStructureDefinition vcfFileDefintion;
	private final IDataParser dataParser;
	private final IDataConsumer consumer;
	private final IErrorConsumer errorConsumer;
	private final IDatalineFilter filterProvider;
	private final IHeaderParser headerParser;
	IContext context;

	public VCFParser(IDataConsumer consumer, IErrorConsumer errorConsumer, IContext context) {
		this.consumer = consumer;
		this.errorConsumer = errorConsumer;
		this.headerParser = new HeaderParserStateMachine();
		this.vcfFileDefintion = new VCFStructureDefinition(this.headerParser);
		this.dataParser = new DataParserStateMachine(vcfFileDefintion);
		this.filterProvider = new DefaultDatalineFilter(context);
		this.context = context;
	}

	public void parse(BufferedReader reader) throws IOException, BodyParseException, AbortImportException, Exception {
		String line;
		int i = 0;
		String abort = "";
		boolean wasHeaderSendToConsumer = false;
		while ((line = reader.readLine()) != null) {
			i++;
			if (i % 1000 == 0) {
				LOGGER.info("Lines parsed " + i);
			}
			HeaderLine currentLineStructure = HeaderLine.getFromString(line);
			switch (currentLineStructure.getRowtype()) {
			case METALINE:
			case HEADERLINE:
				vcfFileDefintion.addHeaderLine(currentLineStructure);
				break;
			case DATALINE:
				if (!wasHeaderSendToConsumer) {
					LOGGER.info("First dataline found at line : " + i + " evaluation import config");
					this.filterProvider.filterAttritbutes(vcfFileDefintion);
					LOGGER.info("Set column aliases");
					setColumAliases();
					LOGGER.info("Provide vcf spec to consumer");
					this.consumer.consumeHeader(vcfFileDefintion);
					wasHeaderSendToConsumer = true;
				}
				try {
					Dataline dataline = dataParser.parseDataline(line, i);
					if (!this.filterProvider.skipDataLine(dataline)) {
						abort = this.consumer.consumeDataRow(dataline) ? "" : "Abort due to consumer request";
					}
				} catch (Exception e) {
					try {
						LOGGER.error("Error during consumption of line " + i, e);
						if (this.errorConsumer.consumeError(e, i)) {
							abort = "Abort due to ErrorConsumer request";
						}
					} catch (Exception exp) {
						LOGGER.error("Error reporting error for line " + i, exp);
						abort = "Abort as the ErrorConsumer throws errors";
					}
				}
				if (!abort.isEmpty()) {
					LOGGER.error("Consumer asks for abort");
					abortImport();
					throw new AbortImportException("Aborted on consumer request");
				}
			case EMPTYLINE:
				break;
			case INVALID:
				LOGGER.error("Main parser ended up in an invalid state, aborting import");
				abortImport();
				throw new AbortImportException("Aborted as parser ended up in an invalid state");
			}

		}
		consumer.close();
	}

	private void abortImport() {
		try {
			this.consumer.stopProcessing();
		} catch (Exception exp) {
			LOGGER.error("Unable to stop consumer", exp);
		}
		try {
			this.errorConsumer.stopProcessing();
		} catch (Exception exp) {
			LOGGER.error("Unable to stop error consumer", exp);
		}
	}

	private void setColumAliases() {
		for (String f : this.vcfFileDefintion.getInfo().keySet()) {
			if(this.context.getAttrFilter().get("info") !=null) {
				for (Pair<String, String> attrPairNameToAlias : this.context.getAttrFilter().get("info")) {
					if (attrPairNameToAlias.getKey().equals(f)) {
						LOGGER.info("Field " + f + " will be imported as " + attrPairNameToAlias.getValue());
						vcfFileDefintion.getInfo().get(f).setAlias(attrPairNameToAlias.getValue());
					}
				}
			}
		}
		for (FormatField f : this.vcfFileDefintion.getFormatList()) {
			if(this.context.getAttrFilter().get("format") !=null) {
				for (Pair<String, String> attrPairNameToAlias : this.context.getAttrFilter().get("format")) {
					if (attrPairNameToAlias.getKey().equals(f.getId())) {
						LOGGER.info("Field " + f.getId() + " will be imported as " + attrPairNameToAlias.getValue());
						f.setAlias(attrPairNameToAlias.getValue());
					}
				}
			}
		}
	}

	public VCFStructureDefinition parseHeader(BufferedReader reader)
			throws IOException, AbortImportException, HeaderParseException, SQLException {

		String line;
		int i = 0;
		loop: while ((line = reader.readLine()) != null) {
			i++;
			if (i % 1000 == 0) {
				LOGGER.info("Lines parsed " + i);
			}
			HeaderLine currentLineStructure = HeaderLine.getFromString(line);
			switch (currentLineStructure.getRowtype()) {

			case METALINE:
			case HEADERLINE:
				vcfFileDefintion.addHeaderLine(currentLineStructure);
				break;
			case DATALINE:
				break loop;
			case EMPTYLINE:
				break;
			case INVALID:
				LOGGER.error("Main parser ended up in an invalid state, aborting import");
				abortImport();
				throw new AbortImportException("Aborted as parser ended up in an invalid state");
			}

		}
		consumer.close();
		return vcfFileDefintion;
	}

}
