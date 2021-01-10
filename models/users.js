"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let UsersModel = class UsersModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Unique(true),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER())
], UsersModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(256))
], UsersModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(256))
], UsersModel.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(256))
], UsersModel.prototype, "pass", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Default(null),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN)
], UsersModel.prototype, "confirmed", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(128))
], UsersModel.prototype, "confirm_url", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(40))
], UsersModel.prototype, "user_type", void 0);
UsersModel = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'users',
        timestamps: false,
    })
], UsersModel);
exports.UsersModel = UsersModel;
//# sourceMappingURL=users.js.map