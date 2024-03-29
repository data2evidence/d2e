package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class CategorizedElement {
        static final Predicate<DataElement> _IS_VALID = element -> element.getType() != null;
        static final Predicate<DataElement> _IS_SINGLE_ELEMENT = element -> element.getMax() <= 1;
        static final Predicate<DataElement> _IS_COMPLEX = element -> element.getType().isComplex();

        static final Predicate<DataElement> SINGLE_VALUE_ELEMENT_FILTER = element -> _IS_VALID.test(element) &&
                        _IS_SINGLE_ELEMENT.test(element) &&
                        !_IS_COMPLEX.test(element);
        static final Predicate<DataElement> ARRAY_VALUE_ELEMENT_FILTER = element -> _IS_VALID.test(element) &&
                        !_IS_SINGLE_ELEMENT.test(element) &&
                        !_IS_COMPLEX.test(element);

        static final Predicate<DataElement> COMPLEX_VALUE_ELEMENT_FILTER = element -> _IS_VALID.test(element) &&
                        _IS_SINGLE_ELEMENT.test(element) &&
                        _IS_COMPLEX.test(element);

        static final Predicate<DataElement> COMPLEX_VALUES_ELEMENT_FILTER = element -> _IS_VALID.test(element) &&
                        !_IS_SINGLE_ELEMENT.test(element) &&
                        _IS_COMPLEX.test(element);

        static Set<DataElement> filterElementsBy(List<DataElement> elements, Predicate<DataElement> pred) {
                return elements.stream()
                                .filter(pred)
                                .collect(Collectors.toSet());
        }

        Set<DataElement> singleCardNonComplexElements;
        Set<DataElement> arrayCardNonComplexElements;
        Set<DataElement> singleCardComplexElements;
        Set<DataElement> arrayCardComplexElements;
        private StructureDefinition elem;
        private String parentPath;

        public CategorizedElement getChild(DataElement element) {
                CategorizedElement categorizedElements = getCategorizedElements(element.getType());
                categorizedElements.parentPath += "_" + element.getShortName(); // TODO this is not correct e.g.
                                                                                // https://www.hl7.org/fhir/datatypes.html#Timing
                                                                                // the field timing.repeat.count will
                                                                                // appear as
                                                                                // count in the shortname
                return categorizedElements;
        }

        static CategorizedElement getCategorizedElements(StructureDefinition elements, String prefix) {
                CategorizedElement returnVal = new CategorizedElement();
                returnVal.singleCardNonComplexElements = filterElementsBy(elements.getDataElements(),
                                com.legacy.health.fhir.meta.sql.CategorizedElement.SINGLE_VALUE_ELEMENT_FILTER);
                returnVal.arrayCardNonComplexElements = filterElementsBy(elements.getDataElements(),
                                com.legacy.health.fhir.meta.sql.CategorizedElement.ARRAY_VALUE_ELEMENT_FILTER);
                returnVal.singleCardComplexElements = filterElementsBy(elements.getDataElements(),
                                com.legacy.health.fhir.meta.sql.CategorizedElement.COMPLEX_VALUE_ELEMENT_FILTER);
                returnVal.arrayCardComplexElements = filterElementsBy(elements.getDataElements(),
                                com.legacy.health.fhir.meta.sql.CategorizedElement.COMPLEX_VALUES_ELEMENT_FILTER);
                returnVal.parentPath = prefix;
                returnVal.elem = elements;
                return returnVal;
        }

        static CategorizedElement getCategorizedElements(StructureDefinition elements) {
                return getCategorizedElements(elements, "");
        }

        public String getPrefix() {
                return this.parentPath;
        }

        public StructureDefinition getElem() {
                return elem;
        }
}
