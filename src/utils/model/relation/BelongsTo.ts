import QueryBuilder from 'eloquent-query-builder';
import { createQueryBuilder } from "@/utils/database/DB";
import { Model } from "../Model";

const DB = createQueryBuilder();

export class BelongsTo<I, R> {

    model: typeof Model<R>;
    foreignKey: string;
    primaryKey: string;


    constructor(model: typeof Model<R>, foreignKey: string, primaryKey: string) {
        this.model = model;
        this.foreignKey = foreignKey;
        this.primaryKey = primaryKey;
    }

    async fetch(ids: any[], callback?: (qry: QueryBuilder) => void): Promise<object[]> {
        const query = DB.table(this.model.getTableName()).whereIn(this.primaryKey, ids);
        callback && callback(query);
        return await query.get();
    }

    attachResults(results: Model<I>[], relatedData: object[], relationName: string) {
        results.forEach((result) => {
            result[relationName] = relatedData.find(item => item[this.primaryKey] === result[this.foreignKey]);
            result.attributes[relationName] = result[relationName];
        });
    }
}