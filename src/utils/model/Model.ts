import QueryBuilder from 'eloquent-query-builder';
import { DB, MYSQL } from "@/utils/database/DB";
import { pluralize } from 'sequelize/lib/utils';
import { Paginator } from './Paginator';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { HasOne } from './relation/HasOne';
import { HasMany } from './relation/HasMany';
import { BelongsTo } from './relation/BelongsTo';
import { BelongsToMany } from './relation/BelongsToMany';

export type QueryOperator = "=" | "<" | ">" | "<=" | ">=" | "<>" | "!=" | "LIKE" | "NOT LIKE" | "IN" | "NOT IN" | "BETWEEN" | "NOT BETWEEN" | "IS NULL" | "IS NOT NULL" | "IS" | "IS NOT";

export class Model<I> {

    protected tableName: string = "";

    protected primaryKey: string = "id";

    protected hidden: string[] = [];

    protected guarded: string[] = [];

    public attributes: Partial<I> = {};

    protected DB: QueryBuilder;

    private _eagerLoading = [];

    constructor(attributes: Partial<I> = {}) {
        this.assign(attributes);
        this.DB = DB.table(this.getTableName());
    }

    // #region Static Helpers
    async first() {
        // console.log(await this.DB.first());
        const data = await this.DB.first();
        this.assign(data[0]);

        return data[0] && this
    }

    static async first() {
        const model = new this();
        return await model.first();
    }

    static getTableName() {
        const model = new this();
        return model.getTableName();
    }

    /**
     * Mendapatkan data berdasarkan primary key.
     * @param {number|string} id - Nilai primary key.
     * @returns {Promise<Model<unknown>|null>} - Instance model atau null jika tidak ditemukan.
     */
    static async find(id: number | string): Promise<Model<unknown> | null> {
        const model = new this();
        model.DB.where(model.primaryKey, id);
        return await model.first();
    }

    static getPrimaryKey() {
        const model = new this();
        return model.primaryKey;
    }

    static async all() {
        const model = new this();
        const results = await model.DB.get();
        return results.map((result: object) => new this(result));
    }
    // #endregion


    // #region Helpers
    assign(attributes: Partial<I>): void {
        this.attributes = attributes;
        Object.assign(this, attributes);
    }

