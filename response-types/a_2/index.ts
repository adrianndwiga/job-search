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
        identifier: {
            cssSelector: string
            attributeName: string
        }
        title: string
        salary: string
        location: string
        company: string
        jobUrl: {
            cssSelector: string
            attributeName: string
        }
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
                    id: $(item).attr(this.config.jobSearchItemKey.identifier.attributeName),
                    title: $(this.config.jobSearchItemKey.title, item).html(),
                    location: $(this.config.jobSearchItemKey.location, item).text().replace('\n', '').trim(),
                    salary: $(this.config.jobSearchItemKey.salary, item).text(),
                    company: $(this.config.jobSearchItemKey.company, item).text(),
                    jobUrl: $(this.config.jobSearchItemKey.jobUrl.cssSelector, item).attr(this.config.jobSearchItemKey.jobUrl.attributeName)
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