package com.legacy.health.fhir.meta.queryengine;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class Query extends AbstractQueryElement implements QueryElement {

	protected From from;
	protected List<Expression> out = new ArrayList<Expression>();
	protected List<Parameter> parameters = new ArrayList<Parameter>();
	protected List<Join> joins = new ArrayList<Join>();
	protected List<ResultElement> groupByList = new ArrayList<ResultElement>();
	protected List<Sort> sortList = new ArrayList<Sort>();
	protected List<ResultElement> elementsList = new ArrayList<ResultElement>();
	protected Limit limit;
	protected String name;
	protected Expression filterExpression;
	protected boolean everything = false;// TODO:Find real operation concept - e.g. here also with parameter
	protected int lastn = 0;
	protected String everythingStart = null;
	protected String everythingEnd = null;
	protected List<ResultElement> includesList = new ArrayList<ResultElement>();
	protected List<ResultElement> revIncludesList = new ArrayList<ResultElement>();
	protected Query rootQuery;

	/**
	 * The name will be used for the StructureDefinition
	 * 
	 * @param name
	 * @return
	 */
	public Query withName(String name) {
		this.name = name;
		return this;
	}

	public Query lastn(int n) {
		lastn = n;
		return this;
	}

	public boolean isLastN() {
		return lastn > 0;
	}

	public int getLastNMax() {
		return lastn;
	}

	public void addParameter(Parameter parameter) {
		parameters.add(parameter);
	}

	public List<Parameter> getParameters() {
		return this.parameters;
	}

	public Query everything(String start, String end) {
		everything = true;
		this.everythingStart = start;
		this.everythingEnd = end;
		return this;
	}

	public String getEverythingStartDate() {
		return everythingStart;
	}

	public String getEverythingEndDate() {
		return everythingEnd;
	}

	public boolean returnEverything() {
		return everything;
	}

	public Query include(ResultElement resultElement) {
		includesList.add(resultElement);
		return this;
	}

	public List<ResultElement> getIncludes() {
		return includesList;
	}

	public Query revinclude(ResultElement resultElement) {
		revIncludesList.add(resultElement);
		return this;
	}

	public List<ResultElement> getRevIncludes() {
		return revIncludesList;
	}

	public String getName() {
		return name;
	}

	public Query from(From from) {
		this.from = from;
		return this;
	}

	public Query limit(Limit limit) {
		this.limit = limit;
		return this;
	}

	public Limit limit() {
		return limit;
	}

	public Query join(Join join) {
		this.joins.add(join);
		return this;
	}

	public Query filter(Expression expression) {
		this.filterExpression = expression;
		return this;
	}

	public Expression filter() {
		return this.filterExpression;
	}

	public Query groupBy(ResultElement re) {
		this.groupByList.add(re);
		return this;
	}

	public List<ResultElement> groupByList() {
		return this.groupByList;
	}

	public Query sortBy(Sort sort) {
		this.sortList.add(sort);
		return this;
	}

	public List<Sort> sortList() {
		return this.sortList;
	}

	public Query element(ResultElement element) {
		this.elementsList.add(element);
		return this;
	}

	public List<ResultElement> elements() {
		return this.elementsList;
	}

	public Query out(Expression reference) {
		out.add(reference);
		return this;
	}

	public StructureDefinition getResultDefinition() {
		StructureDefinition def = new StructureDefinition(name);
		for (Expression re : out) {
			if (re instanceof ResultElement) {
				DataElementStructureLink link = ((ResultElement) re).getDataElementStructureLink();
				if (link == null) {
					StructureDefinition definition = this.from.getStructureDefinition();
					DataElement idElement = definition.getDataElement(definition.getId() + ".id");
					idElement.setId(this.getName() + ".id");
					idElement.setOwner(definition);
					/*
					 * DataElementStructureLink l = new DataElementStructureLink();
					 * l.setDataELement(idElement);
					 * l.setPath(definition.getId()+".id");
					 * l.setStructureDefinition(definition);
					 */
					def.addDataElement(idElement);
					((ResultElement) re).withDataElement(definition, idElement);

				} else {
					def.addDataElement(link.getDataElement());
				}
			}
		}
		if (filterExpression != null) {
			List<DataElementStructureLink> feLinks = filterExpression.getDataElements();
			for (DataElementStructureLink link : feLinks) {
				def.addDataElement(link.getDataElement());
			}
		}
		return def;
	}

	public From from() {
		return this.from;
	}

	public List<Join> joins() {
		return this.joins;
	}

	public List<Expression> getResultElements() {
		return this.out;
	}

	public List<QueryElement> getQueryElements() {
		List<QueryElement> ret = new ArrayList<QueryElement>();
		ret.add(from);
		ret.addAll(out);
		if (filterExpression != null) {
			ret.add(filterExpression);
		}
		ret.addAll(joins);
		ret.addAll(groupByList);
		ret.addAll(sortList);
		ret.addAll(elementsList);
		return ret;
	}

	@Override
	public JsonNode toJson() {
		ObjectNode node = mapper.createObjectNode();
		node.put("type", "query");
		if (from != null) {
			node.set("from", from.toJson());
		}
		if (name != null) {
			node.put("name", name);
		}
		if (limit != null) {
			node.set("limit", limit.toJson());
		}
		if (filterExpression != null) {
			node.set("filter", filterExpression.toJson());
		}
		if (this.out.size() > 0) {
			ArrayNode out = mapper.createArrayNode();
			node.set("out", out);
			for (Expression re : this.out) {
				out.add(re.toJson());
			}
		}
		if (this.joins.size() > 0) {
			ArrayNode out = mapper.createArrayNode();
			node.set("joins", out);
			for (Join join : this.joins) {
				out.add(join.toJson());
			}
		}
		if (this.groupByList.size() > 0) {
			ArrayNode out = mapper.createArrayNode();
			node.set("groups", out);
			for (ResultElement re : this.groupByList) {
				out.add(re.toJson());
			}
		}
		if (this.elementsList.size() > 0) {
			ArrayNode out = mapper.createArrayNode();
			node.set("elements", out);
			for (ResultElement re : this.elementsList) {
				out.add(re.toJson());
			}
		}
		if (this.sortList.size() > 0) {
			ArrayNode out = mapper.createArrayNode();
			node.set("sorts", out);
			for (Sort re : this.sortList) {
				out.add(re.toJson());
			}
		}
		return node;
	}

	@Override
	public void fromJson(JsonNode node) {
		if (node.has("name")) {
			this.name = node.get("name").asText();
		}

		if (node.has("from")) {
			this.from = (From) queryBuilder.fromJson(node.get("from"));
		}
		if (node.has("limit")) {
			this.limit = (Limit) queryBuilder.fromJson(node.get("limit"));
		}
		if (node.has("filter")) {
			this.filterExpression = (Expression) queryBuilder.fromJson(node.get("filter"));
		}
		if (node.has("out")) {
			ArrayNode aout = (ArrayNode) node.get("out");
			for (int i = 0; i < aout.size(); i++) {
				Expression o = (Expression) queryBuilder.fromJson(aout.get(i));
				this.out.add(o);
			}
		}
		if (node.has("joins")) {
			ArrayNode aout = (ArrayNode) node.get("joins");
			for (int i = 0; i < aout.size(); i++) {
				Join o = (Join) queryBuilder.fromJson(aout.get(i));
				this.joins.add(o);
			}
		}
		if (node.has("groups")) {
			ArrayNode aout = (ArrayNode) node.get("groups");
			for (int i = 0; i < aout.size(); i++) {
				ResultElement o = (ResultElement) queryBuilder.fromJson(aout.get(i));
				this.groupByList.add(o);
			}
		}
		if (node.has("elements")) {
			ArrayNode aout = (ArrayNode) node.get("elements");
			for (int i = 0; i < aout.size(); i++) {
				ResultElement o = (ResultElement) queryBuilder.fromJson(aout.get(i));
				this.elementsList.add(o);
			}
		}
		if (node.has("sorts")) {
			ArrayNode aout = (ArrayNode) node.get("sorts");
			for (int i = 0; i < aout.size(); i++) {
				Sort o = (Sort) queryBuilder.fromJson(aout.get(i));
				this.sortList.add(o);
			}
		}

	}

	public QueryBuilder getQueryBuilder() {
		return this.queryBuilder;
	}

}
