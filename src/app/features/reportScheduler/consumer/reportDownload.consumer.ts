import { Process, Processor } from "@nestjs/bull";
import { QueueNames } from "../../../shared/constants/queueNames";
import { ReportManagerService } from "../services/reportManager.service";
import { ReportsApiService } from "../../amazonSdk/services/reportsApi.service";
import { map } from "rxjs";
import { ReportsStatus } from "../../../shared/constants/reports";
import { groupBy as _groupBy } from "lodash";
import { ReportsService } from "../services/reports.service";

@Processor(QueueNames.REPORT_DOWNLOAD_QUEUE)
export class ReportDownloadConsumer {
    constructor(
        private readonly reportManagerService: ReportManagerService,
        private readonly reportsApiService: ReportsApiService,
        private readonly reportsService: ReportsService,
    ) {}

    @Process()
    transcode(job) {
        const { profileId, reportId } = job.data;

        this.reportsApiService
            .getReport(reportId, profileId)
            .pipe(map((res) => res.data))
            .subscribe((res) => {
                if (res.status !== ReportsStatus.COMPLETED) {
                    console.log(res.status);
                    return this.reportManagerService.addReportDownloadJob(reportId, profileId);
                }

                console.log("<========Ready for download =======>");
                this.reportsApiService.getUncompressedData(res.url).subscribe(async (res) => {
                    if (!res.length) {
                        return;
                    }

                    const promised = res.map(async (item) => this.reportsService.upsertMetric(item));
                    await Promise.all(promised);
                });
            });
    }

    saveProductMetrics() {}
}
