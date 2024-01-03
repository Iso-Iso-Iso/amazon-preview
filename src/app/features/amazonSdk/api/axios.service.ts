import { Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { CredentialService } from "../../userCredentialManager/services/credential.service";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AxiosService {
    constructor(
        private readonly credentialService: CredentialService,
        private readonly httpService: HttpService,
    ) {
        this.onRequestInterceptor = this.onRequestInterceptor.bind(this);
        this.onResponseInterceptor = this.onResponseInterceptor.bind(this);
    }

    onRequestInterceptor(
        value: InternalAxiosRequestConfig<any>,
    ): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> {
        const { clientId, accessToken } = this.credentialService.getUserCredentials();

        value.headers.set("Amazon-Advertising-API-ClientId", clientId);
        value.headers.set("Authorization", `Bearer ${accessToken}`);

        return value;
    }

    async onResponseInterceptor(error: AxiosError) {
        console.log("intercept");
        console.log(error.response.status);
        if (error.response.status !== 401 || (error.response.status === 401 && error.request.isRefreshed)) {
            // TODO: handle error on request
            console.log("in");
            return error;
        }
        error.request.isRefreshed = true;

        const refreshed = await this.credentialService.issueNewTokens();
        // console.log(error.config, "error.request.headers");
        return this.httpService.axiosRef.request(error.config);
    }
}
