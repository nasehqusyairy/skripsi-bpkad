import { DB } from "@/utils/database/DB";
import { Model } from "../Model";


export class BelongsTo<I, R> {

    model: typeof Model<R>;
    foreignKey: string;
    primaryKey: string;

    constructor(model: typeof Model<R>, foreignKey: string, primaryKey: string) {
        this.model = model;
        this.foreignKey = foreignKey;
        this.primaryKey = primaryKey;
    }

    async fetch(ids: any[]): Promise<object[]> {
        return await DB.table(this.model.getTableName()).whereIn(this.primaryKey, ids).get();
    }

    attachResults(results: Model<I>[], relatedData: object[], relationName: string) {
        results.forEach((result) => {
            result[relationName] = relatedData.find(item => item[this.primaryKey] === result[this.foreignKey]);
            result.attributes[relationName] = result[relationName];
        });
    }
}