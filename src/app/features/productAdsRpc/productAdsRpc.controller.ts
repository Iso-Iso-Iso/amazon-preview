import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ProductAdsApiService } from "../amazonSdk/services/productAdsApi.service";
import { map } from "rxjs";

@Controller("/api/productAds")
export class ProductAdsRpcController {
    constructor(private readonly productAdsApiService: ProductAdsApiService) {}

    @Get()
    getSponsoredProductAds(@Query("profileId", ParseIntPipe) profileId: number) {
        return this.productAdsApiService.getSponsoredProductAds(profileId).pipe(
            map((res) => ({
                data: res.data.productAds,
            })),
        );
    }
}
