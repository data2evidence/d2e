package com.legacy.health.fhir.meta.repsitory;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Stack;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.legacy.health.fhir.extension.ExtensionProvider;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataType;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

public class RepositoryBuilder {

	private static MetaRepository instance;
	private static Log log = LogFactory.getLog(RepositoryBuilder.class);

	public static MetaRepository createRepository(SpecificationStreamProvider provider) throws FhirException {
		if (instance != null) {
			return instance;
		}
		InputStream is = null;
		try {
			MetaRepository ret = new MetaRepositoryImpl();
			ObjectMapper mapper = new ObjectMapper();
			is = provider.provideTypes();
			JsonNode root = mapper.readTree(is);
			is.close();

			JsonNode entry = root.get("entry");

			// create all type Instances
			Iterator<JsonNode> it1 = entry.iterator();
			while (it1.hasNext()) {
				JsonNode child = it1.next();
				JsonNode resource = child.get("resource");
				boolean kind = resource.get("kind").textValue().equals("complex-type");
				DataType type = new DataType(resource.get("id").asText(), kind);
				ret.registerStructureDefinition(type);
			}
			createStructureDefinition(ret, entry);
			// load the Resources
			is = provider.provideResourceDefinitions();
			JsonNode resourceDefinitions = mapper.readTree(is);
			is.close();

			createStructureDefinition(ret, resourceDefinitions.get("entry"));

			is = provider.provideSearchParameters();
			JsonNode searchParameters = mapper.readTree(provider.provideSearchParameters());
			is.close();

			createSearchParameter(ret, searchParameters.get("entry"));
			instance = ret;

			return ret;
		} catch (RuntimeException | IOException e) {
			throw new FhirException("Error while creating MetaRepository", e);
		} finally {
			if (is != null)
				try {
					is.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					log.error(" IOException while closing " + e);
					e.printStackTrace();
				}
		}
	}

	public static MetaRepository createRepository(String metaDataDir) throws FhirException {
		FolderSpecificationProvider provider = new FolderSpecificationProvider();
		provider.setSpecificationPath(metaDataDir);
		return createRepository(provider);
	}

	public static void createSearchParameter(MetaRepository repo, JsonNode entry) {
		Iterator<JsonNode> it = entry.iterator();
		while (it.hasNext()) {
			JsonNode child = it.next();
			JsonNode resource = child.get("resource");
			SearchParameter sParam = repo.getSearchParameterById(resource.get("id").asText());
			if (sParam == null) {
				sParam = new SearchParameter();
				sParam.setId(resource.get("id").asText());
				repo.registerSearchParameter(sParam);
			}
			JsonNode baseArray = resource.get("base");
			Iterator<JsonNode> baseTypes = baseArray.iterator();
			while (baseTypes.hasNext()) {
				JsonNode element = baseTypes.next();
				sParam.addBase(element.asText());
			}
			JsonNode targetArray = resource.get("target");
			if (targetArray != null) {
				Iterator<JsonNode> targetTypes = targetArray.iterator();
				while (targetTypes.hasNext()) {
					JsonNode element = targetTypes.next();
					sParam.addTarget(element.asText());
				}
			}
			String type = resource.get("type").textValue();
			sParam.setType(type);
			String code = resource.get("code").textValue();
			sParam.setCode(code);
			JsonNode expressionNode = resource.get("expression");
			if (expressionNode != null) {
				String expression = expressionNode.textValue();
				sParam.setExpression(expression);
			}
		}
	}

	public static void createStructureDefinition(MetaRepository repo, JsonNode entry) {
		Iterator<JsonNode> it = entry.iterator();
		while (it.hasNext()) {
			JsonNode child = it.next();
			JsonNode resource = child.get("resource");
			registerSingleStructureDefinition(repo, resource);
		}
	}

