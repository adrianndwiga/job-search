import { baseRequest } from "../../request"
import * as cheerio from 'cheerio'
import { Job } from "../types"

export type Config = {
    jobSearchRequestConfig: {
        host: string
        path: string
        method: "GET"
    },
    jobSearchResults: string
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
        console.log(config)
    }

    private getJobs(content: string): Job[] {
        const $ = cheerio.load(content)

        const results = $(this.config.jobSearchResults)
        for (let item of results) {
            console.log(
                {
                    title: $(this.config.jobSearchItemKey.title, item).text(),
                    location: $(this.config.jobSearchItemKey.location, item).text().replace('\n', '').trim(),
                    salary: $(this.config.jobSearchItemKey.salary, item).text(),
                    company: $(this.config.jobSearchItemKey.company, item).text()
                })
        }
        return []
    }

    run() {
        baseRequest({
            host: this.config.jobSearchRequestConfig.host,
            path: this.config.jobSearchRequestConfig.path,
            method: this.config.jobSearchRequestConfig.method
        }).then(response => {
            let str = ''
            response.on('data', data => str += data)
            response.on('end', () => this.getJobs(str))
        })
    }

}