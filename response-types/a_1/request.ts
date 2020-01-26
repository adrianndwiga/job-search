import { AuthRequestConfig, JobSearchRequestConfig } from "./request-config";
import { AuthResponse, JobSearchResponse } from "./response";
import { IncomingMessage } from "http";
import * as https from 'https'
import { HttpsRequest } from "../types";

export class AuthRequest {
    constructor(config: AuthRequestConfig) {
    }
}

export class JobSearchRequest implements HttpsRequest {

    request(options: https.RequestOptions): Promise<IncomingMessage> {
        throw new Error("Method not implemented.");
    }

    constructor(
        private config: JobSearchRequestConfig, 
        private authResponse: AuthResponse, 
        private jobSearchResponse: JobSearchResponse) {  
    }
}

export const request = (options: https.RequestOptions, data = undefined) : Promise<IncomingMessage> => {
    return new Promise<IncomingMessage>((resolve, reject) => {
        const request = https.request(options, response => {
            resolve(response)
        })
        if (data)
            request.write(data);
        request.end()
    })
}