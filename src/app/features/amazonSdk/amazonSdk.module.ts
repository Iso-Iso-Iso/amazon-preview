import { Module, OnModuleInit } from "@nestjs/common";
import { UserCredentialManagerModule } from "../userCredentialManager/userCredentialManager.module";
import { HttpModule, HttpService } from "@nestjs/axios";
import { AdGroupsApiService } from "./services/adGroupsApi.service";
import { CampaignApiService } from "./services/campaignApi.service";
import { ProfileApiService } from "./services/profileApi.service";
import { AxiosService } from "./api/axios.service";
import { CredentialService } from "../userCredentialManager/services/credential.service";
import { ReportsApiService } from "./services/reportsApi.service";
import { ProductAdsApiService } from "./services/productAdsApi.service";

@Module({
    imports: [UserCredentialManagerModule, HttpModule],
    providers: [
        AxiosService,
        AdGroupsApiService,
        CampaignApiService,
        ProfileApiService,
        ReportsApiService,
        ProductAdsApiService,
    ],
    exports: [
        HttpModule,
        AdGroupsApiService,
        CampaignApiService,
        ProfileApiService,
        ReportsApiService,
        ProductAdsApiService,
    ],
})
export class AmazonSdkModule implements OnModuleInit {
    constructor(
        private readonly axiosService: AxiosService,
        private readonly httpService: HttpService,
        private readonly credentialsService: CredentialService,
    ) {}

    onModuleInit(): any {
        const { locationHost } = this.credentialsService.getUserCredentials();

        this.httpService.axiosRef.defaults.baseURL = locationHost;

        const credentialRequestInterceptor = this.axiosService.onRequestInterceptor;
        const refreshTokenResponseInterceptor = this.axiosService.onResponseInterceptor;

        this.httpService.axiosRef.interceptors.request.use(credentialRequestInterceptor);
        this.httpService.axiosRef.interceptors.response.use((v) => v, refreshTokenResponseInterceptor);
    }
}
