package com.legacy.health.fhir.executor;

import java.util.HashMap;

import com.legacy.health.fhir.executor.SearchHelper.SearchContext;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.util.Utils;

public class SearchReferenceHandler extends AbstractSearchTypeHandler {

	Query innerQuery = null;
	Join join = null;

	@Override
	public Expression search(StructureDefinition typeSD, Expression expression, String[] values, SearchParameter sp,
			String key) throws FhirException {
		SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
		String code = null;
		String type = null;
		String path = null;
		String[] segments = key.split(":");
		MetaRepository repo = qb.getMetaRepository();
		if (!segments[0].equals(key)) {
			code = segments[0];
			type = segments[1].substring(0, segments[1].indexOf("."));
			path = segments[1].substring(segments[1].indexOf(".") + 1);
			SearchExecutor searchExecutor = new SearchExecutor();
			HashMap<String, String[]> map = new HashMap<String, String[]>();
			map.put(path, values);
			Expression filter = searchExecutor.getExpression(type, map, qb.getMetaRepository());
			expression = expression == null ? filter : qb.and(expression, filter);
			// join=qb.join(repo.getStructureDefinitionById(type), type+".id");
			join = new Join();
			join.withStructureDefinition(repo.getStructureDefinitionById(type));
			ResultElement re = qb.out(typeSD.getId(), typeSD.getId() + "." + code + ".reference");
			join.withLink(re);
			join.withQueryBuilder(qb);
		} else {
			int dot = key.indexOf(".");
			if (dot > -1) {
				code = key.substring(0, dot);
				path = key.substring(dot + 1);
				if ((code.equals("patient") && sp.getTarget().contains("Patient"))
						|| (code.equals("subscriber") && sp.getTarget().contains("Patient"))) {// TO Support also other
																								// targets in
																								// "navigation queries"
					type = "Patient";
				}
				SearchExecutor searchExecutor = new SearchExecutor();
				HashMap<String, String[]> map = new HashMap<String, String[]>();
				map.put(path, values);
				Expression filter = searchExecutor.getExpression(type, map, qb.getMetaRepository());
				expression = expression == null ? filter : qb.and(expression, filter);
				// join=qb.join(repo.getStructureDefinitionById(type), type+".id");
				join = new Join();
				join.withStructureDefinition(repo.getStructureDefinitionById(type));
				ResultElement re = qb.out(typeSD.getId(), ctx.path + ".reference");
				join.withLink(re);
				join.withQueryBuilder(qb);
			}
		}

		ResultElement searchAttribute = qb.out(typeSD, ctx.path + ".reference");
		if (join == null) {
			String id = values[0];
			id = Utils.checkUUID(id);
			id = id.contains("/") ? id.substring(id.indexOf("/") + 1) : id;
			StringExpression searchValue = qb.string(id);

			return expression == null ? qb.eq(searchAttribute, searchValue)
					: qb.and(expression, qb.eq(searchAttribute, searchValue));
		} else {
			return expression == null ? qb.eq(searchAttribute, join.getLink())
					: qb.and(expression, qb.eq(searchAttribute, join.getLink()));

		}
	}

	public Query getInnerQuery() {
		return innerQuery;
	}

	public Join getJoin() {
		return join;
	}

}
