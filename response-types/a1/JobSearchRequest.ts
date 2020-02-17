import { JobSearchRequestConfig } from "./request-config"
import { AuthResponse, JobSearchResponse } from "./response"
import { HttpsRequest } from "../types"
import { baseRequest } from "../../request"
import * as https from 'https'

export class JobSearchRequest implements
                    HttpsRequest<JobSearchRequestConfig, JobSearchResponse> {

    request(options: JobSearchRequestConfig): Promise<JobSearchResponse> {
        return new Promise<JobSearchResponse>(async (resolve, reject) => {
            const requestOptions: https.RequestOptions = {
                host: options.host,
                path: options.path,
                port: 443,
                method: options.method,
                headers: options.headers
            }
            const response = await baseRequest(requestOptions, JSON.stringify({
                page: this.jobSearchResponse.page,
                shid: this.authResponse.shid
            }))
            let chunk = ''
            response.on('data', data => chunk += data)
            response.on('end', () => {
                const responseData = JSON.parse(chunk) as {
                    page: number;
                    pageCount: number;
                }
                resolve(responseData)
            })
        })
    }

    constructor(
        private config: JobSearchRequestConfig,
        private authResponse: AuthResponse,
        private jobSearchResponse: JobSearchResponse) {
    }
}
