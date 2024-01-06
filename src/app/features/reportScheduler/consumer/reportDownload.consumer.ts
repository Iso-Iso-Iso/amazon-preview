import { Process, Processor } from "@nestjs/bull";
import { QueueNames } from "../../../constants/queueNames";
import { ReportManagerService } from "../services/reportManager.service";
import { ReportsApiService } from "../../amazonSdk/services/reportsApi.service";
import { map } from "rxjs";
import { ReportsStatus } from "../../../constants/reports";

@Processor(QueueNames.REPORT_DOWNLOAD_QUEUE)
export class ReportDownloadConsumer {
    constructor(
        private readonly reportManagerService: ReportManagerService,
        private readonly reportsApiService: ReportsApiService,
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
                this.reportsApiService.getUncompressedData(res.url).subscribe((res) => {
                    console.log(res);
                });
            });
    }
}
