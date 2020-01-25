import * as https from 'https'
import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';

interface ConfigRequest {
    host: string,
    path: string,
    headers: string | object,
    method: 'POST' | 'GET'
}

class RequestHandler {
    private readonly requestHeaders: any;

    constructor(private configRequest: ConfigRequest) {
        if (typeof(configRequest.headers) === 'string') {
            this.requestHeaders = this.getHeaders()
        }    
    }

    private getHeaders(): any {
        if (typeof(this.configRequest.headers) === 'string') {
            const headers = readFileSync(`${this.configRequest.headers}`, 'utf8')
    
            const requestHeaders = {}
    
            const addRequestHeaders = (v: string[]) => {
                requestHeaders[v[0]] = v[1]
            }
            
            for(const header of headers.split('\n'))
                addRequestHeaders(header.split(': '))
    
            return requestHeaders
        }
        else 
            return this.configRequest.headers
    }

    send(data: string = ''): Promise<IncomingMessage> {
        return new Promise<IncomingMessage>((resolve, request) => {
            const req = https.request({
                hostname: this.configRequest.host,
                port: 443,
                path: this.configRequest.path,
                method: this.configRequest.method,
                headers: this.requestHeaders,
              }, (response: IncomingMessage) => {
                  resolve(response)
              })
              
              if (data !== '')
                req.write(data)
              req.end()
        })
    }
}