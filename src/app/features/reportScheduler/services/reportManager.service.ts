import { Injectable } from "@nestjs/common";
import { ReportBodySchema } from "../../amazonSdk/types/reports";
import { format, subDays } from "date-fns";
import { InjectQueue } from "@nestjs/bull";
import { QueueNames } from "../../../shared/constants/queueNames";
import { Queue } from "bull";

const AMAZON_DATE_FORMAT = "yyyy-MM-dd";

@Injectable()
export class ReportManagerService {
    constructor(
        @InjectQueue(QueueNames.REPORT_CREATION_QUEUE) private readonly reportCreationQueue: Queue,
        @InjectQueue(QueueNames.REPORT_DOWNLOAD_QUEUE) private readonly reportDownloadQueue: Queue,
    ) {}

    createReportBody(): ReportBodySchema {
        return {
            startDate: format(subDays(new Date(), 14), AMAZON_DATE_FORMAT),
            endDate: format(new Date(), AMAZON_DATE_FORMAT),
            configuration: {
                format: "GZIP_JSON",
                adProduct: "SPONSORED_PRODUCTS",
                timeUnit: "DAILY",
                columns: [
                    "advertisedAsin",
                    "clicks",
                    "costPerClick",
                    "spend",
                    "sales1d",
                    "purchases1d",
                    "date",
                    "impressions",
                    "unitsSoldSameSku1d",
                    "campaignId",
                    "adGroupId",
                ],
                reportTypeId: "spAdvertisedProduct",
                groupBy: ["advertiser"],
            },
        };
    }

    async addReportCreationJob(profileId: number, reportBody: ReportBodySchema) {
        await this.reportCreationQueue.add({
            profileId: profileId,
            reportBody,
        });
    }

    async addReportDownloadJob(reportId: string, profileId: number) {
        await this.reportDownloadQueue.add(
            { reportId, profileId },
            {
                delay: 60000,
            },
        );
    }
}
