export interface ResponseReader<T> {
    read(responseBody: string): T
}

export interface HttpsRequest<T1, T2> {
    request(options: T1): Promise<T2>
}
