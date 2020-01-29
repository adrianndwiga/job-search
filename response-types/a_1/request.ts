import { AuthRequestConfig, JobSearchRequestConfig } from "./request-config";
import { AuthResponse, JobSearchResponse } from "./response";
import { IncomingMessage } from "http";
import * as https from 'https'
import { HttpsRequest } from "../types";
import { unzip } from "zlib";
import * as cheerio from "cheerio"
import * as url from 'url'
import * as querystring from 'querystring'

export type LoadRequestHeaders = (header: string) => {}
export type GetAuthResponseFromBody = (options: {content: string, sessionIdentifier: {cssSelector: string, attributeName: string}, host: string}) => AuthResponse

export class AuthRequest implements HttpsRequest<AuthRequestConfig, AuthResponse> {
    private getAuthResponseFromBody(content: string, host: string): { shid } {
        const $ = cheerio.load(content)
        const path = $(this.sessionIdentifier.cssSelector).attr(this.sessionIdentifier.attributeName)
        const query = url.parse(`${host}/${path}`).query
        const shid = querystring.parse(query)['shid'] as string
    
        return {
            shid
        }
    }

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
                    resolve(this.getAuthResponseFromBody(buffer.toString(), options.host))
                })
            })

            response.on('error', error => reject(error))
        })
    }
    constructor(
        private readonly loadHeaders: LoadRequestHeaders, 
        private readonly requestData: string, 
        private readonly sessionIdentifier: {
             cssSelector: string, 
             attributeName: string 
            }) {
    }
}

export class JobSearchRequest implements HttpsRequest<JobSearchRequestConfig, JobSearchResponse> {

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
                const responseData = JSON.parse(chunk) as { page: number, pageCount: number }
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

export const baseRequest = (options: https.RequestOptions, data = undefined): Promise<IncomingMessage> => {
    return new Promise<IncomingMessage>((resolve, reject) => {
        const request = https.request(options, response => {
            resolve(response)
        })
        if (data)
            request.write(data);
        request.end()
    })
}
