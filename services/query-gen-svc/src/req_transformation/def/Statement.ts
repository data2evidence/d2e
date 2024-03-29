import { ParserContainer } from "./ParserContainer";
import { Definition } from "./Definition";
import { Source } from "./Source";
import { BaseOperandExpressionRef, DataModelTypeExpression } from "./OperandFactory";
import { AggregateFactory } from "./AggregateFactory";
import { Node } from "./Node";
import { Query } from "./Query";
import { Union } from "./Union";
import { Expression } from "./Expression";
import * as Keys from "../keys";
import { FastUtil } from "../fast_util";

export class Statement extends Node {
    private __definition: Definition[] = [];

    constructor(private __parserContainers: ParserContainer[], private __action) {
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
                let qry = new Query(e, this.__action, Keys.CQLTERM_QUERY, new Source(undefined, undefined, e.alias,
                                            new DataModelTypeExpression(e.context, e.context.toLowerCase(), Keys.CQLTERM_RETRIEVE)));
                let def = new Definition(e.name, e.context, Keys.CQLTERM_PUBLIC, qry);
                this.addDefinition(def);
                names.push(e.name);
            }
            else if (e.context === Keys.CQLTERM_CONTEXT_POPULATION) {
                this.addDefinition(
                    new Definition(e.name,
                        Keys.CQLTERM_CONTEXT_POPULATION,
                        Keys.CQLTERM_PUBLIC,
                        AggregateFactory.createAggregate(Keys.CQLTERM_AGGREGATEEXPRESSION, e, union ? Keys.DEF_PATIENTREQUESTS
                                                                                                    : (Keys.DEF_PATIENTREQUEST + "0"), this.__action)));
            }
        });

        if (names.length > 1) {
            this.addDefinition(
                new Union(Keys.DEF_PATIENTREQUESTS, Keys.CQLTERM_CONTEXT_PATIENT, Keys.CQLTERM_PUBLIC,
                    new Expression(Keys.SQLTERM_SET_OP_UNION, this.__action, undefined,
                                    names.map((z) => new BaseOperandExpressionRef(z.toString(), Keys.CQLTERM_EXPRESSIONREF)))));
        }
    }

    print() {
        return { statement: { def: this.__definition.map((x) => x.print()) } };
    }
}
