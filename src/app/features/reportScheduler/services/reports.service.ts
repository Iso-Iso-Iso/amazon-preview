import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MetricsModel } from "../../../core/models/metrics.model";

@Injectable()
export class ReportsService {
    constructor(@InjectModel(MetricsModel) private readonly metricsModel: typeof MetricsModel) {}

    async upsertMetric(reportMetric) {
        const finder = this.createMetricUniqueFinder(reportMetric);
        const metricUpsertBody = this.prepareMetricUpsertView(reportMetric);

        const metric = await this.metricsModel.findOne({
            where: finder,
        });

        if (!metric) {
            return this.metricsModel.create<MetricsModel>(metricUpsertBody);
        }

        return this.metricsModel.update<MetricsModel>(metricUpsertBody, {
            where: finder,
        });
    }

    private prepareMetricUpsertView({
        date,
        costPerClick,
        campaignId,
        spend,
        unitsSoldSameSku1d,
        clicks,
        sales1d,
        purchases1d,
        impressions,
        advertisedAsin,
        adGroupId,
        clickThroughRate,
        roasClicks7d,
        acosClicks7d,
    }) {
        return {
            date: date,
            costPerClick: costPerClick,
            campaignId,
            spend,
            units: unitsSoldSameSku1d,
            clicks,
            sales: sales1d,
            orders: purchases1d,
            impressions,
            asin: advertisedAsin,
            adGroupId,
            clickThroughRate,
            roasClicks: roasClicks7d,
            acosClicks: acosClicks7d,
        };
    }

    private createMetricUniqueFinder({ date, campaignId, advertisedAsin, adGroupId }) {
        return { date, campaignId, asin: advertisedAsin, adGroupId };
    }
}
