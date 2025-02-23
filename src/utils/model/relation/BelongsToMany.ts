import QueryBuilder from 'eloquent-query-builder';
import { createQueryBuilder, MYSQL as DB } from "@/utils/database/DB";
import { Model } from "../Model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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

    async attach(relatedIds: any, additionalAttributes: object = {}): Promise<number> {
        if (!Array.isArray(relatedIds)) {
            relatedIds = [relatedIds]; // Jika hanya satu ID, ubah ke array
        }

        if (relatedIds.length === 0) {
            return 0; // Tidak ada data untuk ditambahkan
        }

        const records = relatedIds.map((id: any) => ({
            [this.foreignKey]: this.parent[this.parent.getPrimaryKey()], // ID dari model utama
            [this.relatedKey]: id, // ID dari model terkait
            ...additionalAttributes // Atribut tambahan untuk tabel pivot
        }));

        const columns = Object.keys(records[0]); // Ambil kolom dari record pertama
        const placeholders = records.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
        const values = records.flatMap(record => Object.values(record)); // Menyusun array nilai

        const query = `INSERT INTO ${this.pivotTable} (${columns.join(", ")}) VALUES ${placeholders}`;

        await DB.execute(query, values);
        return records.length; // Mengembalikan jumlah record yang ditambahkan
    }

    async detach(relatedIds: any) {
        if (!relatedIds || (Array.isArray(relatedIds) && relatedIds.length === 0)) {
            throw new Error("Parameter relatedIds harus diisi dan tidak boleh berupa array kosong.");
        }

        if (!Array.isArray(relatedIds)) {
            relatedIds = [relatedIds]; // Jika hanya satu ID, ubah ke array
        }

        // Hapus relasi berdasarkan daftar `relatedIds`
        const placeholders = relatedIds.map(() => "?").join(", ");
        const query = `DELETE FROM ${this.pivotTable} WHERE ${this.foreignKey} = ? AND ${this.relatedKey} IN (${placeholders})`;
        const params = [this.parent[this.parent.getPrimaryKey()], ...relatedIds];

        const [result] = await DB.execute<ResultSetHeader>(query, params);
        return result?.affectedRows ?? 0; // Pastikan `affectedRows` ada
    }

    async fetch(ids: any[], callback?: (relation: QueryBuilder, pivot?: QueryBuilder) => void): Promise<GroupedData> {
        if (ids.length === 0) {
            return {};
        }
        const adittionalRelationQuery = createQueryBuilder();
        const adittionalPivotQuery = createQueryBuilder();

        callback && callback(adittionalRelationQuery, adittionalPivotQuery);

        // Ambil data dari tabel pivot hanya sekali
        const pivotQuery = `
        SELECT * FROM ${this.pivotTable}
        WHERE ${this.foreignKey} IN (${ids.map(() => "?").join(",")})
        ${adittionalPivotQuery.query ? `AND ${adittionalPivotQuery.query}` : ''}`;

        const [pivotResults] = await DB.execute<RowDataPacket[]>(pivotQuery, ids);

        // Ambil semua relatedKey dari hasil pivot
        const relatedIds = pivotResults.map(row => row[this.relatedKey]);

        let relatedResults: RowDataPacket[] = [];
        if (relatedIds.length > 0) {
            const relatedQuery = `
                SELECT * FROM ${this.model.getTableName()}
                WHERE ${this.model.getPrimaryKey()} IN (${relatedIds.map(() => "?").join(",")})
            ${callback ? `AND ${adittionalRelationQuery.query}` : ''}`;

            [relatedResults] = await DB.execute<RowDataPacket[]>(relatedQuery, relatedIds);
        }

        // Kelompokkan hasil berdasarkan foreignKey
        const groupedData: GroupedData = {};
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

    attachResults(results: Model<I>[], groupedData: GroupedData, relationName: string) {
        results.forEach(result => {
            const data = groupedData[result[result.getPrimaryKey()]];
            if (data) {
                result[relationName] = data.relatedData.map((item) => {
                    const pivot = data.pivotData.find((pivotItem) => pivotItem[this.relatedKey] === item[this.model.getPrimaryKey()]);
                    return { ...item, pivot };
                });
            } else {
                result[relationName] = [];
            }
            result.attributes[relationName] = result[relationName];
        });
    }
}

type PivotRecord = {
    [key: string]: any
}

type GroupedData = {
    [key: string]: {
        relatedData: any[],
        pivotData: PivotRecord[]
    }
}
