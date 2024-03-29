package com.legacy.health.fhir.converter;

import java.io.IOException;
import java.lang.reflect.Type;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonValue;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legacy.health.fhir.helper.FhirMediaTypes;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;

public class FHIRJsonConverter extends AbstractJackson2HttpMessageConverter {

	@Autowired
	private MetaRepository repository;

	private String jsonPrefix;

	/**
	 * Construct a new {@link MappingJackson2HttpMessageConverter} using default
	 * configuration
	 * provided by {@link Jackson2ObjectMapperBuilder}.
	 */
	public FHIRJsonConverter() {
		this(Jackson2ObjectMapperBuilder.json().build());
	}

	/**
	 * Construct a new {@link MappingJackson2HttpMessageConverter} with a custom
	 * {@link ObjectMapper}.
	 * You can use {@link Jackson2ObjectMapperBuilder} to build it easily.
	 * 
	 * @see Jackson2ObjectMapperBuilder#json()
	 */
	public FHIRJsonConverter(ObjectMapper objectMapper) {
		super(objectMapper, FhirMediaTypes.FHIR_JSON, MediaType.APPLICATION_JSON);
	}

	/**
	 * Specify a custom prefix to use for this view's JSON output.
	 * Default is none.
	 * 
	 * @see #setPrefixJson
	 */
	public void setJsonPrefix(String jsonPrefix) {
		this.jsonPrefix = jsonPrefix;
	}

	/**
	 * Indicate whether the JSON output by this view should be prefixed with ")]}',
	 * ". Default is false.
	 * <p>
	 * Prefixing the JSON string in this manner is used to help prevent JSON
	 * Hijacking.
	 * The prefix renders the string syntactically invalid as a script so that it
	 * cannot be hijacked.
	 * This prefix should be stripped before parsing the string as JSON.
	 * 
	 * @see #setJsonPrefix
	 */
	public void setPrefixJson(boolean prefixJson) {
		this.jsonPrefix = (prefixJson ? ")]}', " : null);
	}

	@Override
	protected void writePrefix(JsonGenerator generator, Object object) throws IOException {
		if (this.jsonPrefix != null) {
			generator.writeRaw(this.jsonPrefix);
		}
		String jsonpFunction = (object instanceof MappingJacksonValue
				? ((MappingJacksonValue) object).getJsonpFunction()
				: null);
		if (jsonpFunction != null) {
			generator.writeRaw("/**/");
			generator.writeRaw(jsonpFunction + "(");
		}
	}

	@Override
	protected void writeSuffix(JsonGenerator generator, Object object) throws IOException {
		String jsonpFunction = (object instanceof MappingJacksonValue
				? ((MappingJacksonValue) object).getJsonpFunction()
				: null);
		if (jsonpFunction != null) {
			generator.writeRaw(");");
		}
	}

	@Override
	public boolean canRead(Class<?> type, MediaType mediaType) {
		return ((FhirMediaTypes.FHIR_JSON.equals(mediaType) || MediaType.APPLICATION_JSON.equals(mediaType))
				&& Structure.class.isAssignableFrom(type));
	}

	@Override
	public boolean canWrite(Class<?> type, MediaType mediaType) {
		return ((FhirMediaTypes.FHIR_JSON.equals(mediaType) || MediaType.APPLICATION_JSON.equals(mediaType))
				&& Structure.class.isAssignableFrom(type));
	}

	@Override
	public Object read(Type type, Class<?> contextClass, HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException {
		JsonNode resourceNode = objectMapper.readTree(inputMessage.getBody());
		if (Structure.class.isAssignableFrom((Class<?>) type)) {
			if (!resourceNode.has("resourceType")) {
				throw new HttpMessageNotReadableException("Invalid resource. Missing 'resourceType' element.");
			}
			StructureDefinition structureDefinition = repository
					.getStructureDefinitionById(resourceNode.get("resourceType").asText());
			if (structureDefinition == null) {
				throw new HttpMessageNotReadableException(
						"ResourceType " + resourceNode.get("resourceType").asText() + " is invalid.", null);
			}
			return new JSONWalker().fromJSON(resourceNode, structureDefinition);
		} else {
			return resourceNode;
		}
	}

	@Override
	protected void writeInternal(Object object, Type type, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException {
		super.writeInternal(new JSONWalker().toJSON((Structure) object), type, outputMessage);
	}

}
