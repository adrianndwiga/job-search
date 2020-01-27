import { RequestOptions } from "https";
import { IncomingMessage } from "http";

export interface ResponseReader<T> {
    read(responseBody: string): T
}

export interface HttpsRequest<T> {
    request(options: RequestOptions): Promise<T>
}
