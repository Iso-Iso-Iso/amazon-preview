import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProfileApiService } from "../../amazonSdk/services/profileApi.service";
import { ReportManagerService } from "../services/reportManager.service";
import { map } from "rxjs";

@Injectable()
export class ReportScheduler {
    constructor(
        private readonly profileApiService: ProfileApiService,
        private readonly reportManagerService: ReportManagerService,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
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
}
