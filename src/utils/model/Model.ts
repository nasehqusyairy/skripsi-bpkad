import QueryBuilder from 'eloquent-query-builder';
import { createQueryBuilder, MYSQL } from "@/utils/database/DB";
import { pluralize, singularize } from 'sequelize/lib/utils';
import { Paginator } from './Paginator';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { HasOne } from './relation/HasOne';
import { HasMany } from './relation/HasMany';
import { BelongsTo } from './relation/BelongsTo';
import { BelongsToMany } from './relation/BelongsToMany';

export type QueryOperator = "=" | "<" | ">" | "<=" | ">=" | "<>" | "!=" | "LIKE" | "NOT LIKE" | "IN" | "NOT IN" | "BETWEEN" | "NOT BETWEEN" | "IS NULL" | "IS NOT NULL" | "IS" | "IS NOT";

export class Model<I> {

    protected tableName: string = "";

    protected prefix: string = "";

    protected primaryKey: string = "id";

    protected hidden: string[] = [];

    protected guarded: string[] = [];

    public attributes: Partial<I> = {};

    protected DB: QueryBuilder;

    private relationConfigs = [];

    private includePointer: any;

    constructor() {
        this.DB = createQueryBuilder();
    }

    // #region Static Helpers
    async first(): Promise<this & I | null> {
        this.DB.tbl = this.getTableName();
        // Ambil data pertama dari database
        const data = await this.DB.first();

        // Jika data ditemukan
        if (data && data[0]) {
            // Ubah result menjadi instance model
            this.assign(data[0]);

            // Lakukan eager loading
            await this.eagerLoadRelations([this]);

            // Kembalikan instance model
            return this as this & I;
        }

        // Jika data tidak ditemukan, kembalikan null
        return null;
    }

    static async first<T extends Model<unknown>>(this: new () => T): Promise<T | null> {
        const model = new this();
        return await model.first();
    }

    static getTableName() {
        const model = new this();
        return model.getTableName();
    }

    static async find<T extends Model<unknown>>(this: new () => T, id: number | string) {
        const model = new this();
        model.DB.where(model.primaryKey, id);
        return await model.first();
    }

    static getPrimaryKey() {
        const model = new this();
        return model.primaryKey;
    }

    static async all<T extends Model<unknown>>(this: new () => T): Promise<T[]> {
        const model = new this();
        const results = await model.DB.get();
        return results.map(result => model.assign(result));
    }

    static assign<T extends Model<I>, I extends object>(this: new () => T, attributes: Partial<I>): T & I {
        const modelInstance = new this();

        modelInstance.attributes = attributes;
        Object.assign(modelInstance, attributes);

        return modelInstance as T & I;
    }
    // #endregion


    // #region Helpers
    private assign(attributes: Partial<I>): this & I {
        this.attributes = attributes;
        Object.assign(this, attributes);
        return this as this & I;
    }

    getTableName() {
        return this.prefix + (this.tableName && this.tableName.trim() !== ""
            ? this.tableName
            : pluralize(this.constructor.name.toLowerCase())); // Pluralisasi otomatis berdasarkan nama class
    }

    getPrimaryKey() {
        return this.primaryKey;
    }

    toJSON() {
        const result = { ...this.attributes };
        this.hidden.forEach(key => delete result[key]);
        return result;
    }
    // #endregion


    // #region Select
    static select<T extends Model<unknown>>(this: new () => T, ...columns: (string)[]): T {
        const model = new this();
        model.DB.select(...columns);
        return model;
    }

    select<K extends keyof I>(...columns: K[]): this {
        this.DB.select(...columns);
        return this;
    }

    static distinct<T extends Model<unknown>>(this: new () => T, ...columns: (string)[]): T {
        const model = new this();
        model.DB.distinct(...columns);
        return model;
    }

    distinct<K extends keyof I>(...columns: K[]): this {
        this.DB.distinct(...columns);
        return this;
    }

    // #endregion

    // #region Order and Limit
    static groupBy<T extends Model<unknown>>(this: new () => T, ...columns: (string)[]): T {
        const model = new this();
        model.DB.whereNot(columns[0], "''");
        model.DB.groupBy(...columns);
        return model;
    }

    groupBy<K extends keyof I>(...columns: K[]): this {
        this.DB.whereNot(columns[0], "''");
        this.DB.groupBy(...columns);

        return this;
    }

