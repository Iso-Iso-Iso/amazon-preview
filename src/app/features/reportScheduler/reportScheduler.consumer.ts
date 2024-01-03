import { Process, Processor } from "@nestjs/bull";
import { QueueNames } from "../../constants/queueNames";
import { Job } from "bull";

@Processor(QueueNames.REPORT_QUEUE)
export class ReportSchedulerConsumer {
    @Process()
    async transcode(job: Job<any>) {
        console.log(job.data, "data");
    }
}
