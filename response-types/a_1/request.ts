import { AuthRequestConfig, JobSearchRequestConfig } from "./request-config";
import { AuthResponse, JobSearchResponse } from "./response";
import { IncomingMessage } from "http";
import * as https from 'https'
import { HttpsRequest } from "../types";
import { resolve } from "dns";

export class AuthRequest {
    constructor(config: AuthRequestConfig) {
    }
}

export class JobSearchRequest implements HttpsRequest<{page: number, shid: string}> {

    request(options: https.RequestOptions): Promise<{page: number, shid: string}> {
        return new Promise<{page: number, shid: string}>((resolve, reject) => {
            baseRequest(options)
            .then(response => {
                let chunk = ''
                response.on('data', data => chunk += data)
                response.on('end', () => {
                    resolve({
                        page: 1,
                        shid: this.authResponse.shid
                    })
                })
            })
        });
    }

    constructor(
        private config: JobSearchRequestConfig, 
        private authResponse: AuthResponse, 
        private jobSearchResponse: JobSearchResponse) {  
    }
}

export const baseRequest = (options: https.RequestOptions, data = undefined) : Promise<IncomingMessage> => {
    return new Promise<IncomingMessage>((resolve, reject) => {
        const request = https.request(options, response => {
            resolve(response)
        })
        if (data)
            request.write(data);
        request.end()
    })
}
