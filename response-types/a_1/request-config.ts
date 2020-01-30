interface RequestConfig {
    host: string
    path: string
    method: 'POST'
}

export interface AuthRequestConfig extends RequestConfig {
    headers: string
}

export interface JobSearchRequestConfig extends RequestConfig {
    headers: {}
}