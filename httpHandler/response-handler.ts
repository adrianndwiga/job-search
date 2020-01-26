import { IncomingMessage } from "http"
import * as cheerio from 'cheerio'

export interface ConfigResponse {
    
}

interface ResponseReader<T> {
    read(responseBody: string): T
}

export interface JSAuthResponseConfig {
    shid: {
        'css-selector': {
            path: string,
            '@shid': string
        }
    }
}

export interface JSAuthResponse {
    shid: string
}

export class JSAuthResponseReader implements ResponseReader<JSAuthResponse> {
    /**
     *
     */
    constructor(private configResponse: JSAuthResponseConfig) {
        // super();
        
    }

    read(responseBody: string): JSAuthResponse {
        const $ = cheerio.load(responseBody)
        return {
            shid: $(this.configResponse.shid["css-selector"].path)
                    .attr(this.configResponse.shid["css-selector"]["@shid"])
        }
    }
}

export interface JSJobSearchResponse {
    page: number
    pageCount: number
}

export class JSJobSearchResponseReader implements ResponseReader<JSJobSearchResponse> {
    read(responseBody: string): JSJobSearchResponse {
        const data = JSON.parse(responseBody)
        return {
            page: data.page,
            pageCount: data.pageCount
        }
    }
}

type Reader<T> = (response: IncomingMessage) => Promise<T>

function callback(response: IncomingMessage): Promise<string> {

    return new Promise<string>((resolve, reject) => {
        let chunk = ''

        response.on('data', data => {
            chunk += data
        })
    
        response.on('end', () => {
            resolve(chunk)
        })
    })
}

export class ResponseHandler<T> {
    constructor(private configResponse: ConfigResponse, private response: IncomingMessage, private reader: Reader<T> ) {
        
    }

    read<T>(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.reader(this.response)
        });
    }
}
