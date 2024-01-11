import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MetricsModel } from "../../../core/models/metrics.model";
import { formatISO } from "date-fns";

@Injectable()
export class ReportsService {
    constructor(@InjectModel(MetricsModel) private readonly metricsModel: typeof MetricsModel) {}

    async upsertMetric({
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
    }) {
        const metric = await this.metricsModel.findOne({
            where: {
                date,
                campaignId,
                asin: advertisedAsin,
                adGroupId,
            },
        });

        if (!metric) {
            return this.metricsModel.create<MetricsModel>({
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
            });
        }

        return this.metricsModel.update<MetricsModel>(
            {
                date: date,
                costPerClick: costPerClick ?? 0,
                campaignId,
                spend,
                units: unitsSoldSameSku1d,
                clicks,
                sales: sales1d,
                orders: purchases1d,
                impressions,
                asin: advertisedAsin,
                adGroupId,
            },
            {
                where: { date, campaignId, asin: advertisedAsin, adGroupId },
            },
        );
    }
}
