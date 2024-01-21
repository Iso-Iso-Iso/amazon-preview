import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query, ValidationPipe } from "@nestjs/common";
import { MetricsRpcService } from "./metricsRpc.service";

@Controller("/api/metrics")
export class MetricsRpcController {
    constructor(private readonly metricsRpcService: MetricsRpcService) {}

    @Get()
    async getMetrics(
        @Query("asin") asin: string,
        @Query("profileId", new ParseIntPipe({ optional: true })) profileId: number,
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
    ) {
        if ((!asin && !profileId) || !startDate || !endDate) {
            throw new BadRequestException("bad request");
        }

        if (asin) {
            const metrics = await this.metricsRpcService.getMetrics(asin, { startDate, endDate });
            return { data: metrics };
        }

        if (profileId) {
            const metrics = await this.metricsRpcService.getMetricsPerProfile(profileId, { startDate, endDate });
            return { data: metrics };
        }
    }

    // @Get("/profile")
    // async getMetricsPerProfile(
    //     @Query("profileId", ParseIntPipe) profileId: number,
    //     @Query("startDate") startDate: string,
    //     @Query("endDate") endDate: string,
    // ) {
    //     if (!profileId || !startDate || !endDate) {
    //         throw new BadRequestException("bad request");
    //     }
    //
    //     const metrics = await this.metricsRpcService.getMetricsPerProfile(profileId, { startDate, endDate });
    //     return { data: metrics };
    // }

    @Get("/total")
    async getTotalMetrics(
        @Query("asin") asin: string,
        @Query("profileId", new ParseIntPipe({ optional: true })) profileId: number,
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
    ) {
        if ((!asin && !profileId) || !startDate || !endDate) {
            throw new BadRequestException("bad request");
        }
        if (asin) {
            const metrics = await this.metricsRpcService.getMetricsTotal(asin, { startDate, endDate });
            return { data: metrics };
        }

        if (profileId) {
            const metrics = await this.metricsRpcService.getMetricsTotalByProfile(profileId, { startDate, endDate });
            return { data: metrics };
        }
    }
}
