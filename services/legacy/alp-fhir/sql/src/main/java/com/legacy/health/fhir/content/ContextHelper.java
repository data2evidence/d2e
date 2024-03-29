package com.legacy.health.fhir.content;

import java.util.ArrayList;
import org.springframework.util.StringUtils;

import org.apache.velocity.VelocityContext;

import com.fasterxml.jackson.databind.JsonNode;

public class ContextHelper {

	private VelocityContext vContext;
	private JsonNode element;

	public void setVelocityContext(VelocityContext vContext) {
		this.vContext = vContext;
	}

	public void setElement(JsonNode element) {
		this.element = element;
	};

	public JsonNode getJsonElement() {
		return element;
	}

	public Object get(String name) {
		JsonNode prop = element.get(name);
		if (prop == null) {
			return null;
		}
		if (prop.isArray()) {
			ArrayList<ContextHelper> ret = new ArrayList<ContextHelper>();
			for (int i = 0; i < prop.size(); i++) {
				JsonNode child = prop.get(i);
				if (child.isArray())
					continue;
				ret.add(create(child, vContext));
			}
			return ret;
		}
		return create(prop, vContext);

	}

	public String toString() {
		return element.asText();
	}

	public boolean startsWith(String cmp) {
		if (element.asText() == null)
			return false;
		return element.asText().startsWith(cmp);
	}

	public String capitalize() {
		return StringUtils.capitalize(element.asText());
	}

	public String dot(int i) {
		String[] seg = element.asText().split("\\.");
		if (seg.length <= i) {
			return "";
		}
		return seg[i];
	}

	public String[] pathElements() {
		String[] seg = element.asText().split("\\.");
		return seg;
	}

	public static ContextHelper create(JsonNode element, VelocityContext vContext) {
		ContextHelper ret = new ContextHelper();
		ret.setElement(element);
		ret.setVelocityContext(vContext);
		return ret;
	}
}
