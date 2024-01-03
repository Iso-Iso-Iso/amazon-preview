import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AdGroupsApiService {
    constructor(private readonly httpService: HttpService) {}

    getSponsoredProductAdGroups(profileId: number, campaignId: number) {
        return this.httpService.post(
            "/sp/adGroups/list",
            {
                campaignIdFilter: {
                    include: [campaignId + ""],
                },
                stateFilter: {
                    include: ["ENABLED"],
                },
                includeExtendedDataFields: true,
                maxResults: 10,
            },
            {
                headers: {
                    "Amazon-Advertising-API-Scope": profileId,
                    "Content-Type": "application/vnd.spadGroup.v3+json",
                    Accept: "application/vnd.spadGroup.v3+json",
                },
            },
        );
    }
}
