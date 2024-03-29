package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.DataElementStructureLink;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.util.HashMap;
import java.util.Map;

public class RelationalCatalog {

    Map<String, PathToTableStructure> rootElements = new HashMap<>();

    void registerElement(String rootElement, DataElement e, Table t, String col) {
        rootElements.computeIfAbsent(rootElement, k -> rootElements.put(k, new PathToTableStructure()));
        rootElements.get(rootElement).register(e, t, col);
    }

    private class PathToTableStructure {
        Map<String, Pair<Table, String>> PathToTableColPair = new HashMap<>();

        void register(DataElement e, Table t, String col) {
            this.PathToTableColPair.put(e.getId(), new ImmutablePair<>(t, col));
        }

        public Table lookUpTablefor(DataElementStructureLink link) {
            Pair<Table, String> tableStringPair = this.PathToTableColPair.get(link.getDataElement().getId());
            return tableStringPair == null ? null : tableStringPair.getLeft();
        }
    }

    public Table lookUpTableFor(DataElementStructureLink link) throws ExTableNotFoundException {
        PathToTableStructure pathToTableStructure = rootElements.get(link.getStructureDefinition().getId());
        if (pathToTableStructure == null) {
            throw new ExTableNotFoundException(
                    "There is no table registered for" + link.getStructureDefinition().getId());
        }
        Table table = pathToTableStructure.lookUpTablefor(link);
        if (table == null) {
            throw new ExTableNotFoundException("There is no element " + link.getDataElement().getId()
                    + " registered for" + link.getStructureDefinition().getId());
        }
        return table;
    }
}
