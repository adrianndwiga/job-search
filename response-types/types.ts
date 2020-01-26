import { RequestOptions } from "https";
import { IncomingMessage } from "http";

export interface ResponseReader<T> {
    read(responseBody: string): T
}

export interface HttpsRequest {
    request(options: RequestOptions): Promise<IncomingMessage>
}
