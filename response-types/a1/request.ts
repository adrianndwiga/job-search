import { AuthRequestConfig } from "./request-config"
import { AuthResponse } from "./response"
import { HttpsRequest } from "../types"
import { unzip } from "zlib"
import * as cheerio from "cheerio"
import * as url from 'url'
import * as querystring from 'querystring'
import { baseRequest } from "../../request"

export type LoadRequestHeaders = (header: string) => {}
export type GetAuthResponseFromBody = (options: {content: string, sessionIdentifier: {cssSelector: string, attributeName: string}, host: string}) => AuthResponse

export class AuthRequest implements HttpsRequest<AuthRequestConfig, AuthResponse> {
    private getAuthResponseFromBody(content: string, host: string): { shid: string } {
        const $ = cheerio.load(content)
        const path = $(this.sessionIdentifier.cssSelector).attr(this.sessionIdentifier.attributeName)
        const query = url.parse(`${host}/${path}`).query
        const shid = querystring.parse(query as string).shid as string

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


