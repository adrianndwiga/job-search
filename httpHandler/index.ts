import { IncomingMessage } from "http"
import { RequestOptions } from "https"

interface ConfigRequest {
    host: string,
    path: string,
    headers: string | object,
    method: 'POST' | 'GET'
}

interface ConfigResponse {

}

class HttpHandler {
    private request: RequestOptions
    private response: IncomingMessage
    private postBody: string

    constructor(private key: string, private configRequest: ConfigRequest, private configResponse: ConfigResponse) {
    }
}

class HttpHandlers  {
    private handlers: HttpHandler[]

    add(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

        })
    }
}
