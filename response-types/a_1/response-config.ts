export interface ResponseConfig {}

export interface AuthResponseConfig extends ResponseConfig {
    shid: {
        'css-selector': {
            path: string,
            '@shid': string
        }
    }
}

export interface JobSearchResponseConfig extends ResponseConfig {
    page: string
    pageCount: string
}
