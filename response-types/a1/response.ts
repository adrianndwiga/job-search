import { AuthResponseConfig } from "./response-config"
import * as cheerio from 'cheerio'
import { ResponseReader } from "../types"

export interface AuthResponse {
    shid: string
}

export class AuthResponseReader implements ResponseReader<AuthResponse> {
    constructor(private configResponse: AuthResponseConfig) { }

    read(responseBody: string): AuthResponse {
        const $ = cheerio.load(responseBody)
        const path = this.configResponse.shid["css-selector"].path
        const shid =  this.configResponse.shid["css-selector"]["@shid"]

        return {
            shid: $(path).attr(shid) as string
        }
    }
}

export interface JobSearchResponse {
    page: number
    pageCount: number
    items?: any
}