	protected static List<String> getProfilesOfResource(JsonNode resource) {
		List<String> ret = new ArrayList<String>();
		JsonNode meta = resource.get("meta");
		if (meta != null) {
			JsonNode profiles = meta.get("profile");
			if (profiles instanceof ArrayNode) {
				for (JsonNode jsonNode : profiles) {
					ret.add(jsonNode.asText());
				}
			}
		}
		return Collections.unmodifiableList(ret);
	}

	private static HashMap<String, StructureDefinitionDeserializerExtension> deserializerMap;

	public static void registerSingleStructureDefinition(MetaRepository repo, JsonNode resource) {
		if (deserializerMap == null) {
			deserializerMap = new HashMap<String, StructureDefinitionDeserializerExtension>();
			List<StructureDefinitionDeserializerExtension> extensions = ExtensionProvider
					.getExtensionsForExtensionPoint(StructureDefinitionDeserializerExtension.extensionPoint());
			extensions.stream()
					.forEach(ext -> ext.getSupportedProfiles().stream().forEach(p -> deserializerMap.put(p, ext)));
		}
		List<String> profiles = getProfilesOfResource(resource);
		for (String profile : profiles) {
			if (deserializerMap.containsKey(profile)) {
				StructureDefinition def = deserializerMap.get(profile).deserializeDefinition(resource);
				repo.registerStructureDefinition(def);
				return;
			}
		}
		StructureDefinition type = null;
		if (repo.isStructureRegisteredById(resource.get("id").asText())) {
			type = repo.getStructureDefinitionById(resource.get("id").asText());
		}

		if (type == null) {
			type = new StructureDefinition(resource.get("id").asText());
			String url = resource.get("url").asText();
			if (url != null) {
				type.setUrl(url);
			}
			JsonNode kind = resource.get("kind");
			if (kind != null) {
				type.setKind(kind.textValue());
			}
			if (resource.get("type") != null) {
				type.setType(resource.get("type").asText());
			}
			repo.registerStructureDefinition(type);
		}
		JsonNode meta = resource.get("meta");
		if (meta != null) {
			JsonNode profile = meta.get("profile");
			if (profile != null && profile.isArray()) {
				for (int p = 0; p < profile.size(); p++) {
					type.addProfile(profile.get(p).textValue());
				}
			}
		}

		JsonNode baseDefinition = resource.get("baseDefinition");
		if (baseDefinition != null) {
			type.setBaseDefinition(baseDefinition.textValue());
		}
		JsonNode snapshot = resource.get("snapshot");
		if (snapshot == null)
			return;// deal with base
		JsonNode elementArray = snapshot.get("element");
		Iterator<JsonNode> elements = elementArray.iterator();
		Stack<StructureDefinition> stack = new Stack<>();
		stack.push(type);
		while (elements.hasNext()) {
			JsonNode element = elements.next();
			String id;
			if (element.get("id") != null) {// DSTU2
				id = element.get("id").asText();
			} else {
				id = element.get("path").asText();
			}

			JsonNode aliasesJson = element.get("alias");
			List<String> aliases = new ArrayList<>();
			if (aliasesJson != null) {
				for (int a = 0; a < aliasesJson.size(); a++) {
					aliases.add(aliasesJson.get(a).asText().toLowerCase(Locale.getDefault()));
				}
			}
			if (id.startsWith("Quantity:simplequantity")) {// TODO :deal with
															// constraints and
															// SimpleQuantity
				continue;
			}
			while (!stack.isEmpty() && (id.indexOf(stack.peek().getId()) != 0)) {// Search
																					// for
																					// parent
																					// element
																					// in
																					// stack
				stack.pop();
			}
			if (stack.isEmpty()) {// in case we deal with a profile
				// &&id.startsWith(type.getBaseDefinition())
				stack.push(type);// add parent
			}

			List<String> representation = null;
			if (element.has("representation")) {
				ArrayNode representationJSON = (ArrayNode) element.get("representation");
				representation = new ArrayList<>();
				for (int i = 0; i < representationJSON.size(); i++) {
					representation.add(representationJSON.get(i).asText());
				}
			}
			int min = element.get("min").asInt();
			int max = 0;
			JsonNode maxJson = element.get("max");
			if (maxJson.isNumber()) {
				max = maxJson.asInt();
			}
			if (maxJson.isTextual() && maxJson.asText().equals("*")) {
				max = Integer.MAX_VALUE;
			}
			if (maxJson.isTextual() && isNumeric(maxJson.asText())) {
				max = Integer.parseInt(maxJson.asText());
			}
			JsonNode typeJson = element.get("type");
			int typeCount = 0;
			if (typeJson != null) {
				typeCount = typeJson.size();
			}
			if (typeCount == 1) {
				JsonNode codeJson = typeJson.get(0).get("code");
				if (codeJson != null) {
					if (codeJson.asText().equals("BackboneElement")) {
						DataType backBoneType = new DataType(id, new ArrayList<>(), true, true);
						DataElement dataElement = new DataElement(id, backBoneType, min, max, id.endsWith("[x]"));
						dataElement.setAliasesList(aliases);
						dataElement.setRepresentation(representation);
						repo.registerDataElement(dataElement);
						stack.peek().addDataElement(dataElement);
						stack.push(backBoneType);
					} else {
						DataElement dataElement = new DataElement(id, repo.getTypeById(codeJson.asText()), min, max,
								id.endsWith("[x]"));
						dataElement.setAliasesList(aliases);
						dataElement.setRepresentation(representation);
						repo.registerDataElement(dataElement);
						if (codeJson.asText().equals("Reference")) {
							JsonNode targetProfile = typeJson.get(0).get("targetProfile");
							if (targetProfile != null) {
								dataElement.addTargetProfile(targetProfile.asText());
							}
						}
						stack.peek().addDataElement(dataElement);
					}
				}
			}
			if (typeCount > 1) {
				if (id.indexOf("[") > -1) {
					String prefix = id.split("\\[")[0];
					for (JsonNode jsonNode : typeJson) {
						String code = jsonNode.get("code").asText();
						DataElement dataElement = type.getDataElement(code);
						if (dataElement == null) {
							dataElement = new DataElement(prefix + firstToUpper(code), repo.getTypeById(code), min, max,
									id.endsWith("[x]"));
							dataElement.setRepresentation(representation);
							repo.registerDataElement(dataElement);
							dataElement.setAliasesList(aliases);
							stack.peek().addDataElement(dataElement);
						}
						JsonNode targetProfile = jsonNode.get("targetProfile");
						if (targetProfile != null) {
							dataElement.addTargetProfile(targetProfile.asText());
						}
					}
				} else {
					boolean initial = true;
					for (JsonNode jsonNode : typeJson) {
						String code = jsonNode.get("code").asText();
						if (code.equals("Reference")) {
							DataElement dataElement = type.getDataElement(code);
							if (initial) {
								if (dataElement == null) {
									dataElement = new DataElement(id, repo.getTypeById(code), min, max,
											id.endsWith("[x]"));
									dataElement.setAliasesList(aliases);
									dataElement.setRepresentation(representation);
									repo.registerDataElement(dataElement);
									// stack.peek().addDataElement(dataElement);
								}
								stack.peek().addDataElement(dataElement);
							}
							JsonNode targetProfile = jsonNode.get("targetProfile");
							if (targetProfile != null) {
								dataElement.addTargetProfile(targetProfile.asText());
							}
						}

					}
				}
			}

		}
	}

	public static String firstToUpper(String str) {
		return str.substring(0, 1).toUpperCase(Locale.getDefault()) + str.substring(1);
	}

	public static boolean isNumeric(String s) {
		if (s == null)
			return false;
		return s.matches("[-+]?\\d*\\.?\\d+");
	}

	public static MetaRepository getInstance() {
		Objects.requireNonNull(instance);
		return instance;
	}
}
