package com.legacy.health.fhir.meta.repsitory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.google.common.util.concurrent.Striped;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.meta.Context;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class MetaRepositoryImpl implements MetaRepository {
	private static Log log = LogFactory.getLog(MetaRepositoryImpl.class);
	HashMap<String, DataElement> elements = new HashMap<>();
	HashMap<String, StructureDefinition> definitions = new HashMap<>();
	HashMap<String, JsonNode> definitionsData = new HashMap<>();
	HashMap<String, SearchParameter> searchParameters = new HashMap<>();
	List<StructureDefinitionProvider> definitionProvider = new ArrayList<StructureDefinitionProvider>();
	Striped<Lock> locks = Striped.lock(1024);

	JsonNode mappings;

	public MetaRepositoryImpl() {
		for (StructureDefinitionProviderExtension extension : ExtensionProvider.getExtensionsForExtensionPoint(
				StructureDefinitionProviderExtension.extensionPoint())) {
			definitionProvider.add(extension);
		}

	}

	@Override
	public synchronized void addStructureDefinitionProvider(StructureDefinitionProvider provider) {
		this.definitionProvider.add(provider);
	}

	public void registerDataElement(DataElement element) {
		elements.put(element.getId(), element);
	}

	public void registerStructureDefinition(StructureDefinition metadata) {
		definitions.put(metadata.getId(), metadata);

	}

	public DataType getTypeById(String id) {
		StructureDefinition def = this.getStructureDefinitionById(id);
		if (def instanceof DataType)
			return (DataType) def;
		return null;
	}

	public boolean isStructureRegisteredById(String id) {
		return definitions.get(id) != null;
	}

	// TODO: fix this syncronization issue properly
	public StructureDefinition getStructureDefinitionById(String id, Context context) {
		StructureDefinition ret = definitions.get(id);
		if (ret == null) {
			Lock l = locks.get(id);
			l.lock();
			try {
				for (StructureDefinitionProvider provider : definitionProvider) {
					if (provider.provideStructureDefinitionById(this, id, context) == true) {
						ret = definitions.get(id);
						break;
					}
				}
			} finally {
				l.unlock();
			}
		}
		return ret;
	}

	public StructureDefinition getStructureDefinitionById(String id) {
		return getStructureDefinitionById(id, null);
	}

	public StructureDefinition getStructureDefinitionByUrl(String url, Context context) {
		Map<String, StructureDefinition> urlMap = getStructureDefinitionUrlMap();
		StructureDefinition ret = urlMap.get(url);
		if (ret == null) {
			definitionProvider.parallelStream().filter(dp -> dp.hasStructureDefinitionByUrl(url))
					.findFirst().ifPresent(dp -> dp.provideStructureDefinitionByUrl(this, url, context));
			urlMap = getStructureDefinitionUrlMap();
		}
		return urlMap.get(url);
	}

	private Map<String, StructureDefinition> getStructureDefinitionUrlMap() {
		Map<String, StructureDefinition> urlMap = definitions.values().parallelStream()
				.filter(sd -> sd.getUrl() != null)
				.collect(Collectors
						.toMap(StructureDefinition::getUrl, Function.identity()));
		return urlMap;
	}

	public DataElement getElementById(String id) {
		DataElement element = elements.get(id);
		return element;
	}

	public JsonNode getMappingForVersion(String version) {
		return mappings.get(version);
	}

	public void setMapping(JsonNode node) {
		this.mappings = node;
	}

	public DataElementStructureLink getElementByPath(StructureDefinition definition, String path) {
		return DataElementStructureLink.getDataElementStructureLinkByPath(definition, path);
	}

	@Override
	public void registerSearchParameter(SearchParameter searchParameter) {
		this.searchParameters.put(searchParameter.getId(), searchParameter);
	}

	@Override
	public SearchParameter getSearchParameterById(String id) {
		return this.searchParameters.get(id);
	}

	@Override
	public List<SearchParameter> getSearchParametersByType(StructureDefinition sd) {
		Vector<SearchParameter> ret = new Vector<>();
		Collection<SearchParameter> col = this.searchParameters.values();
		for (SearchParameter searchParameter : col) {
			if (searchParameter.getBase() == null) {
				log.error("SearchParameter has no Base:" + searchParameter.getId());
				continue;
			}
			try {
				if (searchParameter.getBase().contains(sd.getId())) {
					ret.add(searchParameter);
				}
			} catch (RuntimeException e) {
				log.error("error:" + searchParameter.getId() + ":" + sd.getId() + searchParameter.getBase()
						+ ".\nSome more info:\n" + e);
			}
		}
		return ret;
	}

	@Override
	public SearchParameter getSearchParameterByTypeAndCode(StructureDefinition sd, String code) {
		List<SearchParameter> list = getSearchParametersByType(sd);
		String cmp = code.split(":")[0];
		int dot = cmp.indexOf(".");
		if (dot > -1) {
			cmp = cmp.substring(0, dot);
		}
		for (SearchParameter searchParameter : list) {
			if (searchParameter.getCode().equals(cmp)) {
				return searchParameter;
			}
		}
		// Adding the "global" searches - otherwise currently difficult to include
		// "inheritance" in fluent path
		if (code.equals("_lastUpdated")) {
			SearchParameter ret = new SearchParameter();
			ret.setExpression(sd.getId() + ".meta.lastUpdated");
			ret.setType("date");
			ret.setCode("_lastUpdated");
			ret.addBase(sd.getId());
			return ret;
		}
		if (code.equals("_id")) {
			SearchParameter ret = new SearchParameter();
			ret.setExpression(sd.getId() + ".id");
			ret.setType("string");// TODO - Not Standard - id is declared as token, but has no "system/code"
									// fields
			ret.setCode("_token");
			ret.addBase(sd.getId());
			return ret;
		}
		return null;
	}

	@Override
	public HashMap<String, DataElement> getElements() {
		return elements;
	}

	@Override
	public HashMap<String, StructureDefinition> getBaseResourceIndex() {
		HashMap<String, StructureDefinition> baseresources = new HashMap<>();
		for (StructureDefinition d : definitions.values()) {
			String kind = d.getKind();
			if (kind != null && kind.equals("resource")) {
				baseresources.put(d.getId(), d);
			}
		}
		return baseresources;
	}

	@Override
	public List<JsonNode> getAllStructureDefinitions() {
		List<JsonNode> structureDefinitions = new ArrayList<JsonNode>();
		for (String key : this.definitionsData.keySet()) {
			JsonNode valueSet = this.definitionsData.get(key);
			if (valueSet != null) {
				structureDefinitions.add(valueSet);
			}
		}
		return structureDefinitions;
	}

	@Override
	public void registerStructureDefinitionSource(String structureDefinitionId, JsonNode data) {
		this.definitionsData.put(structureDefinitionId, data);
	}
}
