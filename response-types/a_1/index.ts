import { AuthRequestConfig, JobSearchRequestConfig } from "./request-config"
import { readFileSync, writeFileSync } from "fs"
import { AuthRequest, JobSearchRequest } from "./request"
import { Job } from "../types"

export class A_1 {
    /**
     *
     */
    private readonly authRequestConfig: AuthRequestConfig

    private loadHeaders(file: string): {} {
        let headers = {}
        const lines = readFileSync(file, 'utf8').split('\n')
    
        for(const line of lines) {
            const values = line.split(': ')
            headers[values[0]] = values[1]
        }
    
        return headers
    }

    private readonly authRequest: AuthRequest

    constructor(private readonly config: any) {
        this.authRequestConfig = config.authRequestConfig as AuthRequestConfig
        this.authRequest = new AuthRequest(this.loadHeaders, config.postData, this.config.sessionIdentifier)
    }

    async run() {
        let jobs: Job[] = []
    
        const authResult = await this.authRequest.request(this.authRequestConfig)
        const jobSearchRequestConfig = this.config.jobSearchRequestConfig as JobSearchRequestConfig
        const jobSearchRequest = new JobSearchRequest(jobSearchRequestConfig, authResult, {page: 1, pageCount: 1})
    
        const jobSearchResponse = await jobSearchRequest.request(jobSearchRequestConfig)
        const jobSearchItemKey = this.config.jobSearchItemKey
    
        jobs = jobSearchResponse.items.map(i => {
            return {
                id: i[jobSearchItemKey.identifier],
                title: i[jobSearchItemKey.title],
                salary: i[jobSearchItemKey.salary],
                location: i[jobSearchItemKey.location],
                jobUrl: `${this.config["jobUrl"]}${i[jobSearchItemKey.identifier]}`
            }
        })
        let jobSearchResponses = []
    
        if (jobSearchResponse.pageCount > jobSearchResponse.page) {
            for(let start = jobSearchResponse.page + 1; start <= jobSearchResponse.pageCount; start++) {
                const jobSearchRequest = new JobSearchRequest(jobSearchRequestConfig, authResult, {page: start, pageCount: 1})
                const response = await jobSearchRequest.request(jobSearchRequestConfig)
                jobSearchResponses.push(await jobSearchRequest.request(jobSearchRequestConfig))
    
                jobs = jobs.concat(response.items.map(i => {
                    return {
                        id: i[jobSearchItemKey.identifier],
                        title: i[jobSearchItemKey.title],
                        salary: i[jobSearchItemKey.salary],
                        location: i[jobSearchItemKey.location],
                        jobUrl: `${this.config["jobUrl"]}${i[jobSearchItemKey.identifier]}`
                    }
                }))
            }
        }
        writeFileSync(this.config.outputFile, JSON.stringify(jobs, null, 4), 'utf8')
        console.log(jobs.length, jobSearchResponses.length)
    }
}
