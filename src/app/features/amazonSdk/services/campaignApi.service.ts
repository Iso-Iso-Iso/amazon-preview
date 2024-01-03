import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import * as process from "process";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class CampaignApiService {
    @Inject()
    private readonly httpService: HttpService;

    getSponsoredProductCampaigns(profileId: number): Observable<AxiosResponse> {
        return this.httpService.post(
            "/sp/campaigns/list",
            {},
            {
                headers: {
                    "Amazon-Advertising-API-Scope": profileId,
                    "Content-Type": "application/vnd.spcampaign.v3+json",
                    Accept: "application/vnd.spcampaign.v3+json",
                },
            },
        );
    }
}
