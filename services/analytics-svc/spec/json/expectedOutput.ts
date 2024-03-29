// tslint:disable:object-literal-key-quotes
/* tslint:disable: max-line-length */
export let result = { "statement": { "def": [{ "name": "Request0", "context": "patient", "accessLevel": "Public", "expression": { "type": "Query", "source": [{ "alias": "P0", "expression": { "type": "Retrieve", "dataType": "patient", "templateId": "patient" } }], "relationship": [{ "alias": "priDiag1", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": "C01", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }] } }, { "alias": "priDiag2", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "C06", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 1900, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] }] } }, { "alias": "chemo1", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo1", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] } }, { "alias": "chemo2", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "Docetaxel / Cisplatin", "type": "Literal" }] }] } }, { "alias": "chemo4", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "Vinorelbin / Cisplatin", "type": "Literal" }] } }, { "alias": "chemo5", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" } }, { "alias": "biobank1", "type": "With", "expression": { "dataType": "biobank", "templateId": "patient-conditions-acme-interactions-biobank", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "status", "scope": "biobank1", "type": "Property" }, { "valueType": "String", "value": "Freigegeben", "type": "Literal" }] } }, { "alias": "radio1", "type": "With", "expression": { "dataType": "radio", "templateId": "patient-conditions-acme-interactions-radio", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "radio_ops", "scope": "radio1", "type": "Property" }, { "valueType": "String", "value": "8-520", "type": "Literal" }] } }, { "alias": "vStatus1", "type": "With", "expression": { "dataType": "vStatus", "templateId": "patient-interactions-vStatus", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 1950, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] } }], "where": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "smoker", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "No", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "gender", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "M", "type": "Literal" }] }, { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "BRCA1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "EGFR", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "Her2neu", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "KRAS", "type": "Literal" }] }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "priDiag1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo4", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "censoringThreshold", "scope": "P0", "type": "Property" }, { "valueType": "String", "value": "123456", "type": "Literal" }] }] }, "groupBy": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }], "measure": [{ "path": "pcount", "scope": "P0", "type": "Property" }] } }, { "name": "Request1", "context": "patient", "accessLevel": "Public", "expression": { "type": "Query", "source": [{ "alias": "P1", "expression": { "type": "Retrieve", "dataType": "patient", "templateId": "patient" } }], "relationship": [{ "alias": "priDiag1", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": "C01", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }] } }, { "alias": "priDiag2", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "C06", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 1900, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] }] } }, { "alias": "chemo1", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo1", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] } }, { "alias": "chemo2", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "Docetaxel / Cisplatin", "type": "Literal" }] }] } }, { "alias": "chemo3", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo3", "type": "Property" }, { "valueType": "String", "value": "VAMP", "type": "Literal" }] } }, { "alias": "chemo4", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "Vinorelbin / Cisplatin", "type": "Literal" }] } }, { "alias": "chemo5", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" } }, { "alias": "biobank1", "type": "With", "expression": { "dataType": "biobank", "templateId": "patient-conditions-acme-interactions-biobank", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "status", "scope": "biobank1", "type": "Property" }, { "valueType": "String", "value": "Freigegeben", "type": "Literal" }] } }, { "alias": "vStatus1", "type": "With", "expression": { "dataType": "vStatus", "templateId": "patient-interactions-vStatus", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 1950, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] } }], "where": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "smoker", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "No", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "gender", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "M", "type": "Literal" }] }, { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "BRCA1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "EGFR", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "Her2neu", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "KRAS", "type": "Literal" }] }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "priDiag1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo3", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo3", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo3", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo4", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo3", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "censoringThreshold", "scope": "P1", "type": "Property" }, { "valueType": "String", "value": "123456", "type": "Literal" }] }] }, "groupBy": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }], "measure": [{ "path": "pcount", "scope": "P1", "type": "Property" }] } }, { "name": "Request2", "context": "patient", "accessLevel": "Public", "expression": { "type": "Query", "source": [{ "alias": "P2", "expression": { "type": "Retrieve", "dataType": "patient", "templateId": "patient" } }], "relationship": [{ "alias": "priDiag1", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": "C01", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }] } }, { "alias": "priDiag2", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "C06", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 1900, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] }] } }, { "alias": "priDiag3", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag3", "type": "Property" }, { "valueType": "String", "value": "C09", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "age", "scope": "priDiag3", "type": "Property" }, { "valueType": "String", "value": 1800, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "age", "scope": "priDiag3", "type": "Property" }, { "valueType": "String", "value": 1900, "type": "Literal" }] }] }] } }, { "alias": "chemo1", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo1", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] } }, { "alias": "chemo2", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "Docetaxel / Cisplatin", "type": "Literal" }] }] } }, { "alias": "chemo4", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "Vinorelbin / Cisplatin", "type": "Literal" }] } }, { "alias": "chemo5", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" } }, { "alias": "biobank1", "type": "With", "expression": { "dataType": "biobank", "templateId": "patient-conditions-acme-interactions-biobank", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "status", "scope": "biobank1", "type": "Property" }, { "valueType": "String", "value": "Freigegeben", "type": "Literal" }] } }, { "alias": "vStatus1", "type": "With", "expression": { "dataType": "vStatus", "templateId": "patient-interactions-vStatus", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 1950, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] } }], "where": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "smoker", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "No", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "gender", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "M", "type": "Literal" }] }, { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "BRCA1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "EGFR", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "Her2neu", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "KRAS", "type": "Literal" }] }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "priDiag1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "priDiag3", "type": "Property" }, { "valueType": "String", "value": "priDiag2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "priDiag3", "type": "Property" }, { "valueType": "String", "value": "priDiag1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo4", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "censoringThreshold", "scope": "P2", "type": "Property" }, { "valueType": "String", "value": "123456", "type": "Literal" }] }] }, "groupBy": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }], "measure": [{ "path": "pcount", "scope": "P2", "type": "Property" }] } }, { "name": "Request3", "context": "patient", "accessLevel": "Public", "expression": { "type": "Query", "source": [{ "alias": "P3", "expression": { "type": "Retrieve", "dataType": "patient", "templateId": "patient" } }], "relationship": [{ "alias": "priDiag1", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": "C01", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag1", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }] } }, { "alias": "priDiag2", "type": "With", "expression": { "dataType": "priDiag", "templateId": "patient-conditions-acme-interactions-priDiag", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "icd_10", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "C06", "type": "Literal" }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 1900, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "calYear", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] }] } }, { "alias": "chemo1", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo1", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] } }, { "alias": "chemo2", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "COPP", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "Docetaxel / Cisplatin", "type": "Literal" }] }] } }, { "alias": "chemo4", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "chemo_prot", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "Vinorelbin / Cisplatin", "type": "Literal" }] } }, { "alias": "chemo5", "type": "With", "expression": { "dataType": "chemo", "templateId": "patient-conditions-acme-interactions-chemo", "type": "Retrieve" } }, { "alias": "biobank1", "type": "With", "expression": { "dataType": "biobank", "templateId": "patient-conditions-acme-interactions-biobank", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "status", "scope": "biobank1", "type": "Property" }, { "valueType": "String", "value": "Freigegeben", "type": "Literal" }] } }, { "alias": "radio2", "type": "With", "expression": { "dataType": "radio", "templateId": "patient-conditions-acme-interactions-radio", "type": "Retrieve" }, "suchThat": { "type": "Equal", "operand": [{ "path": "radio_ops", "scope": "radio2", "type": "Property" }, { "valueType": "String", "value": "8-521", "type": "Literal" }] } }, { "alias": "vStatus1", "type": "With", "expression": { "dataType": "vStatus", "templateId": "patient-interactions-vStatus", "type": "Retrieve" }, "suchThat": { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 1950, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "year", "scope": "vStatus1", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }] } }], "where": { "type": "And", "operand": [{ "type": "Equal", "operand": [{ "path": "smoker", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "No", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "gender", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "M", "type": "Literal" }] }, { "type": "Or", "operand": [{ "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "BRCA1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "EGFR", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "Her2neu", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "biomarker", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "KRAS", "type": "Literal" }] }] }, { "type": "And", "operand": [{ "type": "GreaterOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": 2000, "type": "Literal" }] }, { "type": "LessOrEqual", "operand": [{ "path": "smokingOnset", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": 2016, "type": "Literal" }] }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "priDiag2", "type": "Property" }, { "valueType": "String", "value": "priDiag1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo2", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo4", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo4", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo2", "type": "Literal" }] }, { "type": "NotEqual", "operand": [{ "path": "INTERACTION_ID", "scope": "chemo5", "type": "Property" }, { "valueType": "String", "value": "chemo1", "type": "Literal" }] }, { "type": "Equal", "operand": [{ "path": "censoringThreshold", "scope": "P3", "type": "Property" }, { "valueType": "String", "value": "123456", "type": "Literal" }] }] }, "groupBy": [{ "path": "icd_10", "scope": "priDiag1", "type": "Property" }], "measure": [{ "path": "pcount", "scope": "P3", "type": "Property" }] } }] } };
