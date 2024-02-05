import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import * as process from "process";
import { BullModule } from "@nestjs/bull";
import { MetricsModel } from "./models/metrics.model";

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            models: [MetricsModel],
            sync: {
                force: true,
            },
            autoLoadModels: true,
            synchronize: true,
        }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
                enableTLSForSentinelMode: true,
            },
        }),
    ],
    exports: [SequelizeModule, BullModule],
})
export class CoreModule {}
