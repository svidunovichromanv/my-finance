import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    Unique,
    Default,
} from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: false,
})
export class UsersModel extends Model<UsersModel> {
    @AutoIncrement
    @PrimaryKey
    @AllowNull(false)
    @Unique(true)
    @Column(
        DataType.INTEGER(),
    )
    public id: number;

    @AllowNull(false)
    @Column(DataType.STRING(256))
    public name: string;

    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING(256))
    public email: string;

    @AllowNull(false)
    @Column(DataType.STRING(256))
    public pass: string;

    @AllowNull(false)
    @Default(null)
    @Column(DataType.BOOLEAN)
    public confirmed: boolean;

    @AllowNull(false)
    @Column(DataType.STRING(128))
    public confirm_url: string;

    @AllowNull(false)
    @Column(DataType.STRING(40))
    public user_type: string;
}
