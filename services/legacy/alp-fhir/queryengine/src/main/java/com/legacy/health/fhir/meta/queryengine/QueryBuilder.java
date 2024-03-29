package com.legacy.health.fhir.meta.queryengine;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Path;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class QueryBuilder {
	private static Log log = LogFactory.getLog(QueryBuilder.class);

	protected HashMap<String, Class> registry = new HashMap<String, Class>();

	public void registerType(String key, Class cls) {
		registry.put(key, cls);
	}

	public QueryBuilder() {
		registerType("query", Query.class);
		registerType("from", From.class);
		registerType("join", Join.class);
		registerType("resultelement", ResultElement.class);
		registerType("interval", Interval.class);
		registerType("overlapsexpression", OverlapsExpression.class);
		registerType("timebetweenexpression", TimeBetweenExpression.class);
		registerType("invaluesetexpression", TimeBetweenExpression.class);
		registerType("parameter", Parameter.class);
		registerType("binaryexpression", BinaryExpression.class);
		registerType("stringexpression", StringExpression.class);
		registerType("instantexpression", InstantExpression.class);
		registerType("integerexpression", IntegerExpression.class);
		registerType("decimalexpression", DecimalExpression.class);
		registerType("tokenexpression", TokenSearchExpression.class);
		registerType("unaryfunction", UnaryFunction.class);
		registerType("isnullexpression", IsXXNullExpression.class);
		registerType("rownumwindowexpression", RowNumWindowExpression.class);
		registerType("limit", Limit.class);
		registerType("sort", Sort.class);
		registerType("quantityexpression", QuantitySearchExpression.class);
	}

	protected MetaRepository repo;

	public Query query(String name) {
		return (Query) new Query().withName(name).withQueryBuilder(this);
	}

	public void setMetaRepository(MetaRepository repo) {
		this.repo = repo;
	}

	public MetaRepository getMetaRepository() {
		return repo;
	}

	/**
	 * Returns the StructureDefinition for the given name or null;
	 * 
	 * @param structureDefinition
	 * @return StructureDefinition for the given name or null;
	 */
	public StructureDefinition sd(String structureDefinition) {
		return repo.getStructureDefinitionById(structureDefinition);
	}

	public DataElement de(String dataelement) {
		return repo.getElementById(dataelement);
	}

	public From from(StructureDefinition definition) {
		From ret = new From().withStructureDefinition(definition);
		ret.withQueryBuilder(this);
		return ret;
	}

	public From from(String definition) {
		return from(sd(definition));
	}

	public ResultElement out(StructureDefinition definition, DataElement dataelement) {
		return (ResultElement) new ResultElement().withDataElement(definition, dataelement).withQueryBuilder(this);
	}

	public ResultElement out(StructureDefinition definition, String path) {
		Path p = new Path();
		p.withPath(path);
		return (ResultElement) new ResultElement().withPath(definition, p).withQueryBuilder(this);
	}

	public ResultElement out(String definition, String path) {
		Path p = new Path();
		p.withPath(path);
		return (ResultElement) new ResultElement().withPath(sd(definition), p).withQueryBuilder(this);
	}

	public ResultElement out(String definition) {
		return (ResultElement) new ResultElement().withStructureDefinition(sd(definition)).withQueryBuilder(this);
	}

	public Sort sort(ResultElement element, boolean descending) {
		Sort ret = new Sort();
		ret.by(element);
		if (descending) {
			ret.descending();
		} else {
			ret.ascending();
		}
		return ret;
	}

	public ResultElement out(StructureDefinition definition) {
		return (ResultElement) new ResultElement().withStructureDefinition(definition).withQueryBuilder(this);
	}

	public RowNumWindowExpression rownum(Expression partition, Expression orderBy) {
		RowNumWindowExpression ret = new RowNumWindowExpression();
		ret.withPartition(partition).withOrderBy(orderBy);
		return ret;
	}

	public Limit limit(Integer limit, Integer offset) {
		return new Limit().limit(limit).offset(offset);
	}

	public Limit limit(Integer limit) {
		return new Limit().limit(limit);
	}

	public Join join(StructureDefinition definition, String path) {
		Path p = new Path();
		p.withPath(path);
		ResultElement re = (ResultElement) new ResultElement().withPath(definition, p).withQueryBuilder(this);
		Join j = new Join();
		return (Join) j.withStructureDefinition(definition).withLink(re).withQueryBuilder(this);
	}

	public Join join(StructureDefinition definition, ResultElement re) {
		Join j = new Join();
		return (Join) j.withStructureDefinition(definition).withLink(re).withQueryBuilder(this);
	}

	public BinaryExpression eq(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation("=").right(right);
	}

	public UnaryFunction avg(Expression parameter) {
		UnaryFunction ret = new UnaryFunction();
		ret.name("avg").parameter(parameter).withQueryBuilder(this);
		return ret;
	}

	public UnaryFunction max(Expression parameter) {
		UnaryFunction ret = new UnaryFunction();
		ret.name("max").parameter(parameter).withQueryBuilder(this);
		return ret;
	}

	public BinaryExpression and(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation(" AND ").right(right);
	}

	public BinaryExpression greaterThan(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation(">").right(right);
	}

	public BinaryExpression lessThan(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation("<").right(right);
	}

	public BinaryExpression greaterEqual(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation(">=").right(right);
	}

	public BinaryExpression lessEqual(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation("<=").right(right);
	}

	public BinaryExpression or(Expression left, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation(" OR ").right(right);
	}

	public BinaryExpression binary(Expression left, String operation, Expression right) {
		return (BinaryExpression) new BinaryExpression().left(left).operation(operation).right(right);
	}

	public StringExpression string(String value) {
		return (StringExpression) new StringExpression().value(value).withQueryBuilder(this);
	}

	public IntegerExpression integer(Integer value) {
		return (IntegerExpression) new IntegerExpression().value(value).withQueryBuilder(this);
	}

	public DecimalExpression decimal(BigDecimal value) {
		return (DecimalExpression) new DecimalExpression().value(value).withQueryBuilder(this);
	}

	public InstantExpression instant(Instant value) {
		return (InstantExpression) new InstantExpression().value(value).withQueryBuilder(this);
	}

	public Interval interval(Expression low, Expression high) {
		Interval ret = new Interval();
		ret.high(high);
		ret.low(low);
		return ret;
	}

	public TimeBetweenExpression timeBetween(String precission, Expression left, Expression right) {
		TimeBetweenExpression ret = new TimeBetweenExpression();
		ret.left(left);
		ret.right(right);
		ret.precission(precission);
		ret.withQueryBuilder(this);
		return ret;
	}

	public OverlapsExpression overlapsBetween(Expression left, Expression right) {
		OverlapsExpression ret = new OverlapsExpression();
		ret.left(left);
		ret.right(right);
		ret.withQueryBuilder(this);
		return ret;
	}

	public QuantityExpression quantity(Expression value, Expression unit) {
		QuantityExpression ret = new QuantityExpression();
		ret.value(value).unit(unit);
		ret.withQueryBuilder(this);
		return ret;
	}

	public InValueSetExpression inValueSet(Expression code, String valueSet) {
		InValueSetExpression ret = new InValueSetExpression();
		ret.code(code);
		ret.valueSet(valueSet);
		ret.withQueryBuilder(this);
		return ret;
	}

	public TokenSearchExpression searchToken(ResultElement element, String system, String code) {
		TokenSearchExpression ret = new TokenSearchExpression();
		ret.context(element).system(system).code(code).withQueryBuilder(this);
		return ret;
	}

	public QuantitySearchExpression searchQuantity(ResultElement element, String system, String code, Double value,
			String unit, String operation) {
		QuantitySearchExpression ret = new QuantitySearchExpression();
		ret.context(element).system(system).code(code).value(value).operation(operation).withQueryBuilder(this);
		return ret;
	}

	public IsXXNullExpression isNull(Expression expression) {
		IsXXNullExpression ret = new IsXXNullExpression();
		ret.expression(expression);
		return ret;
	}

	public IsXXNullExpression isNotNull(Expression expression) {
		return this.isNull(expression).not();
	}

	public Parameter param(String name, Expression defValue) {
		Parameter ret = new Parameter();
		ret.name(name).defaultValue(defValue);
		return ret;
	}

	public Parameter param(String name, String type) {
		Parameter ret = new Parameter();
		ret.name(name).type(type);
		return ret;
	}

	public QueryElement fromJson(JsonNode in) {
		QueryElement ret = null;
		String type = in.get("type").asText();
		Class cls = registry.get(type);
		try {
			ret = (QueryElement) cls.newInstance();
			ret.withQueryBuilder(this);
			ret.fromJson(in);
		} catch (InstantiationException | IllegalAccessException e) {
			String msg = "Error while parsing query json for type:" + type;
			log.error(msg, e);
			throw new QueryEngineRuntimeException(msg, e);
		}
		return ret;
	}

	public String mapOperation(String op) {
		switch (op) {
			case "eq":
				return "=";
			case "gt":
				return ">";
			case "lt":
				return "<";
			case "ge":
				return ">=";
			case "le":
				return "<=";
			case "ne":
				return "!=";
			case "sa":
				return ">";
			case "eb":
				return "<";
			default:
				return null;
		}
	}

}
