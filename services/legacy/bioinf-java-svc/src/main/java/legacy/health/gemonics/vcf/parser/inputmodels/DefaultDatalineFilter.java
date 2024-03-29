package legacy.health.genomics.vcf.parser.inputmodels;

import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import legacy.health.genomics.vcf.parser.datamodel.Dataline;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;

import java.util.*;

public class DefaultDatalineFilter implements IDatalineFilter {

	private static final Logger LOGGER = LoggerFactory.getLogger(DefaultDatalineFilter.class);

	private final Set<String> filterExpressions;
	private final Map<String, Set<Pair<String, String>>> fieldTypeToAttrFilter;

	public DefaultDatalineFilter(IContext context) {
		this.filterExpressions = new HashSet<>(context.getFilterExpr());
		this.fieldTypeToAttrFilter = context.getAttrFilter();
	}

	@Override
	public void filterAttritbutes(VCFStructureDefinition def) {
		LOGGER.info("Filter attributes against provided import configuration");
		if (fieldTypeToAttrFilter.containsKey("info")) {
			List<String> toRemove = new LinkedList<>();
			for (String f : def.getInfo().keySet()) {
				boolean found = false;
				for (Pair<String, String> attrPairNameToAlias : fieldTypeToAttrFilter.get("info")) {
					if (attrPairNameToAlias.getKey().equals(f)) {
						found = true;
						break;
					}
				}
				if (!found) {
					LOGGER.info("Field Info." + f + " will not be imported");
					toRemove.add(f);
				}
			}
			def.removeInfoFields(toRemove);
			def.removeFilterFields(toRemove);
		}
		if (fieldTypeToAttrFilter.containsKey("format")) {
			List<String> toRemove = new LinkedList<>();
			for (String f : def.getFormatMap().keySet()) {
				boolean found = false;
				for (Pair<String, String> attrPairNameToAlias : fieldTypeToAttrFilter.get("format")) {
					if (attrPairNameToAlias.getKey().equals(f)) {
						found = true;
						break;
					}
				}
				if (!found) {
					LOGGER.info("Field Format." + f + " will not be imported");
					toRemove.add(f);
				}

			}
			def.removeFormatFields(toRemove);
		}
	}

	@Override
	public boolean skipDataLine(Dataline line) {
		if (filterExpressions.isEmpty()) {
			return false;
		}
		for (String filter : line.getFilter()) {
			if (filterExpressions.contains(filter)) {
				return false;
			}
		}
		LOGGER.debug("Skip line " + line.getSourceLine() + "  as no matching filter was found");
		return true;

	}
}
