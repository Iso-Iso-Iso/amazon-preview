import { Controller, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { CampaignApiService } from "../amazonSdk/services/campaignApi.service";
import { AxiosError } from "axios";

@Controller()
export class CampaignController {
    @Inject()
    private readonly campaignApiService: CampaignApiService;

    @GrpcMethod("CampaignServiceV1", "getSponsoredProductCampaigns")
    getSponsoredProductCampaigns() {
        const a = this.campaignApiService.getSponsoredProductCampaigns(784281538626439).subscribe({
            error: (err: AxiosError) => {
                console.log(err.code);
                console.log(err.response.data);
            },
            next: (res) => {
                console.log(res.data);
                // console.log(res.data);
            },
        });
        return { text: "smth" };
    }
}
