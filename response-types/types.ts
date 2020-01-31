export interface ResponseReader<T> {
    read(responseBody: string): T
}

export interface HttpsRequest<T1, T2> {
    request(options: T1): Promise<T2>
}

export interface Job {
    id: string
    title: string
    salary: string
    location: string
    jobUrl: string,
    company?: string
}

type SalaryGrouping = {
    key: string,
    Jobs: Job[]
}

export class JobsGroupedBySalary {
    salaries: SalaryGrouping[] = []
    
    constructor(jobs: Job[]) {
        for(let job of jobs) {
            const salary = this.salaries
                .find(s => s.key === job.salary.replace(/ /g, '').toLowerCase())
            if (salary) {
                salary.Jobs = salary.Jobs.concat(job)
            } else {
                this.salaries.push({
                    key: job.salary.replace(/ /g, '').toLowerCase(),
                    Jobs: [job]
                })
            }
        }
        
    }
}