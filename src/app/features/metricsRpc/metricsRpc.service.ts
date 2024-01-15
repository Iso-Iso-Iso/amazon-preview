import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MetricsModel } from "../../core/models/metrics.model";
import sequelize, { Op, ProjectionAlias } from "sequelize";
import { formatISO } from "date-fns";

@Injectable()
export class MetricsRpcService {
    private readonly METRICS = ["spend", "costPerClick", "clicks", "sales", "orders", "impressions", "units"];

    constructor(@InjectModel(MetricsModel) private readonly metricsModel: typeof MetricsModel) {}

    async getMetrics(asin: string, { startDate, endDate }) {
        return this.metricsModel.findAll({
            attributes: [...this.METRICS.map(this.mapMetric), "date"],
            where: {
                asin,
                date: {
                    [Op.gte]: formatISO(startDate),
                    [Op.lte]: formatISO(endDate),
                },
            },
            group: ["asin", "date"],
            order: [["date", "ASC"]],
            raw: true,
        });
    }

    mapMetric(metricName): ProjectionAlias {
        return [sequelize.cast(sequelize.fn("SUM", sequelize.col(metricName)), "DECIMAL(10,6)"), metricName];
    }
}
