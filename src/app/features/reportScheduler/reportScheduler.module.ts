import { Module } from "@nestjs/common";
import { ReportSchedulerController } from "./reportScheduler.controller";
import { ReportSchedulerService } from "./reportScheduler.service";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";
import { QueueNames } from "../../constants/queueNames";
import { ReportSchedulerConsumer } from "./reportScheduler.consumer";

@Module({
    imports: [
        HttpModule,
        ScheduleModule.forRoot(),
        BullModule.registerQueue({
            name: QueueNames.REPORT_QUEUE,
        }),
    ],
    providers: [ReportSchedulerService, ReportSchedulerController, ReportSchedulerConsumer],
})
export class ReportSchedulerModule {}
