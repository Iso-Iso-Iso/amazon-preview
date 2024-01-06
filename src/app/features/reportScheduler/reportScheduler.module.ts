import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";
import { QueueNames } from "../../constants/queueNames";
import { ReportCreationConsumer } from "./consumer/reportCreation.consumer";
import { ReportManagerService } from "./services/reportManager.service";
import { ReportScheduler } from "./scheduler/report.scheduler";
import { AmazonSdkModule } from "../amazonSdk/amazonSdk.module";
import { ReportDownloadConsumer } from "./consumer/reportDownload.consumer";

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
    ],
    providers: [ReportScheduler, ReportManagerService, ReportCreationConsumer, ReportDownloadConsumer],
})
export class ReportSchedulerModule {}
