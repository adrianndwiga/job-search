export type Config = {
    jobSearchRequestConfig: {
        host: string,
        path: string
        method: "GET"
    },
    jobSearchItemKey: {
        identifier: string
        title: string
        salary: string
        location: string
        company: string
    }
}

export class A_2 {
    constructor(private readonly config: Config) {
    }
}