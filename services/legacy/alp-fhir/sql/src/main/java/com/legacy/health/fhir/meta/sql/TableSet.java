package com.legacy.health.fhir.meta.sql;

import com.legacy.health.fhir.meta.entity.DataElement;
import com.legacy.health.fhir.meta.entity.StructureDefinition;

import java.util.*;

import static com.legacy.health.fhir.meta.sql.CategorizedElement.getCategorizedElements;

//TODO reference table special handling
//TODO recursive elements
//TODO protext agains trecustion overflows
public class TableSet {

    private StructureDefinition rootDefinition;
    private TableDefinition rootTable;

    final Set<Table> tableDefinitions;
    private SQLProviderFactory factory;
    private final HashMap<String, HashMap<String, Table>> elementMap = new HashMap<>();
    private final Map<StructureDefinition, Set<Table>> ddlStamementsByParent;

    private final RelationalCatalog catalog;
    private final String schema;

    public TableSet(String schema, SQLProviderFactory factory, RelationalCatalog catalog) {
        this.tableDefinitions = new HashSet<>();
        this.schema = schema;
        this.catalog = catalog;
        this.factory = factory;
        ddlStamementsByParent = new HashMap<>();
    }

    private Table getTable(String name) {
        for (Table table : tableDefinitions) {
            if (table.name.equals(name))
                return table;
        }
        return null;
    }

    private boolean hasTable(String name) {
        Table t = getTable(name);
        return t != null;
    }

    private void storeTable(Table def) {
        this.tableDefinitions.add(def);
        this.ddlStamementsByParent.computeIfAbsent(this.rootDefinition,
                k -> this.ddlStamementsByParent.put(k, new HashSet<>()));
        this.ddlStamementsByParent.get(this.rootDefinition).add(def);
    }

    public void generateTablesFor(StructureDefinition def) {
        this.rootDefinition = def;
        CategorizedElement categorizedElementsInRoot = getCategorizedElements(def);
        // Add single non-complex
        this.rootTable = new TableDefinition("", schema, def);
        List<CategorizedElement> tableRootsToEvaluate = new LinkedList<>();
        createNewTableRoot(categorizedElementsInRoot, this.rootTable, tableRootsToEvaluate);
        storeTable(getTable(this.rootTable, true));
        Set<String> createdAlreay = new HashSet<>();
        createdAlreay.add("Extension");
        while (!tableRootsToEvaluate.isEmpty()) {
            CategorizedElement elem = tableRootsToEvaluate.remove(0);
            if (!createdAlreay.add(elem.getElem().getId()))
                continue;
            if (hasTable(elem.getElem().getId()))
                continue;

            TableDefinition rTable = new TableDefinition(rootDefinition.getId(), schema, elem.getElem());
            createNewTableRoot(elem, rTable, tableRootsToEvaluate);
            if (!rTable.elements.isEmpty()) {
                storeTable(getTable(rTable, false));

            }
        }

    }

    private void createNewTableRoot(CategorizedElement categorizedElementsInRoot, TableDefinition root,
            List<CategorizedElement> tableRootsToEvaluate) {

        RecursionGuard guard = new RecursionGuard();
        handleCategorizedElement(rootDefinition.getId(), root, categorizedElementsInRoot, guard, tableRootsToEvaluate);
    }

    private void collapseSingleComplexElement(DataElement e, String prefix, TableDefinition rootTable,
            RecursionGuard guard, List<CategorizedElement> tableRootsToEvaluate) {
        CategorizedElement elem;
        if ((elem = guard.check(getCategorizedElements(e.getType(), e.getShortName()))) == null) {
            System.out.println("Detected recursion in: " + prefix + "_" + e.getShortName());

            // TODO: in case of an recurstion: take the recursing Element, and handle it
            // like a ComplexArray Table, with abort on next recursion appearance
        } else {
            handleCategorizedElement(prefix, rootTable, elem, guard, tableRootsToEvaluate);
        }

    }

