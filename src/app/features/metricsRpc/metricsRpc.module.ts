import { Module } from "@nestjs/common";
import { MetricsRpcController } from "./metricsRpc.controller";
import { MetricsRpcService } from "./metricsRpc.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { MetricsModel } from "../../core/models/metrics.model";

@Module({
    imports: [SequelizeModule.forFeature([MetricsModel])],
    controllers: [MetricsRpcController],
    providers: [MetricsRpcService],
})
export class MetricsRpcModule {}
