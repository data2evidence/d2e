import { AstElement } from "./AstElement";
import { QueryObject as qo } from "@alp/alp-base-utils";
import QueryObject = qo.QueryObject;

export class Literal extends AstElement {
    constructor(public node, public path, public name, public parent) {
        super(node, path, name, parent);
    }

    getSQLNoCase() {
        if (typeof this.node.value === "string") {
            return QueryObject.format("%s", this.node.value);
        } else if (typeof this.node.value === "number") {
            return QueryObject.format("%f", this.node.value);
        } else {
            return QueryObject.format("%s", this.node.value);
        }
    }

    getSQL() {
        //special case when drilling down on charts
        if (typeof this.node.value === "string") {
            if (
                typeof this.node.valueType === "string" &&
                this.node.valueType === "SQLFunction"
            ) {
                return QueryObject.format("%UNSAFE", this.node.value);
            } else {
                return QueryObject.format("UPPER(%s)", this.node.value);
            }
        } else if (typeof this.node.value === "number") {
            return QueryObject.format("%f", this.node.value);
        } else {
            return QueryObject.format("%s", this.node.value);
        }
    }
}
