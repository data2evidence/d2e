package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

import java.util.HashSet;
import java.util.Set;

public class TableDefinition {

    final StructureDefinition def;
    String schema;
    String name;

    class WrappedDataElement {
        String prefix;
        DataElement e;

        WrappedDataElement(DataElement elem, String pref) {
            this.prefix = pref;
            this.e = elem;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (!(o instanceof WrappedDataElement))
                return false;

            WrappedDataElement that = (WrappedDataElement) o;

            if (!prefix.equals(that.prefix))
                return false;
            return e.equals(that.e);
        }

        @Override
        public int hashCode() {
            int result = prefix.hashCode();
            result = 31 * result + e.hashCode();
            return result;
        }
    }

    Set<WrappedDataElement> elements = new HashSet<>();

    TableDefinition(String root_id, String schema, StructureDefinition def) {
        this.schema = schema;
        this.name = root_id.isEmpty() ? def.getId() : root_id + "_" + def.getId();
        this.def = def;
    }

    void addElementsFromCategorizedElements(CategorizedElement elem) {
        elem.singleCardNonComplexElements.forEach(e -> {
            this.elements.add(new WrappedDataElement(e, elem.getPrefix()));
        });
    }

}
