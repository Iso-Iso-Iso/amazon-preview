import { Injectable } from "@nestjs/common";
import * as process from "process";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class CredentialService {
    // TODO: use configure module
    private accessToken = process.env.API_ACCESS_TOKEN;
    private refreshToken = process.env.API_REFRESH_TOKEN;
    private locationHost = process.env.API_LOCATION_HOST;
    private clientId = process.env.API_CLIENT_ID;
    private clientSecret = process.env.API_CLIENT_SECRET;

    constructor(private readonly httpService: HttpService) {}

    public getUserCredentials() {
        return {
            clientId: this.clientId,
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            locationHost: this.locationHost,
        };
    }

    public async issueNewTokens() {
        try {
            const res = await this.httpService.axiosRef.post("https://api.amazon.com/auth/o2/token", {
                grant_type: "refresh_token",
                client_id: this.clientId,
                refresh_token: this.refreshToken,
                client_secret: this.clientSecret,
            });

            const { data } = res;

            this.refreshToken = data.refresh_token;
            this.accessToken = data.access_token;
            console.log("log new token issued");
            return res;
        } catch (e) {
            console.log(e);
            console.log("refresh error");
        }
    }
}
