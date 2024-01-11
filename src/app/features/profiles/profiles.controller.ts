import { Controller, Get, Inject } from "@nestjs/common";
import { ProfileApiService } from "../amazonSdk/services/profileApi.service";
import { map } from "rxjs";

@Controller("/api/profiles")
export class ProfilesController {
    @Inject()
    private readonly profileApiService: ProfileApiService;

    @Get()
    getProfiles() {
        return this.profileApiService.getProfiles().pipe(
            map((res) => ({
                data: res.data,
            })),
        );
    }
}
