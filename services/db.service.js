"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = exports.main = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = require("../models/users");
const models = [
    users_1.UsersModel
];
const sequelizeConnectionOptions = {
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
function initializeDb() {
    exports.main = new sequelize_typescript_1.Sequelize(sequelizeConnectionOptions);
}
exports.initializeDb = initializeDb;
//# sourceMappingURL=db.service.js.map