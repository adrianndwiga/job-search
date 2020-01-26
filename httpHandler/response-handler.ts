import { IncomingMessage } from "http";

export interface ConfigResponse {
    
}

interface ResponseReader<T> {
    read(responseBody: string): T
}

export interface JSAuthResponse {
    shid: string
}

export class JSAuthResponseReader implements ResponseReader<JSAuthResponse> {
    read(responseBody: string): JSAuthResponse {
        return {
            shid: ''
        }
    }
}

export interface JSJobSearchResponse {
    page: number
    pageCount: number
}

export class JSJobSearchResponseReader implements ResponseReader<JSJobSearchResponse> {
    read(responseBody: string): JSJobSearchResponse {
        return {
            page: 0,
            pageCount: 0
        };
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