    getTableName() {
        return this.tableName && this.tableName.trim() !== ""
            ? this.tableName
            : pluralize(this.constructor.name.toLowerCase()); // Pluralisasi otomatis berdasarkan nama class
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

    static select<T extends Model<object>>(...columns: string[]): T {
        const model = new this() as T;
        model.DB.select(...columns);
        return model;
    }

    select<K extends keyof I>(...columns: K[]): this {
        this.DB.select(...columns);
        return this;
    }

    static distinct<T extends Model<object>>(...columns: string[]): T {
        const model = new this() as T;
        model.DB.distinct(...columns);
        return model;
    }

    distinct<K extends keyof I>(...columns: K[]): this {
        this.DB.distinct(...columns);
        return this;
    }

    // #endregion

    // #region Order and Limit
    static groupBy<T extends Model<object>>(...columns: string[]): T {
        const model = new this() as T;
        model.DB.groupBy(...columns);
        return model;
    }

    groupBy<K extends keyof I>(...columns: K[]): this {
        this.DB.groupBy(...columns);
        return this;
    }

    static orderBy<T extends Model<object>>(column: string, direction: "ASC" | "DESC" = "ASC"): T {
        const model = new this() as T;
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

    static limit<T extends Model<object>>(value: number): T {
        const model = new this() as T;
        model.DB.limit(value);
        return model;
    }

    limit(value: number): this {
        this.DB.limit(value);
        return this;
    }

    static offset<T extends Model<object>>(value: number): T {
        const model = new this() as T;
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

    // #region Pagination

    async paginate(page: number, perPage: number) {
        const pagination = await this.DB.paginate(page, perPage);

        // Ubah result menjadi instance model
        const ModelConstructor = this.constructor as { new(attributes: any): Model<I> };
        pagination.result = pagination.result.map((result: any) => new ModelConstructor(result));

        // Kembalikan instance Paginator
        return new Paginator(pagination);
    }

    // #endregion

    // #region Where Static

    static where(column: string, operator: QueryOperator, value: any): Model<any>
    static where(column: string, value: any): Model<any>
    static where(args: object): Model<any>

    static where(...args: [string, string, any] | [string, any] | [object]) {
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

    static orWhere(column: string, operator: QueryOperator, value: any): Model<any>
    static orWhere(column: string, value: any): Model<any>
    static orWhere(args: object): Model<any>

    static orWhere(...args: [string, string, any] | [string, any] | [object]) {
        const model = new this()

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            const [object] = args;
            if (typeof object !== "object") {
                throw new Error("Invalid argument. Argument must be an object if there is only one argument.");
            }

            for (const key in object) {
                model.DB.orWhere(key, object[key]);
            }
        } else if (args.length === 2) {
            model.DB.orWhere(args[0], "=", args[1]);
        }
        else {
            model.DB.orWhere(args[0], args[1] as QueryOperator, args[2]);
        }

        return model
    }

    static orWhereNot(column: string, operator: QueryOperator, value: any): Model<any>
    static orWhereNot(column: string, value: any): Model<any>
    static orWhereNot(args: object): Model<any>

    static orWhereNot(...args: [string, string, any] | [string, any] | [object]) {
        const model = new this();

        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
            const [object] = args;
            if (typeof object !== "object") {
                throw new Error("Invalid argument. Argument must be an object if there is only one argument.");
            }

            for (const key in object) {
                model.DB.orWhereNot(key, object[key]);
            }
        } else if (args.length === 2) {
            model.DB.orWhereNot(args[0], "=", args[1]);
        }
        else {
            model.DB.orWhereNot(args[0], args[1] as QueryOperator, args[2]);
        }

        return model
    }

    static orWhereNull(column: string) {
        const model = new this();
        model.DB.orWhereNull(column);
        return model
    }

    static orWhereNotNull(column: string) {
        const model = new this();
        model.DB.orWhereNotNull(column);
        return model
    }

    static whereNot(column: string, operator: QueryOperator, value: any): Model<any>
    static whereNot(column: string, value: any): Model<any>
    static whereNot(args: object): Model<any>

    static whereNot(...args: [string, string, any] | [string, any] | [object]) {
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

    static whereNull(column: string) {
        const model = new this();
        model.DB.whereNull(column);
        return model
    }

    static whereNotNull(column: string) {
        const model = new this();
        model.DB.whereNotNull(column);
        return model
    }

    static whereExists(callback: (query: QueryBuilder) => void) {
        const model = new this();
        model.DB.whereExists(callback);
        return model
    }

    static whereNotExists(callback: (query: QueryBuilder) => void) {
        const model = new this();
        model.DB.whereNotExists(callback);
        return model
    }

    static whereBetween(column: string, values: any[]) {
        const model = new this();
        model.DB.whereBetween(column, values);
        return model
    }

    static whereNotBetween(column: string, values: any[]) {
        const model = new this();
        model.DB.whereNotBetween(column, values);
        return model
    }

    static orWhereBetween(column: string, values: any[]) {

        const [start, end] = values;

        const model = new this();
        model.DB.orWhere(column, "BETWEEN", start, "AND", end);
        return model
    }

    static orWhereNotBetween(column: string, values: any[]) {
        const [start, end] = values;

        const model = new this();
        model.DB.orWhere(column, "NOT BETWEEN", start, "AND", end);
        return model
    }

    static whereIn(column: string, values: any[]) {
        const model = new this();
        model.DB.whereIn(column, values);
        return model
    }

    static whereNotIn(column: string, values: any[]) {
        const model = new this();
        model.DB.whereNotIn(column, values);
        return model
    }

    static whereLike(column: string, value: any) {
        const model = new this();
        model.DB.where(column, "LIKE", value);
        return model
    }

    static whereNotLike(column: string, value: any) {
        const model = new this();
        model.DB.where(column, "NOT LIKE", value);
        return model
    }

    static orWhereLike(column: string, value: any) {
        const model = new this();
        model.DB.orWhere(column, "LIKE", value);
        return model
    }

    static orWhereNotLike(column: string, value: any) {
        const model = new this();
        model.DB.orWhere(column, "NOT LIKE", value);
        return model
    }


    // #endregion

    // #region Where Instance

    where<T extends Model<I>>(column: string, operator: QueryOperator, value: any): T
    where<T extends Model<I>>(column: string, value: any): T
    where<T extends Model<I>>(args: Partial<I>): T

    where(...args: [string, string, any] | [string, any] | [Partial<I>]) {

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

    orWhere<T extends Model<I>>(column: string, operator: QueryOperator, value: any): T
    orWhere<T extends Model<I>>(column: string, value: any): T
    orWhere<T extends Model<I>>(args: Partial<I>): T

    orWhere(...args: [string, string, any] | [string, any] | [Partial<I>]) {

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

    orWhereNot<T extends Model<I>>(column: string, operator: QueryOperator, value: any): T
    orWhereNot<T extends Model<I>>(column: string, value: any): T
    orWhereNot<T extends Model<I>>(args: Partial<I>): T

    orWhereNot(...args: [string, string, any] | [string, any] | [Partial<I>]) {

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

    whereNot<T extends Model<I>>(column: string, operator: QueryOperator, value: any): T
    whereNot<T extends Model<I>>(column: string, value: any): T
    whereNot<T extends Model<I>>(args: Partial<I>): T

    whereNot(...args: [string, string, any] | [string, any] | [Partial<I>]) {

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

    whereIn<K extends keyof I>(column: K, values: any[]) {
        this.DB.whereIn(column, values);
        return this;
    }

    whereNotIn<K extends keyof I>(column: K, values: any[]) {
        this.DB.whereNotIn(column, values);
        return this;
    }

    whereLike<K extends keyof I>(column: K, value: any) {
        this.DB.where(column, "LIKE", value);
        return this;
    }

    whereNotLike<K extends keyof I>(column: K, value: any) {
        this.DB.where(column, "NOT LIKE", value);
        return this;
    }

    orWhereLike<K extends keyof I>(column: K, value: any) {
        this.DB.orWhere(column, "LIKE", value);
        return this;
    }

    orWhereNotLike<K extends keyof I>(column: K, value: any) {
        this.DB.orWhere(column, "NOT LIKE", value);
        return this;
    }

    // #endregion

    async save() {
        if (this[this.getPrimaryKey()]) {
            // Jika primary key ada, lakukan update
            await this.where(this.getPrimaryKey(), this[this.getPrimaryKey()]).update(this.attributes);
        } else {
            // Jika primary key tidak ada, lakukan insert
            await this.create(this.attributes);
        }
        return this;
    }

    async update(data: Partial<I>) {

        const setClause = Object.keys(data)
            .map(key => `${key} = '${data[key]}'`)
            .join(", ");

        const whereClause = this.DB.getRaw().replace("SELECT *", "").replace("from " + this.getTableName(), "").trim();
        const query = `UPDATE ${this.getTableName()} SET ${setClause} ${whereClause}`;

        const result: RowDataPacket = (await MYSQL.query(query))[0] as RowDataPacket;
        const { affectedRows } = result;

        this.assign(data);

        return affectedRows;
    }

    private async create(data: Partial<I>) {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => "?").join(", ");
        const values = Object.values(data);

        const query = `INSERT INTO ${this.getTableName()} (${columns.join(", ")}) VALUES (${placeholders})`;

        const [result] = await MYSQL.execute<ResultSetHeader>(query, values);
        const insertId = result.insertId;

        this.assign({
            ...data,
            [this.getPrimaryKey()]: insertId
        });

        return insertId;
    }

    static async create(data: object): Promise<Model<unknown>> {
        if (typeof data !== "object" || Array.isArray(data)) {
            throw new Error("Data must be an object.");
        }

        const columns = Object.keys(data);
        const placeholders = columns.map(() => "?").join(", ");
        const values = Object.values(data);

        const query = `INSERT INTO ${this.getTableName()} (${columns.join(", ")}) VALUES (${placeholders})`;

        const [result] = await MYSQL.execute<ResultSetHeader>(query, values);

        const insertId = result.insertId;

        return new this({
            ...data,
            [this.getPrimaryKey()]: insertId
        });
    }


    static async insert(dataArray: object[]) {
        if (!Array.isArray(dataArray)) {
            throw new Error("Data must be an array of objects.");
        }

        if (dataArray.length === 0) {
            throw new Error("Data array cannot be empty.");
        }

        // Ambil kolom dari objek pertama
        const columns = Object.keys(dataArray[0]).join(", ");

        // Format nilai untuk setiap objek
        const values = dataArray
            .map(data => {
                const rowValues = Object.values(data).map(value => `'${value}'`).join(", ");
                return `(${rowValues})`;
            })
            .join(", ");

        const query = `INSERT INTO ${this.getTableName()} (${columns}) VALUES ${values}`;
        const { affectedRows } = (await MYSQL.query(query))[0] as RowDataPacket;
        return affectedRows; // Mengembalikan jumlah baris yang berhasil ditambahkan
    }

    // #region Delete

    async delete() {
        const whereClause = this.DB.getRaw().replace("SELECT *", "").replace("from " + this.getTableName(), "").trim();

        const query = `DELETE FROM ${this.getTableName()} ${whereClause}`;

        const { affectedRows } = (await MYSQL.query(query))[0] as RowDataPacket;

        return affectedRows;
    }

    static async delete(id: number | string) {
        const model = new this();
        return await model.where(model.primaryKey, id).delete();
    }

    // #endregion

    // #region Relationship
    // Fungsi untuk mendefinisikan relasi hasOne
    hasOne<R>(model: typeof Model<R>, foreignKey?: string): HasOne<I, R> {
        if (!foreignKey) {
            foreignKey = `${this.constructor.name.toLowerCase()}_${this.primaryKey}`;
        }

        return new HasOne(model, foreignKey);
    }


    // Fungsi untuk mendefinisikan relasi hasMany
    hasMany<R>(model: typeof Model<R>, foreignKey?: string): HasMany<I, R> {

        if (!foreignKey) {
            foreignKey = `${this.constructor.name.toLocaleLowerCase()}_${this.primaryKey}`;
        }

        return new HasMany(model, foreignKey);
    }

    // Fungsi untuk mendefinisikan relasi belongsTo
    belongsTo<R>(model: typeof Model<R>, foreignKey?: string, primaryKey?: string): BelongsTo<I, R> {
        if (!foreignKey) {
            foreignKey = `${model.name.toLowerCase()}_${model.getPrimaryKey()}`;
        }

        if (!primaryKey) {
            primaryKey = model.getPrimaryKey();
        }

        return new BelongsTo(model, foreignKey, primaryKey);
    }

    // Fungsi untuk mendefinisikan relasi belongsToMany
    belongsToMany<R>(model: typeof Model<R>, pivotTable: string, foreignKey?: string, relatedKey?: string): BelongsToMany<I, R> {

        if (!foreignKey) {
            foreignKey = `${this.constructor.name.toLocaleLowerCase()}_${this.primaryKey}`;
        }

        if (!relatedKey) {
            relatedKey = `${model.name.toLowerCase()}_${model.getPrimaryKey()}`;
        }

        return new BelongsToMany(this, model, pivotTable, foreignKey, relatedKey);
    }

    // #endregion

    // #region With

    // Method untuk eager loading, simpan nama relasi beserta objek relasi yang dikembalikan
    static with(relations: string | string[]) {
        if (!Array.isArray(relations)) {
            relations = [relations];
        }

        const modelInstance = new this();
        modelInstance._eagerLoading = relations.map(relation => {
            // Mengambil objek relasi dari setiap fungsi relasi
            const relationObj = modelInstance[relation]();

            return { relation, ...relationObj };
        });

        return modelInstance;
    }

    with<T extends keyof this>(relations: T | T[]): this {
        if (!Array.isArray(relations)) {
            relations = [relations];
        }

        this._eagerLoading = relations.map(relation => {
            const relationObj = (this[relation] as Function)();
            return { relation, ...relationObj };
        });

        return this;
    }

    // #endregion

    // #region Get
    async get(): Promise<this[]> {
        // Ambil data utama
        this.DB.tbl = this.getTableName();

        let results = await this.DB.get();

        // Buat seluruh data menjadi instance model
        const ModelConstructor = this.constructor as { new(attributes: any): Model<I> };
        results = results.map((result: Partial<I>) => new ModelConstructor(result));

        // Eager loading data relasi yang diminta
        if (this._eagerLoading.length > 0) {
            for (const { relation } of this._eagerLoading) {
                const relationInstance = this[relation]();

                const key = relationInstance.constructor.name == "BelongsTo" ? relationInstance.foreignKey : this.primaryKey;
                const ids = results.map((result: Partial<I>) => result[key]);

                const relatedData = await relationInstance.fetch(ids);
                relationInstance.attachResults(results, relatedData, relation);
            }
        }

        return results;
    }
    // #endregion

    // #region Load
    async load<T extends keyof this>(relations: T | T[]): Promise<this> {
        if (!Array.isArray(relations)) {
            relations = [relations];
        }

        this._eagerLoading = relations.map(relation => {
            const relationObj = (this[relation] as Function)();
            return { relation, ...relationObj };
        });

        // Ambil data relasi
        for (const { relation } of this._eagerLoading) {
            const relationInstance = this[relation]();

            const key = relationInstance.constructor.name == "BelongsTo" ? relationInstance.foreignKey : this.primaryKey;
            const ids = [this[key]];

            const relatedData = await relationInstance.fetch(ids);
            relationInstance.attachResults([this], relatedData, relation);
        }

        return this;
    }
    // #endregion
}
