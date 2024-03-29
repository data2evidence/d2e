package com.legacy.health.fhir.meta.instance;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.entity.DataElement;

public abstract class DefaultComplexElement<T> extends DefaultElement<T> implements ComplexElement<T> {

	private Log log = LogFactory.getLog(DefaultComplexElement.class);

	protected List<Element> elements = new ArrayList<Element>();
	protected Map<String, Element<?>> nameindex = new HashMap<>();

	@Override
	public List<Element> getElements() {
		return elements;
	}

	@Override
	public void addElement(Element element) {
		if (elements.contains(element)) {
			return;
		}
		if (element == null) {// TODO error when valueString holds Array?
			log.trace("CHECK");
			return;
		}
		elements.add(element);
		nameindex.put(element.getDefinition().getShortName(), element);
		element.setStructure(this.structure);
	}

	@Override
	public String toString() {
		String elementtype = "ComplexElement";
		if (this.isArrayType()) {
			elementtype = "ArrayElement";
		}
		if (elements.size() == 0) {
			return elementtype + " (path:\"" + this.getPath() + "\"): \"<null>\"";
		} else {
			return elementtype + " (path:\"" + this.getPath() + "\"): \"" + elements.toString() + "\"";
		}
	}

	public Element<?> getChildElement(String childname) {
		return nameindex.get(childname);
	}

	public Element<?> getOrCreateChildElement(String childname) {
		Element<?> e = getChildElement(childname);
		if (e == null) {
			DataElement datatype = getDefinition().getType().getDataElementByName(childname);
			if (datatype.getMax() > 1) {
				e = this.structure.getNewArrayElement();
			} else if (datatype.getType().isComplex()) {
				e = this.structure.getNewComplexElement();
			} else {
				e = this.structure.getNewValueElement();
			}
			e.setDefinition(datatype);
			e.setPath(this.getPath() + "." + childname);
			e.setContainer(this);
			e.setStructure(structure);
		}
		return e;
	}
}
