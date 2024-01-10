import { Controller, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProfileApiService } from "../amazonSdk/services/profileApi.service";
import { AxiosError } from "axios";
import { map } from "rxjs";

@Controller()
export class ProfilesController {
    @Inject()
    private readonly profileApiService: ProfileApiService;

    @GrpcMethod("ProfileServiceV1", "getProfiles")
    getProfiles() {
        return this.profileApiService.getProfiles().pipe(
            map((res) => ({
                data: res.data,
            })),
        );
    }
}
