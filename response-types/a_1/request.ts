import { AuthRequestConfig, JobSearchRequestConfig } from "./request-config";
import { AuthResponse, JobSearchResponse } from "./response";
import { IncomingMessage } from "http";
import * as https from 'https'
import { HttpsRequest } from "../types";
import { unzip } from "zlib";

export type LoadRequestHeaders = (header: string)  => {}
export type GetAuthResponseFromBody = (content: string) => AuthResponse

export class AuthRequest implements HttpsRequest<AuthRequestConfig, AuthResponse> {
    request(options: AuthRequestConfig): Promise<AuthResponse> {
        return new Promise<AuthResponse>(async (resolve, reject) => {
            const response = await baseRequest({
                host: options.host, 
                path: options.path,
                method: options.method,
                headers: this.loadHeaders(options.headers)
            }, this.requestData)

            let returnedResponse: Buffer

            response.on('data', data => {
                returnedResponse = data
            })

            response.on('end', () => {
                unzip(returnedResponse, (err, buffer) => {
                    resolve(this.getAuthResponseFromBody(buffer.toString()))
                })
            })

            response.on('error', error => reject(error))
        })
    }
    constructor(private readonly loadHeaders: LoadRequestHeaders, private readonly requestData: string, private readonly getAuthResponseFromBody: GetAuthResponseFromBody) {
    }
}

export class JobSearchRequest implements HttpsRequest<JobSearchRequestConfig, JobSearchResponse> {

    request(options: JobSearchRequestConfig): Promise<JobSearchResponse> {
        return new Promise<JobSearchResponse>( async (resolve, reject) => {
            const requestOptions: https.RequestOptions = {
                host: options.host,
                path: options.path,
                port: 443,
                method: options.method,
                headers: options.headers
            }

            let counter: number = 1
            let i: JobSearchResponse = {page: counter, pageCount: counter}
            while (i.page <= i.pageCount) {
                const response = await baseRequest(requestOptions, {
                    page: 1,
                    shid: this.authResponse.shid
                })
                let chunk = ''
                response.on('data', data => chunk += data)
                response.on('end', () => {
                    // resolve({
                    //     page: 1,
                    //     pageCount: 1
                    // })
                    const responseData = JSON.parse(chunk) as {page: number, pageCount: number}
                    counter += 1
                    i.page = counter
                    i.pageCount = responseData.pageCount
                })
            }

            // baseRequest(requestOptions, {
            //     page: 1,
            //     shid: this.authResponse.shid
            // })
            // .then(response => {
            //     let chunk = ''
            //     response.on('data', data => chunk += data)
            //     response.on('end', () => {
            //         resolve({
            //             page: 1,
            //             pageCount: 1
            //         })
            //     })
            // })
        })
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
