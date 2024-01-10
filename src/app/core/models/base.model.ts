import { AutoIncrement, Column, CreatedAt, Model, PrimaryKey, UpdatedAt } from "sequelize-typescript";

export class BaseModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @CreatedAt
    @Column({
        field: "created_at",
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        field: "updated_at",
    })
    updatedAt: Date;
}
