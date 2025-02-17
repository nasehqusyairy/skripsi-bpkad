import QueryBuilder from 'eloquent-query-builder';
import { createPool } from 'mysql2/promise';
import { Sequelize, Dialect } from 'sequelize';

const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

export const MYSQL = createPool({
    host,
    user,
    password,
    database,
})

const options: { host: string; logging: boolean; dialect: Dialect } = {
    host,
    logging: false,
    dialect: 'mysql',
}

const sequelize = new Sequelize(database, user, password, options);
export const createQueryBuilder = () => new QueryBuilder(sequelize);