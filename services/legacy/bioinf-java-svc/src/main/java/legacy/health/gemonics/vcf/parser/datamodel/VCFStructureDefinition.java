package legacy.health.genomics.vcf.parser.datamodel;

import legacy.health.genomics.vcf.parser.exceptions.HeaderParseException;
import legacy.health.genomics.vcf.parser.inputmodels.HeaderLine;
import legacy.health.genomics.vcf.parser.inputmodels.IHeaderParser;

import java.util.*;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VCFStructureDefinition {

	private static final Logger LOGGER = LoggerFactory.getLogger(VCFStructureDefinition.class);
	private final IHeaderParser lineParser;
	private String fileFormat;
	private String source;
	private String reference;
	private final List<ContigField> contig;
	private String phasing;
	private String fileFormatVersion;
	private Set<String> blackListedFormatFields;

	public Map<String, InfoField> getInfo() {
		return info;
	}

	private final Map<String, InfoField> info;
	private final Map<String, FilterField> filter;
	private final Map<String, FormatField> format;
	private List<FormatField> formatList;

	private final List<AltField> alt;
	private final List<String> assembly;
	private final List<SampleField> sample;
	private final List<PedigreeField> pedigree;

	private String pedigreeDB;
	private final List<HeaderLine> allLines;
	private HeaderField header;

	public String getFileFormat() {
		return fileFormat;
	}

	public String getFileFormatVersion() {
		return fileFormatVersion;
	}

	public String getSource() {
		return source;
	}

	public String getReference() {
		return reference;
	}

	public List<ContigField> getContig() {
		return contig;
	}

	public String getPhasing() {
		return phasing;
	}

	public InfoField getInfoField(String key) {
		return this.info.get(key);
	}

	public FormatField getFormatField(String key) {
		return this.format.get(key);
	}

	public List<AltField> getAlt() {
		return alt;
	}

	public List<String> getAssembly() {
		return assembly;
	}

	public List<SampleField> getSample() {
		return sample;
	}

	public List<PedigreeField> getPedigree() {
		return pedigree;
	}

	public String getPedigreeDB() {
		return pedigreeDB;
	}

	public List<HeaderLine> getAllLines() {
		return allLines;
	}

	public HeaderField getHeader() {
		return header;
	}

	public VCFStructureDefinition(IHeaderParser lineParser) {
		this.lineParser = lineParser;
		this.allLines = new LinkedList<>();
		this.alt = new LinkedList<>();
		this.assembly = new LinkedList<>();
		this.contig = new LinkedList<>();
		this.filter = new HashMap<>();
		this.format = new HashMap<>();
		this.info = new HashMap<>();
		this.sample = new LinkedList<>();
		this.pedigree = new LinkedList<>();
		this.formatList = new LinkedList<>();
		this.blackListedFormatFields = new HashSet<>();
	}

	public List<FormatField> getFormatList() {
		return formatList;
	}

	public Map<String, FormatField> getFormatMap() {
		return format;
	}

	public void addHeaderLine(HeaderLine line) throws HeaderParseException {
		if (line.getRowtype() == HeaderLine.Rowinformation.HEADERLINE) {
			this.header = lineParser.parseHeaderLine(line);
		} else if (line.getRowtype() == HeaderLine.Rowinformation.METALINE) {
			try {
				line = lineParser.parseLine(line);
			} catch (Exception e) {
				LOGGER.debug("Error parsing line");
				throw new HeaderParseException("Error parsing line :" + e.getMessage());
			}
			this.allLines.add(line);
			switch (line.getKey().toLowerCase(Locale.ENGLISH)) {
			case "fileformat":
				this.fileFormat = line.getValue();
				break;

			case "source":
				this.source = line.getValue();
				break;

			case "reference":
				this.reference = line.getValue();
				break;

			case "phasing":
				this.phasing = line.getValue();
				break;

			case "info":
				this.info.put(line.getValueForKey("id"), InfoField.getFromValueMapInfo(line.getValuePair()));
				break;

			case "filter":
				this.filter.put(line.getValueForKey("id"), FilterField.getFromValueMapFilter(line.getValuePair()));
				break;

			case "format":
				FormatField fromValueMapFormat = FormatField.getFromValueMapFormat(line.getValuePair());
				this.format.put(line.getValueForKey("id"), fromValueMapFormat);
				this.formatList.add(fromValueMapFormat);
				break;

			case "contig":
				this.contig.add(ContigField.getFromValueMapContig(line.getValuePair()));
				break;
			case "alt":
				this.alt.add(AltField.getFromValueMapAlt(line.getValuePair()));
				break;
			case "sample":
				this.sample.add(SampleField.getFromValueMapSample(line.getValuePair()));
				break;
			case "assembly":
				this.assembly.add(line.getValue());
				break;
			case "pedigreedb":
				this.pedigreeDB = line.getValue();
				break;
			case "pedigree":
				this.pedigree.add(PedigreeField.getFromValueMapPedigree(line.getValuePair()));
			default:
				LOGGER.debug("Unknown header field: " + line.getKey());
			}

		}
	}

	public Map<String, FilterField> getFilter() {
		return filter;
	}

	public void removeInfoFields(List<String> toRemove) {
		toRemove.forEach(info::remove);
	}

	public void removeFilterFields(List<String> toRemove) {
		toRemove.forEach(filter::remove);
	}

	public void removeFormatFields(List<String> toRemove) {
		toRemove.forEach(id -> {
			this.blackListedFormatFields.add(id);
		});
	}

	public Set<String> getBlackListedFormatFields() {
		return blackListedFormatFields;
	}
}
