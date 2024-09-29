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
        
        const entryExitExist = this.isEntryExitExists(contextList);
        if (entryExitExist) {
            const formMultipleEntryExit = (localContextList: QueryObject[]) => {
                let count = 0;
                const name = "PatientRequest";
                const parsSet = new Set<string>();
                localContextList.forEach((queryObject) => {
                    if (queryObject.queryString.indexOf("PEE") > -1) {
                        query = `WITH PatientRequestEntryExit AS ${
                            this.wrapBrackets(queryObject).queryString
                        } `;
                    } else {
                        query += `, ${name}${count} AS ( ${queryObject.queryString} ) `;
                        count++;
                    }
                    queryObject.parameterPlaceholders.forEach((p) =>
                        parsSet.add(p)
                    );
                });
                let unionQuery = "";
                for (let i = 0; i < count; i++) {
                    if (i === 0) {
                        unionQuery = `SELECT * FROM ${name}${i}`;
                    } else {
                        unionQuery += ` UNION SELECT * FROM ${name}${i}`;
                    }
                }
                query = new QueryObject(`${query} ${unionQuery}`, [...Array.from(parsSet)], true);
                return query;
            };

            query = formMultipleEntryExit(contextList);
        } else {
            if (contextList.length > 1) {
                contextList.forEach((queryObject) => {
                    this.wrapBrackets(queryObject);
                });
                query = QueryObject.format(" UNION ").join(contextList);
            } else {
                query = contextList[0];
            }
        }

        return query;
    }

    static wrapBrackets(qo: QueryObject) {
        qo.queryString = "(" + qo.queryString + ")";
        return qo;
    }

    static isEntryExitExists(contextList: QueryObject[]) {
        return contextList.some((queryObject) => {
            return queryObject.queryString.indexOf("PEE") > -1;
        });
    }
}
