import QueryBuilder from 'eloquent-query-builder';
import { createQueryBuilder } from "@/utils/database/DB";
import { Model } from "../Model";

const DB = createQueryBuilder();

export class HasOne<I, R> {

    model: typeof Model<R>;
    foreignKey: string;

    constructor(model: typeof Model<R>, foreignKey: string) {
        this.model = model;
        this.foreignKey = foreignKey;
    }

    async fetch(ids: any[], callback?: (qry: QueryBuilder) => QueryBuilder): Promise<object[]> {
        const query = DB.table(this.model.getTableName()).whereIn(this.foreignKey, ids);
        callback && callback(query);
        return await query.get();
    }

    attachResults(results: Model<I>[], relatedData: object[], relationName: string) {
        results.forEach((result) => {
            result[relationName] = relatedData.find(item => item[this.foreignKey] === result[result.getPrimaryKey()]);
            result.attributes[relationName] = result[relationName];
        });
    }
}

