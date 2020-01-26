import { readFileSync } from "fs"

interface RequestConfig {
    host: string
    path: string
}

export class AuthRequest implements RequestConfig {
    constructor(headers: string) {
        const headerFields = readFileSync(headers, 'utf8')
        for(const field of headerFields.split('\n')) {
            const values = field.split(': ')
            this.headers[values[0]] = values[1]
        }
    }
    host: string
    path: string
    readonly headers: object
    method: "POST"
}

export interface JobSearchRequest extends RequestConfig {
    headers: object
    method: "POST"
}