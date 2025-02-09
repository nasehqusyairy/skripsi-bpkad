
type Column = {
    name: string;
    type: ColumnType;
    length?: number;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    default?: string;
    nullable?: boolean;
};

type ForeignKey = {
    column: string;
    references: string;
    on: string;
};

type ColumnType = 'BIGINT' | 'INT' | 'VARCHAR' | 'TEXT' | 'CHAR' | 'TIMESTAMP';

export class Blueprint {

    tableName: string;
    columns: Column[];
    foreignKeys: ForeignKey[];

    constructor(tableName: string) {
        this.tableName = tableName;
        this.columns = [];
        this.foreignKeys = [];
    }

    id() {
        this.columns.push({
            name: 'id',
            type: 'BIGINT',
            length: 20,
            primaryKey: true,
            autoIncrement: true
        });
        return this;
    }

    primary() {
        this.columns[this.columns.length - 1].primaryKey = true;
        return this;
    }

    autoIncrement() {
        this.columns[this.columns.length - 1].autoIncrement = true;
        return this;
    }

    bigint(columnName, length = 20) {
        this.columns.push({
            name: columnName,
            type: 'BIGINT',
            length: length
        });
        return this;
    }

    integer(columnName: string, length = 11) {
        this.columns.push({
            name: columnName,
            type: 'INT',
            length: length
        });
        return this;
    }

    string(columnName, length = 255) {
        this.columns.push({
            name: columnName,
            type: 'VARCHAR',
            length: length
        });
        return this;
    }

    text(columnName) {
        this.columns.push({
            name: columnName,
            type: 'TEXT'
        });
        return this;
    }

    char(columnName, length = 1) {
        this.columns.push({
            name: columnName,
            type: 'CHAR',
            length: length
        });
        return this;
    }

    default(value, isFunction = false) {
        this.columns[this.columns.length - 1].default = isFunction ? value : `'${value}'`;
        return this;
    }


    nullable() {
        this.columns[this.columns.length - 1].nullable = true;
        return this;
    }

    foreignId(columnName) {
        this.columns.push({
            name: columnName,
            type: 'BIGINT',
            length: 20
        });
        this.foreignKeys.push({
            column: columnName,
            references: 'roles', // Default references table
            on: 'id' // Default references column
        });
        return this;
    }

    constrained(table = 'roles', column = 'id') {
        const lastForeignKey = this.foreignKeys[this.foreignKeys.length - 1];
        lastForeignKey.references = table;
        lastForeignKey.on = column;
        return this;
    }

    timestamp(columnName) {
        this.columns.push({
            name: columnName,
            type: 'TIMESTAMP'
        });
        return this;
    }

    timestamps() {
        this.columns.push({
            name: 'created_at',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP'
        });
        this.columns.push({
            name: 'updated_at',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        });
        return this;
    }
}