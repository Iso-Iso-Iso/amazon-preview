import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectQueue } from "@nestjs/bull";
import { QueueNames } from "../../constants/queueNames";
import { Queue } from "bull";

@Injectable()
export class ReportSchedulerController {
    constructor(
        @InjectQueue(QueueNames.REPORT_QUEUE)
        private readonly reportQueue: Queue,
    ) {}

    // @Cron(CronExpression.EVERY_5_SECONDS)
    async createReport() {
        console.log("reports");
        for (let a = 0; a < 10; a++) {
            await this.reportQueue.add({
                date: new Date(),
                text: "smth",
            });
        }
        console.log("after");
    }
}
