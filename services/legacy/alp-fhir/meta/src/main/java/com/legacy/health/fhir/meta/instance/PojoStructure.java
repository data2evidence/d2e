package com.legacy.health.fhir.meta.instance;

public class PojoStructure extends DefaultStructure<Object> {

	public PojoStructure() {
		super(null);
	}

	@Override
	public void setId(String id) {
		throw new UnsupportedOperationException();

	}

	@Override
	public ValueElement getNewValueElement() {
		return new DefaultValueElement();
	}

	@Override
	public ComplexElement getNewComplexElement() {
		return new PojoComplexElement();
	}

	@Override
	public ArrayElement getNewArrayElement() {
		return new PojoArrayElement();
	}

}
