import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CampaignModule } from "./features/campaign/campaign.module";
import { ProfilesModule } from "./features/profiles/profiles.module";
import { AdGroupsModule } from "./features/adGroups/adGroups.module";
import { ReportSchedulerModule } from "./features/reportScheduler/reportScheduler.module";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { MetricsRpcModule } from "./features/metricsRpc/metricsRpc.module";
import { ProductAdsRpcModule } from "./features/productAdsRpc/productAdsRpc.module";

@Module({
    imports: [
        CoreModule,
        SharedModule,
        CampaignModule,
        ProfilesModule,
        AdGroupsModule,
        ReportSchedulerModule,
        MetricsRpcModule,
        ProductAdsRpcModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
