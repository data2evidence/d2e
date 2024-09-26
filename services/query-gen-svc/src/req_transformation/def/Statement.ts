import { ParserContainer, BaseNode } from "./ParserContainer";
import { Definition } from "./Definition";
import { Source } from "./Source";
import {
    BaseOperandExpressionRef,
    DataModelTypeExpression,
} from "./OperandFactory";
import { AggregateFactory } from "./AggregateFactory";
import { Node } from "./Node";
import { Query } from "./Query";
import { Union } from "./Union";
import { Expression } from "./Expression";
import { Relationship } from "./Relationship";
import { Measure } from "./Measure";
import * as Keys from "../keys";
import { FastUtil } from "../fast_util";

export class Statement extends Node {
    private __definition: Definition[] = [];

    constructor(
        private __parserContainers: ParserContainer[],
        private __action
    ) {
        super();
        this.build();
    }

    addDefinition(def: Definition) {
        this.__definition.push(def);
    }

    private build() {
        let names: String[] = [];
        let union = FastUtil.isUnion(this.__parserContainers);

        this.__parserContainers.forEach((e) => {
            if (e.context === Keys.CQLTERM_CONTEXT_PATIENT) {
                let qry = new Query(
                    e,
                    this.__action,
                    Keys.CQLTERM_QUERY,
                    new Source(
                        undefined,
                        undefined,
                        e.alias,
                        new DataModelTypeExpression(
                            e.context,
                            e.context.toLowerCase(),
                            Keys.CQLTERM_RETRIEVE
                        )
                    )
                );
                //TODO: Check for config boolean
                qry.insertRelationship(
                    new Relationship(
                        "PatientRequestEntryExit",
                        Keys.CQLTERM_WITH,
                        // new DataModelTypeExpression("entryexit", "patient", Keys.CQLTERM_RETRIEVE),
                        new BaseOperandExpressionRef(
                            "PatientRequestEntryExit",
                            Keys.CQLTERM_EXPRESSIONREF
                        ),
                        [],
                        [],
                        false
                    )
                );

                let def = new Definition(
                    e.name,
                    e.context,
                    Keys.CQLTERM_PUBLIC,
                    qry
                );
                this.addDefinition(def);
                names.push(e.name);
            } else if (e.context === Keys.CQLTERM_CONTEXT_POPULATION) {
                this.addDefinition(
                    new Definition(
                        e.name,
                        Keys.CQLTERM_CONTEXT_POPULATION,
                        Keys.CQLTERM_PUBLIC,
                        AggregateFactory.createAggregate(
                            Keys.CQLTERM_AGGREGATEEXPRESSION,
                            e,
                            union
                                ? Keys.DEF_PATIENTREQUESTS
                                : Keys.DEF_PATIENTREQUEST + "0",
                            this.__action
                        )
                    )
                );
            }
        });

        this.createEntryExit();

        if (names.length > 1) {
            this.addDefinition(
                new Union(
                    Keys.DEF_PATIENTREQUESTS,
                    Keys.CQLTERM_CONTEXT_PATIENT,
                    Keys.CQLTERM_PUBLIC,
                    new Expression(
                        Keys.SQLTERM_SET_OP_UNION,
                        this.__action,
                        undefined,
                        names.map(
                            (z) =>
                                new BaseOperandExpressionRef(
                                    z.toString(),
                                    Keys.CQLTERM_EXPRESSIONREF
                                )
                        )
                    )
                )
            );
        }
    }

    private createEntryExit() {
        //TODO: Check for config boolean
        const entryExitEvent: ParserContainer = structuredClone(
            this.__parserContainers.find((e) => e.name === "PatientRequest0")
        );
        entryExitEvent.alias = "PEE";
        entryExitEvent.name = "PatientRequestEntryExit";
        entryExitEvent.groupBy[0].alias = "PEE";
        entryExitEvent.groupBy[1].alias = "PEE";
        entryExitEvent.groupBy.forEach((e) => {
            //TODO: Remove excess groupby and fix alias for interactions
            e.alias = "PEE";
        });
        entryExitEvent.measure = [
            new BaseNode(
                "entry",
                "patient.interactions.obsperiod.0.attributes.startdate"
            )
                .withIdentifier("patient.interactions.obsperiod.0")
                .withTemplateId("patient-interactions-obsperiod")
                .withDataType("obsperiod")
                .withAlias("obsperiod0")
                .withMeasure(true),
            new BaseNode(
                "exit",
                "patient.interactions.obsperiod.0.attributes.enddate"
                )
                .withIdentifier("patient.interactions.obsperiod.0")
                .withTemplateId("patient-interactions-obsperiod")
                .withDataType("obsperiod")
                .withAlias("obsperiod0")
                .withMeasure(true),
        ];
        entryExitEvent.filter = {} //TODO: Enable when FC marked as start/end from UI

        const entryExitQuery: Query = new Query(
            entryExitEvent,
            this.__action,
            Keys.CQLTERM_QUERY,
            new Source(
                undefined,
                undefined,
                entryExitEvent.alias,
                new DataModelTypeExpression(
                    entryExitEvent.context,
                    entryExitEvent.context.toLowerCase(),
                    Keys.CQLTERM_RETRIEVE
                )
            )
        )

        entryExitQuery.addRelationship(
            new Relationship("obsperiod0",
                Keys.CQLTERM_WITH,
                new DataModelTypeExpression("obsperiod", "patient-interactions-obsperiod", Keys.CQLTERM_RETRIEVE),
                []
            ))

        this.addDefinition(
            new Definition(
                "PatientRequestEntryExit",
                Keys.CQLTERM_CONTEXT_PATIENT,
                Keys.CQLTERM_PUBLIC,
                entryExitQuery
            )
        );
    }

    print() {
        return { statement: { def: this.__definition.map((x) => x.print()) } };
    }
}
