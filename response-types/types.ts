interface ResponseReader<T> {
    read(responseBody: string): T
}