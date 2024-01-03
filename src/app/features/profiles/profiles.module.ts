import { Module } from "@nestjs/common";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { HttpModule } from "@nestjs/axios";
import { ProfileApiService } from "../amazonSdk/services/profileApi.service";

@Module({
    imports: [HttpModule],
    controllers: [ProfilesController],
    providers: [ProfilesService, ProfileApiService],
})
export class ProfilesModule {}
