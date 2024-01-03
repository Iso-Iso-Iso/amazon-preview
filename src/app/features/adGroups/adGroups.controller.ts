import { Controller, Inject } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AxiosError } from "axios";
import { AdGroupsApiService } from "../amazonSdk/services/adGroupsApi.service";

@Controller()
export class AdGroupsController {
    @Inject()
    private readonly adGroupsApiService: AdGroupsApiService;

    @GrpcMethod("AdGroupsServiceV1", "getSponsoredProductAdGroups")
    getSponsoredProductAdGroups() {
        const a = this.adGroupsApiService.getSponsoredProductAdGroups(784281538626439, 489084269240230).subscribe({
            error: (err: AxiosError) => {
                // console.log(err.code);
                // console.log(err);
            },
            next: (res) => {
                console.log("smth get now");
                // console.log(res);
                console.log(res.data);
            },
        });
        return;
    }
}
