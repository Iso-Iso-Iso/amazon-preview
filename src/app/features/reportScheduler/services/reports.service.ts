import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MetricsModel } from "../../../core/models/metrics.model";
import sequelize, { Op, ProjectionAlias } from "sequelize";
import { subDays } from "date-fns";
import { HttpService } from "@nestjs/axios";
import * as process from "process";

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(MetricsModel) private readonly metricsModel: typeof MetricsModel,
        private readonly httpService: HttpService,
    ) {}

    async upsertMetric(profileId: number, reportMetric) {
        const finder = this.createMetricUniqueFinder(profileId, reportMetric);
        const metricUpsertBody = this.prepareMetricUpsertView(profileId, reportMetric);

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

    private prepareMetricUpsertView(
        profileId: number,
        {
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
        },
    ) {
        return {
            profileId,
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

    private createMetricUniqueFinder(profileId: number, { date, campaignId, advertisedAsin, adGroupId }) {
        return { date, campaignId, asin: advertisedAsin, adGroupId, profileId };
    }

    //TODO: rewrite in future
    private readonly metricNames = ["spend", "costPerClick", "clicks", "sales", "orders", "impressions", "units"];

    validateMetrics(metrics) {
        this.httpService.post(process.env.METRIC_VALIDATOR_HOST, metrics).subscribe({
            error: (e) => {
                console.log(e);
            },
            next: () => {
                console.log("good");
            },
        });
    }

    async getMetricsToValidate() {
        const metrics = await this.metricsModel.findAll({
            attributes: [...this.metricNames.map(this.mapMetric), "date", "asin"],
            where: {
                date: {
                    [Op.gte]: subDays(new Date(), 4),
                },
            },
            group: ["asin", "date"],
            order: [["date", "ASC"]],
            raw: true,
        });

        return this.calculateComputedMetrics(metrics);
    }

    private mapMetric(metricName): ProjectionAlias {
        return [sequelize.fn("SUM", sequelize.col(metricName)), metricName];
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
