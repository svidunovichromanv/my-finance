import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { UsersModel } from '../models/users';

const models: any[] = [
    UsersModel
];

const sequelizeConnectionOptions: SequelizeOptions = {
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    logging: false,
    pool: {
        min: 0,
        max: 35,
    },
    timezone: '+00:00',
    models,
    database: 'main',
};
export let main: Sequelize;

export function initializeDb(): void {
    main = new Sequelize(sequelizeConnectionOptions);
}
