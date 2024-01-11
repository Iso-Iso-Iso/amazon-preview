import { BadRequestException, Controller, Get, Param, Query, ValidationPipe } from "@nestjs/common";
import { MetricsRpcService } from "./metricsRpc.service";

@Controller("/api/metrics")
export class MetricsRpcController {
    constructor(private readonly metricsRpcService: MetricsRpcService) {}

    @Get()
    async getMetrics(
        @Query("asin") asin: string,
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
    ) {
        if (!asin || !startDate || !endDate) {
            throw new BadRequestException("bad request");
        }

        const metrics = await this.metricsRpcService.getMetrics(asin, { startDate, endDate });
        return { data: metrics };
    }
}
