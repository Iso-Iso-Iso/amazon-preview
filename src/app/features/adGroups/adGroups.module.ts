import { Module } from "@nestjs/common";
import { AdGroupsController } from "./adGroups.controller";
import { AdGroupsService } from "./adGroups.service";
import { AmazonSdkModule } from "../amazonSdk/amazonSdk.module";

@Module({
    imports: [AmazonSdkModule],
    controllers: [AdGroupsController],
    providers: [AdGroupsService],
})
export class AdGroupsModule {}
