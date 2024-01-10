import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { MetricsRpcService } from "./metricsRpc.service";

@Controller()
export class MetricsRpcController {
    constructor(private readonly metricsRpcService: MetricsRpcService) {}

    @GrpcMethod("MetricsServiceV1", "getMetrics")
    async getMetrics({ asin, startDate, endDate }) {
        const metrics = await this.metricsRpcService.getMetrics(asin, { startDate, endDate });
        return { data: metrics };
    }
}
