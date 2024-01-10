import { BaseModel } from "./base.model";
import { Column, DataType, Table } from "sequelize-typescript";

@Table({
    modelName: "metrics",
})
export class MetricsModel extends BaseModel {
    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    date: Date;

    @Column({
        type: DataType.STRING(24),
        allowNull: false,
    })
    asin: string;

    @Column({
        type: DataType.BIGINT.UNSIGNED,
    })
    campaignId: number;

    @Column({
        type: DataType.FLOAT,
    })
    costPerClick: number;

    @Column({
        type: DataType.FLOAT,
    })
    spend: number;

    @Column({
        type: DataType.INTEGER,
    })
    clicks: number;

    @Column({
        type: DataType.FLOAT,
    })
    sales: number;

    @Column({
        type: DataType.INTEGER,
    })
    orders: number;

    @Column({
        type: DataType.INTEGER,
    })
    impressions: number;

    @Column({
        type: DataType.INTEGER,
    })
    units: number;
}
