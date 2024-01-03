import { Controller, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProfileApiService } from "../amazonSdk/services/profileApi.service";
import { Axios, AxiosError } from "axios";

@Controller()
export class ProfilesController {
    @Inject()
    private readonly profileApiService: ProfileApiService;

    @GrpcMethod("ProfileServiceV1", "getProfiles")
    getProfiles() {
        this.profileApiService.getProfiles().subscribe({
            next: (res) => {
                console.log(res);
            },
            error: (err: AxiosError) => {
                console.log("err");
                console.log(err);
            },
        });
        return;
    }
}
