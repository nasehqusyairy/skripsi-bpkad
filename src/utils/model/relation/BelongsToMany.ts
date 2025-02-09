import { MYSQL as DB } from "@/utils/database/DB";
import { Model } from "../Model";
import { RowDataPacket } from "mysql2";


export class BelongsToMany<I, R> {

    parent: Model<I>;
    model: typeof Model<R>;
    pivotTable: string;
    foreignKey: string;
    relatedKey: string;

    constructor(parent: Model<I>, model: typeof Model<R>, pivotTable: string, foreignKey: string, relatedKey: string) {
        this.parent = parent;
        this.model = model;
        this.pivotTable = pivotTable;
        this.foreignKey = foreignKey;
        this.relatedKey = relatedKey;
    }

    async attach(relatedIds: any[], additionalAttributes: object = {}) {
        if (!Array.isArray(relatedIds)) {
            relatedIds = [relatedIds]; // Jika hanya satu ID, ubah ke array
        }

        const records = relatedIds.map(id => {
            return {
                [this.foreignKey]: this.parent[this.parent.getPrimaryKey()], // ID dari model utama
                [this.relatedKey]: id, // ID dari model terkait
                ...additionalAttributes // Atribut tambahan untuk tabel pivot
            };
        });

        const values = records.map(record => Object.values(record)).flat();
        const placeholders = values.map(() => "?").join(", ");
        // console.log({ values, placeholders });

        const query = `INSERT INTO ${this.pivotTable} (${Object.keys(records[0]).join(", ")}) VALUES (${placeholders})`;

        await DB.execute(query, values);
        return records.length; // Mengembalikan jumlah record yang ditambahkan
    }

    async detach(relatedIds = []) {

        if (!Array.isArray(relatedIds)) {
            relatedIds = [relatedIds]; // Jika hanya satu ID, ubah ke array
        }

        let query = `DELETE FROM ${this.pivotTable} WHERE ${this.foreignKey} = ?`;
        const params = [this.parent[this.parent.getPrimaryKey()]]; // ID dari model utama

        if (relatedIds.length > 0) {
            const placeholders = relatedIds.map(() => "?").join(", ");
            query += ` AND ${this.relatedKey} IN (${placeholders})`;
            params.push(...relatedIds);
        }

        const { affectedRows } = (await DB.execute(query, params))[0] as RowDataPacket;
        return affectedRows; // Mengembalikan jumlah record yang dihapus
    }


    async fetch(ids: any[]): Promise<object> {
        // Ambil data dari tabel pivot hanya sekali
        const pivotQuery = `
        SELECT * FROM ${this.pivotTable}
        WHERE ${this.foreignKey} IN (${ids.map(() => "?").join(",")})
        `;

        const [pivotResults] = await DB.execute<RowDataPacket[]>(pivotQuery, ids);

        // Ambil semua relatedKey dari hasil pivot
        const relatedIds = pivotResults.map(row => row[this.relatedKey]);

        let relatedResults: RowDataPacket[] = [];
        if (relatedIds.length > 0) {
            const relatedQuery = `
                SELECT * FROM ${this.model.getTableName()}
                WHERE ${this.model.getPrimaryKey()} IN (${relatedIds.map(() => "?").join(",")})
            `;

            [relatedResults] = await DB.execute<RowDataPacket[]>(relatedQuery, relatedIds);
        }

        // Kelompokkan hasil berdasarkan foreignKey
        const groupedData = {};
        ids.forEach(id => groupedData[id] = { relatedData: [], pivotData: [] });

        pivotResults.forEach(pivotRow => {
            groupedData[pivotRow[this.foreignKey]].pivotData.push(pivotRow);
        });

        relatedResults.forEach(relatedRow => {
            pivotResults.forEach(pivotRow => {
                if (pivotRow[this.relatedKey] === relatedRow[this.model.getPrimaryKey()]) {
                    groupedData[pivotRow[this.foreignKey]].relatedData.push(relatedRow);
                }
            });
        });

        return groupedData;
    }

    attachResults(results: Model<I>[], groupedData: object, relationName: string) {
        results.forEach(result => {
            const data = groupedData[result[result.getPrimaryKey()]];
            if (data) {
                result[relationName] = data.relatedData.map(item => {
                    const pivot = data.pivotData.find(pivotItem => pivotItem[this.relatedKey] === item[this.model.getPrimaryKey()]);
                    return { ...item, pivot };
                });
            } else {
                result[relationName] = [];
            }
            result.attributes[relationName] = result[relationName];
        });
    }
}
