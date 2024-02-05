import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MetricsModel } from "../../core/models/metrics.model";
import sequelize, { Op, ProjectionAlias } from "sequelize";

type MetricFilters = {
    startDate: string;
    endDate: string;
};

@Injectable()
export class MetricsRpcService {
    private readonly metricNames = ["spend", "costPerClick", "clicks", "sales", "orders", "impressions", "units"];

    constructor(@InjectModel(MetricsModel) private readonly metricsModel: typeof MetricsModel) {}

    async getMetrics(asin: string, filters: MetricFilters) {
        const finder = this.createFinderForProduct(asin, filters);

        const metrics = await this.metricsModel.findAll({
            attributes: [...this.metricNames.map(this.mapMetric), "date", "asin"],
            where: finder,
            group: ["asin", "date"],
            order: [["date", "ASC"]],
            raw: true,
        });

        return this.calculateComputedMetrics(metrics);
    }

    async getMetricsPerProfile(profileId: number, filters: MetricFilters) {
        const finder = this.createFinderForProfile(profileId, filters);

        const metrics = await this.metricsModel.findAll({
            attributes: [...this.metricNames.map(this.mapMetric), "date", "profileId"],
            where: finder,
            group: ["profileId", "date"],
            order: [["date", "ASC"]],
            raw: true,
        });

        return this.calculateComputedMetrics(metrics);
    }

    async getMetricsTotal(asin: string, filters: MetricFilters) {
        const finder = this.createFinderForProduct(asin, filters);

        const metrics = await this.metricsModel.findAll({
            attributes: [...this.metricNames.map(this.mapMetric), "asin"],
            where: finder,
            group: ["asin"],
            raw: true,
        });

        return this.calculateComputedMetrics(metrics);
    }

    async getMetricsTotalByProfile(profile: number, filters: MetricFilters) {
        const finder = this.createFinderForProfile(profile, filters);

        const metrics = await this.metricsModel.findAll({
            attributes: [...this.metricNames.map(this.mapMetric), "profileId", "asin"],
            where: finder,
            group: ["profileId", "asin"],
            raw: true,
        });

        return this.calculateComputedMetrics(metrics);
    }

    private mapMetric(metricName): ProjectionAlias {
        return [sequelize.fn("SUM", sequelize.col(metricName)), metricName];
    }

    private createFinderForProduct(asin: string, { startDate, endDate }: MetricFilters) {
        return {
            asin,
            date: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            },
        };
    }

    private createFinderForProfile(profileId: number, { startDate, endDate }: MetricFilters) {
        return {
            profileId,
            date: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            },
        };
    }

    // TODO: do it in db side or move in another compute function
    private calculateComputedMetrics(metrics: MetricsModel[]) {
        const metricsCopy = metrics.slice();

        return metricsCopy.map((i) => {
            const costPerClick = i.spend / +i.clicks || 0;
            const acos = (i.spend / i.sales) * 100 || 0;
            const roas = i.sales / i.spend;
            const ctr = (i.clicks / i.impressions) * 100 || 0;
            const cvr = (i.units / i.clicks) * 100 || 0;

            return {
                ...i,
                costPerClick,
                acos: acos,
                roas: roas,
                clickThroughRate: ctr,
                conversationRate: cvr,
            };
        });
    }
}
