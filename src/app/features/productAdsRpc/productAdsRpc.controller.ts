import { Controller } from "@nestjs/common";
import { ProductAdsApiService } from "../amazonSdk/services/productAdsApi.service";
import { map } from "rxjs";
import { GrpcMethod } from "@nestjs/microservices";

@Controller()
export class ProductAdsRpcController {
    constructor(private readonly productAdsApiService: ProductAdsApiService) {}

    @GrpcMethod("ProductAdsServiceV1", "getSponsoredProductAds")
    getSponsoredProductAds({ profileId }) {
        return this.productAdsApiService.getSponsoredProductAds(profileId).pipe(
            map((res) => ({
                data: res.data.productAds,
            })),
        );
    }
}