    group(): this {
        const selectedColumns = this.DB.queryInital.split(',')
        this.groupBy(...selectedColumns)
        return this;
    }

    static orderBy<T extends Model<unknown>>(this: new () => T, column: string, direction: "ASC" | "DESC" = "ASC"): T {
        const model = new this();
        model.DB.orderBy(column, direction);
        return model;
    }

    orderBy<K extends keyof I>(column: K, direction: "ASC" | "DESC" = "ASC"): this {
        this.DB.orderBy(column, direction);
        return this;
    }

    having<K extends keyof I>(column: K, operator: QueryOperator, value: any): this {
        this.DB.having(column, operator, value);
        return this;
    }

    static limit<T extends Model<unknown>>(this: new () => T, value: number): T {
        const model = new this();
        model.DB.limit(value);
        return model;
    }

    limit(value: number): this {
        this.DB.limit(value);
        return this;
    }

    static offset<T extends Model<unknown>>(this: new () => T, value: number): T {
        const model = new this();
        model.DB.offset(value);
        return model;
    }

    offset(value: number): this {
        this.DB.offset(value);
        return this;
    }

    // #endregion

    // #region Aggregates


    count() {
        this.DB.count();
        return this;
    }

    countDistinct<K extends keyof I>(column: K): this {
        this.DB.countDistinct(column);
        return this;
    }

    sum<K extends keyof I>(...column: K[]): this {
        this.DB.sum(...column);
        return this;
    }

    avg<K extends keyof I>(...column: K[]): this {
        this.DB.avg(...column);
        return this;
    }

    min<K extends keyof I>(...column: K[]): this {
        this.DB.min(...column);
        return this;
    }

    max<K extends keyof I>(...column: K[]): this {
        this.DB.max(...column);
        return this;
    }

    // #endregion

    // #region Where Static

    static where<T extends Model<unknown>>(this: new () => T, column: string, operator: QueryOperator, value: any): T
    static where<T extends Model<unknown>>(this: new () => T, column: string, value: any): T
    static where<T extends Model<unknown>>(this: new () => T, args: object): T

    static where<T extends Model<unknown>>(this: new () => T, ...args: [string, QueryOperator, any] | [string, any] | [object]): T {
        const model = new this()

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            const [object] = args;
            if (typeof object !== "object") {
                throw new Error("Invalid argument. Argument must be an object if there is only one argument.");
            }

            for (const key in object) {
                model.DB.where(key, object[key]);
            }
        } else if (args.length === 2) {
            model.DB.where(args[0], "=", args[1]);
        }
        else {
            model.DB.where(args[0], args[1] as QueryOperator, args[2]);
        }

