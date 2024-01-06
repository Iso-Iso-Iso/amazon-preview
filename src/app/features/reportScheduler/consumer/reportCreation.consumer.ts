import { Process, Processor } from "@nestjs/bull";
import { QueueNames } from "../../../constants/queueNames";
import { Job } from "bull";
import { ReportsApiService } from "../../amazonSdk/services/reportsApi.service";
import { ReportManagerService } from "../services/reportManager.service";
import { map } from "rxjs";

@Processor(QueueNames.REPORT_CREATION_QUEUE)
export class ReportCreationConsumer {
    constructor(
        private readonly reportsApiService: ReportsApiService,
        private readonly reportManagerService: ReportManagerService,
    ) {}

    // TODO: keep in mind about time
    @Process()
    async transcode(job: Job<any>) {
        const { profileId, reportBody } = job.data;

        this.reportsApiService
            .createReport(profileId, reportBody)
            .pipe(map((res) => res.data))
            .subscribe({
                next: (res) => {
                    console.log("create report download");
                    this.reportManagerService.addReportDownloadJob(res.reportId, profileId);
                },
            });
    }
}
