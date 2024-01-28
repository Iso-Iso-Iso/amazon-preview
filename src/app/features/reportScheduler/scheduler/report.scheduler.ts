import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProfileApiService } from "../../amazonSdk/services/profileApi.service";
import { ReportManagerService } from "../services/reportManager.service";
import { map } from "rxjs";
import { ReportsService } from "../services/reports.service";

@Injectable()
export class ReportScheduler {
    constructor(
        private readonly profileApiService: ProfileApiService,
        private readonly reportManagerService: ReportManagerService,
        private readonly reportsService: ReportsService,
    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    createReports() {
        console.log("schedule");
        this.profileApiService
            .getProfiles()
            .pipe(map((res) => res.data))
            .subscribe((res) => {
                res.forEach((item) => {
                    const reportSchema = this.reportManagerService.createReportBody();

                    this.reportManagerService.addReportCreationJob(item.profileId, reportSchema);
                });
            });
    }
    // TODO remake in future
    @Cron(CronExpression.EVERY_30_SECONDS)
    async validateMetrics() {
        const metrics = await this.reportsService.getMetricsToValidate();
        this.reportsService.validateMetrics(metrics)
    }
}
