import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ProductAdsApiService } from "../amazonSdk/services/productAdsApi.service";
import { map } from "rxjs";

@Controller("/api/productAds")
export class ProductAdsRpcController {
    constructor(private readonly productAdsApiService: ProductAdsApiService) {}

    @Get()
    getSponsoredProductAds(@Query("profileId", ParseIntPipe) profileId: number) {
        return [{ asin: "B08VL9LPL1" }, { asin: "B0C5TSJKKF" }];
    }
}
