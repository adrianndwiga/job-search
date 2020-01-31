import { baseRequest } from "../../request"
import * as cheerio from 'cheerio'
import { Job } from "../types"
import { writeFileSync } from "fs"

export type Config = {
    outputFile: string
    jobSearchRequestConfig: {
        host: string
        path: string
        method: "GET"
    },
    jobSearchResults: string
    jobSearchItemKey: {
        identifier: {
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
    }

    private getJobs(content: string): Job[] {
        const $ = cheerio.load(content)

        const results = $(this.config.jobSearchResults)
        const key = this.config.jobSearchItemKey
        let jobs: Job[] = []
        for (let item of results as any) {

            jobs.push(
                {
                    id: $(item).attr(key.identifier.attributeName),
                    title: $(key.title, item).html(),
                    location: $(key.location, item).text().replace('\n', '').trim(),
                    salary: $(key.salary, item).text(),
                    company: $(key.company, item).text(),
                    jobUrl: $(key.jobUrl.cssSelector, item).attr(key.jobUrl.attributeName)
                })
        }
        return jobs
    }

    run() {
        const requestConfig = this.config.jobSearchRequestConfig
        baseRequest({
            host: requestConfig.host,
            path: requestConfig.path,
            method: requestConfig.method
        }).then(response => {
            let str = ''
            response.on('data', data => str += data)
            response.on('end', () => writeFile(this.config.outputFile, this.getJobs(str)))
        })
    }

}

export function writeFile(outputFile: string, jobs: Job[]): void {
    writeFileSync(outputFile, JSON.stringify(jobs, null, 4), 'utf8')
}
