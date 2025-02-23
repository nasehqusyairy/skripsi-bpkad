import QueryBuilder from 'eloquent-query-builder';
import { createQueryBuilder } from "@/utils/database/DB";
import { Model } from "../Model";

const DB = createQueryBuilder();

export class HasMany<I, R> {

    model: typeof Model<R>;
    foreignKey: string;

    constructor(model: typeof Model<R>, foreignKey: string) {
        this.model = model;
        this.foreignKey = foreignKey;

    }

    async fetch(ids: any[], callback?: (qry: QueryBuilder) => void): Promise<object[]> {
        if (ids.length === 0) {
            return [];
        }
        const query = DB.table(this.model.getTableName()).whereIn(this.foreignKey, ids);
        callback && callback(query);
        return await query.get();
    }

    attachResults(results: Model<I>[], relatedData: object[], relationName: string) {
        results.forEach((result) => {
            if (!result.getPrimaryKey) console.log(result);

            result[relationName] = relatedData.filter(item => item[this.foreignKey] === result[result.getPrimaryKey()]);
            result.attributes[relationName] = result[relationName];
        });
    }
}