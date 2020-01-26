import { readFileSync } from "fs"

interface RequestConfig {
    host: string
    path: string
    method: 'POST'
}

export interface AuthRequestConfig extends RequestConfig {
//     constructor(headers: string) {
//         const headerFields = readFileSync(headers, 'utf8')
//         for(const field of headerFields.split('\n')) {
//             const values = field.split(': ')
//             this.headers[values[0]] = values[1]
//         }
//     }
    // host: string
    // path: string
    headers: string
    // method: "POST"
}

export interface JobSearchRequestConfig extends RequestConfig {
    headers: object
    // method: "POST"
}