import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class ProductAdsApiService {
    constructor(private readonly httpService: HttpService) {}

    getSponsoredProductAds(profileId: number) {
        return this.httpService.post(
            "/sp/productAds/list",
            {},
            {
                headers: {
                    "Amazon-Advertising-API-Scope": profileId,
                    "Content-Type": "application/vnd.spproductAd.v3+json",
                    Accept: "application/vnd.spproductAd.v3+json",
                },
            },
        );
    }
}
