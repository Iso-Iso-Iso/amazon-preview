import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CampaignModule } from "./app/features/campaign/campaign.module";
import { ProfilesModule } from "./app/features/profiles/profiles.module";
import { AdGroupsModule } from "./app/features/adGroups/adGroups.module";
import { ReportSchedulerModule } from "./app/features/reportScheduler/reportScheduler.module";
import { APP_PIPE } from "@nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { SequelizeModule } from "@nestjs/sequelize";
import * as process from "process";
import { BullModule } from "@nestjs/bull";

@Module({
    imports: [
        HttpModule,
        SequelizeModule.forRoot({
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            models: [],
        }),
        BullModule.forRoot({
            redis: {
                host: "localhost",
                port: 6379,
            },
        }),
        CampaignModule,
        ProfilesModule,
        AdGroupsModule,
        ReportSchedulerModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {}
