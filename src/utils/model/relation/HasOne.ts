import { DB } from "@/utils/database/DB";
import { Model } from "../Model";


export class HasOne<I, R> {

    model: typeof Model<R>;
    foreignKey: string;

    constructor(model: typeof Model<R>, foreignKey: string) {
        this.model = model;
        this.foreignKey = foreignKey;
    }

    async fetch(ids: any[]): Promise<object[]> {
        return await DB.table(this.model.getTableName()).whereIn(this.foreignKey, ids).get();
    }

    attachResults(results: Model<I>[], relatedData: object[], relationName: string) {
        results.forEach((result) => {
            result[relationName] = relatedData.find(item => item[this.foreignKey] === result[result.getPrimaryKey()]);
            result.attributes[relationName] = result[relationName];
        });
    }
}

