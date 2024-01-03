import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class ProfileApiService {
    @Inject()
    private readonly httpService: HttpService;

    getProfiles(): Observable<AxiosResponse> {
        return this.httpService.get("/v2/profiles", {
            params: {
                accessLevel: "view",
            },
            headers: {
                // "Content-Type": "application/vnd.spcampaign.v3+json",
                // Accept: "application/vnd.spcampaign.v3+json",
            },
        });
    }
}
