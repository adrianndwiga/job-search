import { IncomingMessage } from "http";

export interface ConfigResponse {
    
}

export class JSAuthResponse {
    shid: string

}

export class JSJobSearchResponse {
    page: number
    pageCount: number
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
