package com.legacy.health.fhir.executor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.MetaData;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.fluentpath.FluentPathController;
import com.legacy.health.fhir.meta.fluentpath.PathCheckResult;

public class SearchHelper {
	Log log = LogFactory.getLog(SearchHelper.class);

	private SearchContext provideSearchContext(StructureDefinition type, SearchParameter sp) {
		FluentPathController controller = new FluentPathController();
		PathCheckResult chk = controller.checkStructureDefinition(type, sp.getExpression());
		if (chk == null) {
			log.error("Failed to validated FluentPath:" + sp.getId() + ":(" + sp.getExpression() + ")");
			if (sp.getCode().equals("medication")) {// workaround
				SearchContext ret = new SearchContext();
				ret.definition = type.getDataElement("medicationReference");
				ret.path = type.getId() + ".medicationReference";
				return ret;
			}
		}
		SearchContext ret = new SearchContext();
		ret.definition = chk.getDefintion();
		ret.path = chk.getPath();
		return ret;
	}

	class SearchContext {
		MetaData definition;
		String path;
	}

	private static SearchHelper instance = new SearchHelper();

	public static SearchContext provideContext(StructureDefinition type, SearchParameter sp) {
		return instance.provideSearchContext(type, sp);
	}
}
