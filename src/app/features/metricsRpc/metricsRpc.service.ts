import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MetricsModel } from "../../core/models/metrics.model";
import sequelize, { Op, ProjectionAlias } from "sequelize";
import { formatISO } from "date-fns";

@Injectable()
export class MetricsRpcService {
    private readonly METRICS = [
        "spend",
        "costPerClick",
        "clicks",
        "sales",
        "orders",
        "impressions",
        "units",
        "clickThroughRate",
        "roasClicks",
        "acosClicks",
    ];

    constructor(@InjectModel(MetricsModel) private readonly metricsModel: typeof MetricsModel) {}

    async getMetrics(asin: string, { startDate, endDate }) {
        const metrics = await this.metricsModel.findAll({
            attributes: [...this.METRICS.map(this.mapMetric), "date", "asin"],
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

        return metrics.map((i) => {
            const costPerClick = i.spend / +i.clicks || 0;
            const acos = (i.spend / i.sales) * 100 || 0;
            const roas = i.sales / i.spend;
            const ctr = (i.clicks / i.impressions) * 100 || 0;
            const cvr = (i.units / i.clicks) * 100 || 0;

            return {
                ...i,
                costPerClick,
                acosClicks: acos,
                roasClicks: roas,
                clickThroughRate: ctr,
                conversationRate: cvr,
            };
        });
    }

    private mapMetric(metricName): ProjectionAlias {
        return [sequelize.fn("SUM", sequelize.col(metricName)), metricName];
    }
}