        return model
    }

    static whereNot<T extends Model<unknown>>(this: new () => T, column: string, operator: QueryOperator, value: any): T
    static whereNot<T extends Model<unknown>>(this: new () => T, column: string, value: any): T
    static whereNot<T extends Model<unknown>>(this: new () => T, args: object): T

    static whereNot<T extends Model<unknown>>(this: new () => T, ...args: [string, QueryOperator, any] | [string, any] | [object]): T {
        const model = new this();

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            const [object] = args;
            if (typeof object !== "object") {
                throw new Error("Invalid argument. Argument must be an object if there is only one argument.");
            }

            for (const key in object) {
                model.DB.whereNot(key, object[key]);
            }
        } else if (args.length === 2) {
            model.DB.whereNot(args[0], "=", args[1]);
        }
        else {
            model.DB.whereNot(args[0], args[1] as QueryOperator, args[2]);
        }

        return model
    }

    static whereNull<T extends Model<unknown>>(this: new () => T, column: string) {
        const model = new this();
        model.DB.whereNull(column);
        return model
    }

    static whereNotNull<T extends Model<unknown>>(this: new () => T, column: string) {
        const model = new this();
        model.DB.whereNotNull(column);
        return model
    }

    static whereExists<T extends Model<unknown>>(this: new () => T, callback: (query: QueryBuilder) => void) {
        const model = new this();
        model.DB.whereExists(callback);
        return model
    }

    static whereNotExists<T extends Model<unknown>>(this: new () => T, callback: (query: QueryBuilder) => void) {
        const model = new this();
        model.DB.whereNotExists(callback);
        return model
    }

    static whereBetween<T extends Model<unknown>>(this: new () => T, column: string, values: [any, any]) {
        const model = new this();
        model.DB.whereBetween(column, values);
        return model
    }

    static whereNotBetween<T extends Model<unknown>>(this: new () => T, column: string, values: [any, any]) {
        const model = new this();
        model.DB.whereNotBetween(column, values);
        return model
    }

    static whereIn<T extends Model<unknown>>(this: new () => T, column: string, values: any[]) {
        const model = new this();
        model.DB.whereIn(column, values);
        return model
    }

    static whereNotIn<T extends Model<unknown>>(
        this: new () => T,
        conditions: { [P in string]?: any[] }
    ) {
        const model = new this();
        for (const column in conditions) {
            if (conditions[column] !== undefined) {
                model.DB.whereNotIn(column, conditions[column]!);
            }
        }
        return model;
    }


    static whereLike<T extends Model<unknown>>(this: new () => T, column: string, value: any): T;
    static whereLike<T extends Model<unknown>>(this: new () => T, args: object): T;

    static whereLike<T extends Model<unknown>>(this: new () => T, ...args: [string, any] | [object]) {
        const model = new this();

        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            for (const key in args[0]) {
                if (args[0].hasOwnProperty(key)) {
                    if (!(args[0][key] as string).replace('%%', '')) continue;
                    model.DB.where(key, "LIKE", args[0][key]);
                }
            }
        } else {
            if (!(args[1] as string).replace('%%', '')) return model;
            model.DB.where(args[0], "LIKE", args[1]);
        }

        return model;
    }

    static whereNotLike<T extends Model<unknown>>(this: new () => T, column: string, value: any): T;
    static whereNotLike<T extends Model<unknown>>(this: new () => T, args: object): T;

    static whereNotLike<T extends Model<unknown>>(this: new () => T, ...args: [string, any] | [object]) {
        const model = new this();

        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            for (const key in args[0]) {
                if (args[0].hasOwnProperty(key)) {
                    if (!(args[0][key] as string).replace('%%', '')) continue;
                    model.DB.where(key, "NOT LIKE", args[0][key]);
                }
            }
        } else {
            if (!(args[1] as string).replace('%%', '')) return model
            model.DB.where(args[0], "NOT LIKE", args[1]);
        }

        return model;
    }

    static whereColumnsLike<T extends Model<unknown>>(this: new () => T, columns: (string)[], value: any): T {
        const model = new this();

        if (!value.replace('%%', '')) return model;

        let query = ''

        columns.forEach((column, i) => {
            if (i === 0) {
                query += ` ( ${column as string} LIKE '${value}'`
            } else {
                query += ` OR ${column as string} LIKE '${value}'`
            }
        });

        model.DB.query += query + ' ) '

        return model;
    }

    // #endregion

    // #region Where Instance

    where(column: keyof I, operator: QueryOperator, value: any): this
    where(column: keyof I, value: any): this
    where(args: Partial<I>): this

    where(...args: [keyof I, QueryOperator, any] | [keyof I, any] | [Partial<I>]) {

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            // Handle kondisi key-value
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    this.DB.where(key, condition[key]);
                }
            }
        } else if (args.length === 2) {
            // Handle kondisi key-operator-value
            this.DB.where(args[0], "=", args[1]);
        }
        else {
            // Handle kondisi key-operator-value
            this.DB.where(args[0], args[1] as QueryOperator, args[2]);
        }

        return this;
    }

    orWhere(column: keyof I, operator: QueryOperator, value: any): this
    orWhere(column: keyof I, value: any): this
    orWhere(args: Partial<I>): this

    orWhere(...args: [keyof I, QueryOperator, any] | [keyof I, any] | [Partial<I>]) {

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            // Handle kondisi key-value
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    this.DB.orWhere(key, condition[key]);
                }
            }
        } else if (args.length === 2) {
            // Handle kondisi key-operator-value
            this.DB.orWhere(args[0], "=", args[1]);
        }
        else {
            // Handle kondisi key-operator-value
            this.DB.orWhere(args[0], args[1] as QueryOperator, args[2]);
        }

        return this;
    }

    orWhereNot(column: keyof I, operator: QueryOperator, value: any): this
    orWhereNot(column: keyof I, value: any): this
    orWhereNot(args: Partial<I>): this

    orWhereNot(...args: [keyof I, QueryOperator, any] | [keyof I, any] | [Partial<I>]) {

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            // Handle kondisi key-value
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    this.DB.orWhereNot(key, condition[key]);
                }
            }
        } else if (args.length === 2) {
            // Handle kondisi key-operator-value
            this.DB.orWhereNot(args[0], "=", args[1]);
        }
        else {
            // Handle kondisi key-operator-value
            this.DB.orWhereNot(args[0], args[1] as QueryOperator, args[2]);
        }

        return this;
    }

    orWhereNull<K extends keyof I>(column: K) {
        this.DB.orWhereNull(column);
        return this;
    }

    orWhereNotNull<K extends keyof I>(column: K) {
        this.DB.orWhereNotNull(column);
        return this;
    }

    whereNot(column: keyof I, operator: QueryOperator, value: any): this
    whereNot(column: keyof I, value: any): this
    whereNot(args: Partial<I>): this

    whereNot(...args: [keyof I, QueryOperator, any] | [keyof I, any] | [Partial<I>]) {

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            // Handle kondisi key-value
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    this.DB.whereNot(key, condition[key]);
                }
            }
        } else if (args.length === 2) {
            // Handle kondisi key-operator-value
            this.DB.whereNot(args[0], "=", args[1]);
        }
        else {
            // Handle kondisi key-operator-value
            this.DB.whereNot(args[0], args[1] as QueryOperator, args[2]);
        }

        return this;
    }

    whereNull<K extends keyof I>(column: K) {
        this.DB.whereNull(column);
        return this;
    }

    whereNotNull<K extends keyof I>(column: K) {
        this.DB.whereNotNull(column);
        return this;
    }

    whereExists(callback: (query: QueryBuilder) => void) {
        this.DB.whereExists(callback);
        return this;
    }

    whereNotExists(callback: (query: QueryBuilder) => void) {
        this.DB.whereNotExists(callback);
        return this;
    }

    whereBetween<K extends keyof I>(column: K, values: [any, any]) {
        this.DB.whereBetween(column, values);
        return this;
    }

    whereNotBetween<K extends keyof I>(column: K, values: [any, any]) {
        this.DB.whereNotBetween(column, values);
        return this;
    }

    orWhereBetween<K extends keyof I>(column: K, values: [any, any]) {
        const [start, end] = values;
        this.DB.orWhere(column, "BETWEEN", start, "AND", end);
        return this;
    }

    orWhereNotBetween<K extends keyof I>(column: K, values: [any, any]) {
        const [start, end] = values;
        this.DB.orWhere(column, "NOT BETWEEN", start, "AND", end);
        return this;
    }

    whereIn(conditions: { [P in keyof I]?: any[] }): this {
        // Periksa apakah this.DB.query sudah memiliki klausa WHERE
        let hasWhereClause = /\bwhere\b/i.test(this.DB.getRaw());

        for (const column in conditions) {
            if (conditions[column] !== undefined) {
                // Jika sudah ada WHERE, tambahkan AND, jika belum tambahkan WHERE
                this.DB.query += hasWhereClause ? " AND " : "";
                this.DB.whereIn(column, conditions[column]!);

                // Setelah pertama kali menambahkan WHERE, kita set agar selalu menambahkan AND berikutnya
                hasWhereClause = true;
            }
        }
        return this;
    }

    whereNotIn(conditions: { [P in keyof I]?: any[] }): this {
        // Periksa apakah this.DB.query sudah memiliki klausa WHERE
        let hasWhereClause = /\bwhere\b/i.test(this.DB.getRaw());

        for (const column in conditions) {
            if (conditions[column] !== undefined) {
                // Jika sudah ada WHERE, tambahkan AND, jika belum tambahkan WHERE
                this.DB.query += hasWhereClause ? " AND " : "";
                this.DB.whereNotIn(column, conditions[column]!);

                // Setelah pertama kali menambahkan WHERE, kita set agar selalu menambahkan AND berikutnya
                hasWhereClause = true;
            }
        }
        return this;
    }

    whereLike<K extends keyof I>(column: K, value: any): this;
    whereLike(args: Partial<I>): this;

    whereLike(...args: [keyof I, any] | [Partial<I>]) {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            // Jika argumen adalah objek key-value
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    if (!(condition[key] as string)?.replace('%%', '')) continue;
                    this.DB.where(key, "LIKE", condition[key]);
                }
            }
        } else {
            if (!(args[1] as string).replace('%%', '')) return this;
            // Jika hanya key dan value, gunakan "LIKE"
            this.DB.where(args[0], "LIKE", args[1]);
        }

        return this;
    }

    orWhereLike<K extends keyof I>(column: K, value: any): this;
    orWhereLike(args: Partial<I>): this;

    orWhereLike(...args: [keyof I, any] | [Partial<I>]) {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    if (!(condition[key] as string)?.replace('%%', '')) continue;
                    this.DB.orWhere(key, "LIKE", condition[key]);
                }
            }
        } else {
            if (!(args[1] as string).replace('%%', '')) return this
            this.DB.orWhere(args[0], "LIKE", args[1]);
        }

        return this;
    }

    whereNotLike<K extends keyof I>(column: K, value: any): this;
    whereNotLike(args: Partial<I>): this;

    whereNotLike(...args: [keyof I, any] | [Partial<I>]) {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    if (!(condition[key] as string)?.replace('%%', '')) continue;
                    this.DB.where(key, "NOT LIKE", condition[key]);
                }
            }
        } else {
            if (!(args[1] as string).replace('%%', '')) return this
            this.DB.where(args[0], "NOT LIKE", args[1]);
        }

        return this;
    }


    orWhereNotLike<K extends keyof I>(column: K, value: any): this;
    orWhereNotLike(args: Partial<I>): this;

    orWhereNotLike(...args: [keyof I, any] | [Partial<I>]) {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
            const condition = args[0] as Partial<I>;
            for (const key in condition) {
                if (condition.hasOwnProperty(key)) {
                    if (!(condition[key] as string)?.replace('%%', '')) continue;
                    this.DB.orWhere(key, "NOT LIKE", condition[key]);
                }
            }
        } else {
            if (!(args[1] as string).replace('%%', '')) return this
            this.DB.orWhere(args[0], "NOT LIKE", args[1]);
        }

        return this;
    }

    whereColumnsLike(columns: (keyof I)[], value: any): this {
        if (!value.replace('%%', '')) return this;

        let query = ''

        columns.forEach((column, i) => {
            if (i === 0) {
                query += ` AND ( ${column as string} LIKE '${value}'`
            } else {
                query += ` OR ${column as string} LIKE '${value}'`
            }
        });

        this.DB.query += query + ' ) '

        return this;
    }

    // #endregion

    //#region Create & Update
    async save(): Promise<this & I> {
        if (this[this.getPrimaryKey()]) {
            // Jika primary key ada, lakukan update

            const primaryKey = this.getPrimaryKey() as keyof I;

            await this.where(primaryKey, (this as this & I)[primaryKey]).update(this.attributes);
        } else {
            // Jika primary key tidak ada, lakukan insert
            await this.create(this.attributes);
        }
        return this as this & I;
    }

    async update(data: Partial<I>): Promise<number> {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const whereClause = this.DB.getRaw().replace("SELECT *", "").replace("from " + this.getTableName(), "").trim();
        const query = `UPDATE ${this.getTableName()} SET ${setClause} ${whereClause}`;

        const [{ affectedRows }] = await MYSQL.execute<ResultSetHeader>(query, values);

        this.assign(data);

        return affectedRows;
    }


    private async create(data: Partial<I>) {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => "?").join(", ");
        const values = Object.values(data);

        const query = `INSERT INTO ${this.getTableName()} (${columns.join(", ")}) VALUES (${placeholders})`;

        const [{ insertId }] = await MYSQL.execute<ResultSetHeader>(query, values);

        this.assign({
            ...data,
            [this.getPrimaryKey()]: insertId
        });

        return insertId;
    }

    static async create<T extends Model<I>, I extends object>(this: new () => T, data: Partial<I>) {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => "?").join(", ");
        const values = Object.values(data);

        const modelInstance = new this()

        const query = `INSERT INTO ${modelInstance.getTableName()} (${columns.join(", ")}) VALUES (${placeholders})`;

        const [result] = await MYSQL.execute<ResultSetHeader>(query, values);

        const insertId = result.insertId;

        return modelInstance.assign({
            ...data,
            [modelInstance.getPrimaryKey()]: insertId
        });
    }

    static async insert<T extends Model<I>, I extends object>(this: new () => T, dataArray: Partial<I>[]) {
        if (dataArray.length === 0) return 0;

        const CHUNK_SIZE = 100;
        const modelInstance = new this();
        const tableName = modelInstance.getTableName();
        const columns = Object.keys(dataArray[0]);

        let totalAffectedRows = 0;

        // Split data into chunks
        const chunks = Array.from({ length: Math.ceil(dataArray.length / CHUNK_SIZE) }, (_, i) =>
            dataArray.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
        );

        for (const chunk of chunks) {
            const placeholders = chunk.map(() => `(${columns.map(() => "?").join(", ")})`).join(", ");
            const values = chunk.flatMap(Object.values);

            const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES ${placeholders}`;
            const [{ affectedRows }] = await MYSQL.execute<ResultSetHeader>(query, values);
            totalAffectedRows += affectedRows;
        }

        return totalAffectedRows;
    }
    //#endregion

    // #region Delete

    async delete() {

        const id = this[this.primaryKey]
        let whereClause = this.DB.getRaw().replace("SELECT *", "").replace("from " + this.getTableName(), "").trim();

        if (id) {
            whereClause = `WHERE ${this.primaryKey} = ${id}`;
        } else if (!whereClause) {
            throw new Error("DELETE operation requires a WHERE clause to prevent full table deletion.");
        }

        const query = `DELETE FROM ${this.getTableName()} ${whereClause}`;
        const [{ affectedRows }] = await MYSQL.execute<ResultSetHeader>(query);

        return affectedRows;
    }

    static async delete<T extends Model<I>, I extends object>(this: new () => T, id: number | string) {
        const model = new this();
        return await model.where(model.primaryKey as keyof I, id).delete();
    }
    // #endregion

    // #region Relationship
    hasOne<R>(model: typeof Model<R>, foreignKey?: string): HasOne<I, R> {
        if (!foreignKey) {
            foreignKey = `${singularize(this.getTableName().toLowerCase())}_${this.primaryKey}`;
        }

        return new HasOne(model, foreignKey);
    }

    hasMany<R>(model: typeof Model<R>, foreignKey?: string): HasMany<I, R> {
        if (!foreignKey) {
            foreignKey = `${singularize(this.getTableName().toLowerCase())}_${this.primaryKey}`;
        }

        return new HasMany(model, foreignKey);
    }

    belongsTo<R>(model: typeof Model<R>, foreignKey?: string, primaryKey?: string): BelongsTo<I, R> {
        if (!foreignKey) {
            foreignKey = `${singularize(model.getTableName().toLowerCase())}_${model.getPrimaryKey()}`;
        }

        if (!primaryKey) {
            primaryKey = model.getPrimaryKey();
        }

        return new BelongsTo(model, foreignKey, primaryKey);
    }

    belongsToMany<R>(model: typeof Model<R>, pivotTable: string, foreignKey?: string, relatedKey?: string): BelongsToMany<I, R> {
        if (!foreignKey) {
            foreignKey = `${singularize(this.getTableName().toLowerCase())}_${this.primaryKey}`;
        }

        if (!relatedKey) {
            relatedKey = `${singularize(model.getTableName().toLowerCase())}_${model.getPrimaryKey()}`;
        }

        return new BelongsToMany(this, model, pivotTable, foreignKey, relatedKey);
    }
    // #endregion

    // #region With
    with<T extends keyof this>(...relations: T[]): this {
        const newRelations = this.parseRelations(relations as string[]);

        relations.forEach(relation => {
            const existingRelation = this.relationConfigs.find(r => r.name === relation);
            if (!existingRelation) {
                this.relationConfigs.push(newRelations.find(r => r.name === relation));
            } else {
                this.relationConfigs[this.relationConfigs.indexOf(existingRelation)] = newRelations.find(r => r.name === relation);
            }
        });

        return this;
    }

    static with<T extends Model<unknown>>(this: new () => T, ...relations: (keyof T)[]) {
        const modelInstance = new this();
        modelInstance.relationConfigs = modelInstance.parseRelations(relations as string[]);
        return modelInstance;
    }

    include(relation: string, callback?: (relation: QueryBuilder, pivot?: QueryBuilder) => void) {
        const newRelation = this.parseRelations([relation])[0];
        const existingRelation = this.relationConfigs.find(r => r.name === newRelation.name);
        if (!existingRelation) {
            this.relationConfigs.push({ name: relation, nested: [], callback });
        } else {
            this.relationConfigs[this.relationConfigs.indexOf(existingRelation)] = newRelation
        }

        this.includePointer = this.relationConfigs.find(r => r.name === newRelation.name);
        // console.log(this.relationConfigs[1]?.nested);
        return this;
    }

    static include(relation: string, callback?: (realtion: QueryBuilder, pivot?: QueryBuilder) => void) {
        const modelInstance = new this();

        const newRelation = modelInstance.parseRelations([relation])[0];
        const existingRelation = modelInstance.relationConfigs.find(r => r.name === newRelation.name);
        if (!existingRelation) {
            modelInstance.relationConfigs.push({ name: relation, nested: [], callback });
        } else {
            modelInstance.relationConfigs[modelInstance.relationConfigs.indexOf(existingRelation)] = newRelation
        }

        modelInstance.includePointer = modelInstance.relationConfigs.find(r => r.name === newRelation.name);
        return modelInstance;
    }

    thenInclude(relation: string, callback?: (query: any) => void) {
        if (this.relationConfigs.length === 0) {
            throw new Error("thenInclude() must be called after include()");
        }

        let lastRelation = this.includePointer || this.relationConfigs[this.relationConfigs.length - 1];

        const newRelation = { name: relation, nested: [], callback }

        lastRelation.nested.push(newRelation);

        this.includePointer = newRelation;
        return this;
    }

    private parseRelations(relations: string[]) {
        const parsedRelations = [];
        for (const relation of relations) {
            const parts = relation.split(".");
            let current = parsedRelations;

            for (const part of parts) {
                let existing = current.find(r => r.name === part);
                if (!existing) {
                    existing = { name: part, nested: [] };
                    current.push(existing);
                }
                current = existing.nested;
            }
        }
        return parsedRelations;
    }

    private async eagerLoadRelations(results: this[], relations: any[] = this.relationConfigs, parentModel: any = this) {
        for (const { name, nested, callback } of relations) {
            const relationInstance = parentModel[name]();

            const key = relationInstance.constructor.name == "BelongsTo" ? relationInstance.foreignKey : parentModel.primaryKey;
            const ids = [...new Set((results as unknown as Partial<I>[]).map((result: Partial<I>) => result[key]))];

            let relatedData = await relationInstance.fetch(ids, callback);
            relationInstance.attachResults(results, relatedData, name);

            if (nested.length > 0) {
                relatedData = relatedData.map((item: any) => new relationInstance.model(item))
                await this.eagerLoadRelations(relatedData, nested, new relationInstance.model());
            }
        }
    }
    // #endregion

    // #region Get
    async get(): Promise<(this & I)[]> {
        this.DB.tbl = this.getTableName();
        let results = await this.DB.get();

        const ModelConstructor = this.constructor as { new(): Model<I> };
        results = results.map((result: Partial<I>) => new ModelConstructor().assign(result));

        await this.eagerLoadRelations(results);

        return results;
    }

    getRaw() {
        return this.DB.getRaw();
    }

    async paginate(page: number, perPage: number) {
        this.DB.tbl = this.getTableName();
        const pagination = await this.DB.paginate(page, perPage);

        const ModelConstructor = this.constructor as { new(): Model<I> };
        pagination.result = (pagination.result as I[]).map(result => new ModelConstructor().assign(result));

        await this.eagerLoadRelations(pagination.result);

        return new Paginator<this & I>(pagination);
    }
    // #endregion

    // #region Load
    async load<T extends keyof this>(...relations: T[]): Promise<this & I> {
        this.relationConfigs = relations.map(relation => {
            const relationObj = (this[relation] as Function)();
            return { relation, ...relationObj };
        });

        for (const { relation } of this.relationConfigs) {
            const relationInstance = this[relation]();

            const key = relationInstance.constructor.name == "BelongsTo" ? relationInstance.foreignKey : this.primaryKey;
            const ids = [this[key]];

            const relatedData = await relationInstance.fetch(ids);
            relationInstance.attachResults([this], relatedData, relation);
        }

        return this as this & I;
    }
    // #endregion
}