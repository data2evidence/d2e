import { AstElement } from "./AstElement";
import { Def } from "./Def";
import { Statement } from "./Statement";
import { QueryObject as qo } from "@alp/alp-base-utils";
import QueryObject = qo.QueryObject;

export class Utils {
    public static hasMultiRequest(nql: AstElement): Boolean {
        return nql instanceof Statement &&
            (nql as Statement).getContextDep("PatientRequests")
            ? true
            : false;
    }

    public static getContextSQL(
        e: any,
        context: string,
        name?: string
    ): QueryObject {
        let contextList: QueryObject[] = [];
        let query: any = [];

        function traverse(x: any) {
            if (
                x instanceof Def &&
                x.node.name !== "PatientRequests" &&
                x.node.context === context &&
                (!name || (name && x.node.name === name))
            ) {
                contextList.push(x.getChildren()[0].getSQL());
            } else if (x instanceof Array) {
                x.forEach((y) => traverse(y));
            } else if (x instanceof AstElement) {
                x.getChildren().forEach((y) => traverse(y));
            } else {
                return;
            }
        }

        e.node.def.forEach((x) => traverse(x));

        if (contextList.length > 1) {
            contextList.forEach((queryObject) => {
                this.wrapBrackets(queryObject);
            });
            query = QueryObject.format(" UNION ").join(contextList);
        } else {
            query = contextList[0];
        }

        return query;
    }

    static wrapBrackets(qo: QueryObject) {
        qo.queryString = "(" + qo.queryString + ")";
        return qo;
    }
}
