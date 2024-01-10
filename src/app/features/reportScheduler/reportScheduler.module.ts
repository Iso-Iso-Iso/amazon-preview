import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";
import { QueueNames } from "../../shared/constants/queueNames";
import { ReportCreationConsumer } from "./consumer/reportCreation.consumer";
import { ReportManagerService } from "./services/reportManager.service";
import { ReportScheduler } from "./scheduler/report.scheduler";
import { AmazonSdkModule } from "../amazonSdk/amazonSdk.module";
import { ReportDownloadConsumer } from "./consumer/reportDownload.consumer";
import { ReportsService } from "./services/reports.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { MetricsModel } from "../../core/models/metrics.model";

@Module({
    imports: [
        AmazonSdkModule,
        ScheduleModule.forRoot(),
        BullModule.registerQueue({
            name: QueueNames.REPORT_CREATION_QUEUE,
        }),
        BullModule.registerQueue({
            name: QueueNames.REPORT_DOWNLOAD_QUEUE,
        }),
        SequelizeModule.forFeature([MetricsModel]),
    ],
    providers: [ReportScheduler, ReportManagerService, ReportCreationConsumer, ReportDownloadConsumer, ReportsService],
})
export class ReportSchedulerModule {}
