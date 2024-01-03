import { Module } from "@nestjs/common";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import { CampaignApiService } from "../amazonSdk/services/campaignApi.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [CampaignController],
    providers: [CampaignService, CampaignApiService],
})
export class CampaignModule {}
