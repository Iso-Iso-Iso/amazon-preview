import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ReportBodySchema } from "../types/reports";
import { unzip } from "node:zlib";
import { map, switchMap } from "rxjs";
import { promisify } from "node:util";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

@Injectable()
export class ReportsApiService {
    constructor(private readonly httpService: HttpService) {}

    getReport(reportId: string, profileId: number) {
        return this.httpService.get(`/reporting/reports/${reportId}`, {
            headers: {
                "Amazon-Advertising-API-Scope": profileId,
            },
        });
    }

    getUncompressedData(url: string) {
        return this.httpService
            .get(url, {
                responseType: "arraybuffer",
                decompress: true,
                validateStatus: null,
            })
            .pipe(
                switchMap((item) => {
                    const buff = Buffer.from(item.data);
                    const asyncUnzip = promisify(unzip);

                    const promise = asyncUnzip(buff).then((res) => JSON.parse(res.toString()));
                    return fromPromise(promise);
                }),
            );
    }

    createReport(profileId: number, configuration: ReportBodySchema) {
        return this.httpService.post("/reporting/reports", configuration, {
            headers: {
                "Amazon-Advertising-API-Scope": profileId,
            },
        });
    }
}
