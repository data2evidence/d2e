package com.legacy.health.fhir.meta.instance;

public interface ValueElement<T> extends Element<T> {

    void setValue(T value);

    void updateValue(Object value);

    Object getValue();

    ArrayElement<?> getValueExtension();

    void setFieldExtension(ArrayElement<?> extension);

    ValueElement<?> getFieldExtensionId();

    void setFieldExtensionId(ValueElement<?> e);
}
