import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
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
        if (value.responseType === "arraybuffer") {
            return value;
        }

        const { clientId, accessToken } = this.credentialService.getUserCredentials();

        value.headers.set("Amazon-Advertising-API-ClientId", clientId);
        value.headers.set("Authorization", `Bearer ${accessToken}`);

        return value;
    }

    async onResponseInterceptor(error: AxiosError) {
        if (error.response.status !== 401 || (error.response.status === 401 && error.request.isRefreshed)) {
            console.log(error);
            // TODO: handle error on request
            throw new Error("error");
            // return error;
        }
        error.request.isRefreshed = true;

        await this.credentialService.issueNewTokens();

        return this.httpService.axiosRef.request(error.config);
    }
}