    private void handleCategorizedElement(String prefix, TableDefinition rootTable, CategorizedElement elem,
            RecursionGuard guard, List<CategorizedElement> tableRootsToEvaluate) {
        // Add single non-complex
        rootTable.addElementsFromCategorizedElements(elem);
        elem.singleCardNonComplexElements.clear();

        // Add array non-complex
        elem.arrayCardNonComplexElements
                .forEach(e -> addSingleSimpleTypeArrayTable(elem.getElem().getId(), elem.getPrefix(), e));
        elem.arrayCardNonComplexElements.clear();

        // Add single complex
        elem.singleCardComplexElements.forEach(e -> {
            RecursionGuard newGuard = new RecursionGuard(guard);
            collapseSingleComplexElement(e, prefix + "_" + e.getShortName(), rootTable, newGuard, tableRootsToEvaluate);
        });
        elem.singleCardComplexElements.clear();

        // Add array complex
        elem.arrayCardComplexElements.forEach(e -> {
            tableRootsToEvaluate.add(getCategorizedElements(e.getType()));
        });
        elem.arrayCardComplexElements.clear();
    }

    private void registerTable(DataElement element, Table table) {
        StructureDefinition definition = table.getDefinition();
        HashMap<String, Table> structureTables = elementMap.computeIfAbsent(element.getId(),
                k -> new HashMap<String, Table>());
        structureTables.put(definition.getId(), table);
    }

    private String getTableName(String root_Id, String field_prefix, String field_name) {
        return (field_prefix.isEmpty() ? rootDefinition.getId() + "_" + root_Id + "_" + field_name
                : rootDefinition.getId() + "_" + root_Id + "_" + field_prefix + "_" + field_name)
                .replaceAll("\\.", "\\_").toUpperCase();
    }

    private Table getTable(TableDefinition def, boolean asRoot) {
        Table t = factory.createTable();
        t.setDefinition(def.def);
        t.schema = '"' + this.schema + '"';
        t.name = '"' + def.name.replaceAll("\\.", "\\_").toUpperCase() + '"';
        if (!asRoot) {
            Column idColumn = new Column("\"PARENT_ID\"", "VARCHAR(60)");
            t.setStructureLinkColumn(idColumn);
            t.addColumn(idColumn);
            t.addColumn(new Column("\"DATAELEMENT_ID\"", "VARCHAR(100)"));
            t.addColumn(new Column("\"REFERENCE_PATH\"", "VARCHAR(100)"));
            t.addColumn(new Column("\"LOGICAL_PATH\"", "VARCHAR(100)"));
        }

        def.elements.forEach(element -> {
            registerTable(element.e, t);
            String colName = '"' + (element.prefix.isEmpty() ? element.e.getShortName()
                    : element.prefix + "_" + element.e.getShortName()).toUpperCase() + '"';
            catalog.registerElement(rootDefinition.getId(), element.e, t, colName);
            Column c = new Column(colName, this.factory.createSQLTypeMapper().getSQLType(element.e), element.e);
            if (asRoot && element.e.getShortName().equals("id")) {
                t.setStructureLinkColumn(c);
            }
            t.addColumn(c);
        });
        return t;
    }

    private void addSingleSimpleTypeArrayTable(String root_id, String prefix, DataElement element) {
        Table t = factory.createTable();
        t.setDefinition(element.getType());
        t.schema = '"' + this.schema + '"';
        t.name = getTableName(root_id, prefix, element.getShortName());
        registerTable(element, t);
        catalog.registerElement(rootDefinition.getId(), element, t, "");
        Column parentId = new Column();
        parentId.name = "\"PARENT_ID\"";
        parentId.type = "VARCHAR(60)";
        t.addColumn(parentId);
        t.setStructureLinkColumn(parentId);
        Column pos = new Column();
        pos.name = "\"POS\"";
        pos.type = "INTEGER";
        t.addColumn(pos);
        Column parentPath = new Column();
        parentPath.name = "\"PARENT_PATH\"";
        parentPath.type = "VARCHAR(100)";
        t.addColumn(parentPath);
        Column path = new Column();
        path.name = "\"PATH\"";
        path.type = "VARCHAR(100)";
        t.addColumn(path);
        Column value = new Column();
        value.name = "\"VALUE\"";
        value.type = factory.createSQLTypeMapper().getSQLType(element);
        value.setDataElement(element);
        t.addColumn(value);
        storeTable(t);
    }

    public List<Table> getTablesByStructureDefinition(StructureDefinition sd) {
        return new LinkedList<>(this.ddlStamementsByParent.get(sd));
    }

    public void setSQLProviderFactory(SQLProviderFactory factory) {
        this.factory = factory;
    }
}
