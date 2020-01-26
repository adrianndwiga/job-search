interface RequestConfig {
    host: string
    path: string
    getHeaders(): object
}

interface AuthRequest extends RequestConfig {
    headers: string
    method: "POST"
}

interface JobSearchRequest extends RequestConfig {
    headers: string
    method: "POST"
}