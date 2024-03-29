package com.legacy.health.fhir.meta.instance;

public abstract class AbstractValueElement<T> extends DefaultElement<T> implements ValueElement<T> {

	protected Object externalValue;
	protected ArrayElement<?> fieldextension = null;
	protected ValueElement<?> fieldextensionid = null;

	@Override
	public final void setValue(T internalValue) {
		this.internalValue = internalValue;
		setObject();
	}

	protected abstract void setObject();

	@Override
	public final Object getValue() {
		return this.externalValue;
	}

	@Override
	public ArrayElement<?> getValueExtension() {
		return fieldextension;
	}

	public void setFieldExtension(ArrayElement<?> element) {
		this.fieldextension = element;
	}

	@Override
	public ValueElement<?> getFieldExtensionId() {
		return fieldextensionid;
	}

	@Override
	public void setFieldExtensionId(ValueElement<?> element) {
		this.fieldextensionid = element;
	}

	@Override
	public String toString() {
		if (externalValue == null) {
			return "ValueElement (path:\"" + this.getPath() + "\"): \"<null>\"";
		} else {
			return "ValueElement (path:\"" + this.getPath() + "\"): \"" + externalValue.toString() + "\"";
		}
	}

}
