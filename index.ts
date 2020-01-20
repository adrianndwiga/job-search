// import * as https from 'https'
import * as cheerio from 'cheerio'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readFile, writeFile } from 'fs'
import { httpGet } from './http-request'

const config = JSON.parse(readFileSync('config.json', 'utf8'))

interface JobSearchSetting {
    url: string,
    title: string,
    baseUrl: string,
    cookie: string,
    result: string,
    detail: {
        title: string,
        company: string,
        salary: string,
        location: string,
        link: string
    }
}

interface Job {
    title: string
    company: string
    salary: string
    location: string
    link: string
}

interface Jobs {
    jobSearch: JobSearchSetting
    jobs: Job[]
}

// function request(url: string, cookie: string = ''): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//         https.get(url, { headers: {'cookie': cookie}}, response => {
//             let data = ''
        
//             response.on('data', chunk => {
//                 data += chunk
//             })
        
//             response.on('end', () => {
//                 resolve(data)
//             })
//         }).on('error', err => {
//             console.log('error retrieving request')
//             reject(`Error: ${err.message}`)
//         })
//     })
// }

function loadJobs(data: string, config: {
    url: string,
    result: string,
    detail: {
        title: string,
        company: string,
        salary: string,
        location: string,
        link: string
    }
}): Job[] {
    const $ = cheerio.load(data)
    let jobs: Job[] = []
    let elements = $(config.result)
    let element = elements.first()

    while(element.html() !== null) {
        const title = $(config.detail.title, element).text().replace(/(\r\n|\n|\r)/gm, '')
        if(title !== '')
            jobs.push({ 
                title: title,
                company: $(config.detail.company, element).text().replace(/(\r\n|\n|\r)/gm, '').trim(),
                salary: $(config.detail.salary, element).text().replace(/(\r\n|\n|\r)/gm, ''),
                location: $(config.detail.location, element).text().replace(/(\r\n|\n|\r)/gm, '').trim(),
                link:  $(config.detail.link, element).attr('href')
            })
        element = element.next()
    }

    return jobs
}

async function loadPage(jobSearch: {
    url: string,
    title: string,
    baseUrl: string,
    cookie: string,
    result: string,
    detail: {
        title: string,
        company: string,
        salary: string,
        location: string,
        link: string
    }
}) {

    const current = new Date()
    const folder = `../_store/job-search/${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`

    if(!existsSync(folder))
        mkdirSync(folder)
    const downloadedFile = `${jobSearch.title}`;
    if (!existsSync(`${folder}/${downloadedFile}.json`)) {
        const response = await httpGet(jobSearch.url, jobSearch.cookie)
        const jobs = loadJobs(response, jobSearch)
        const js: Jobs = {jobSearch, jobs }
        const filePath = `${folder}/${downloadedFile}.json`
        writeFileSync(filePath, JSON.stringify(js, null, 4), 'utf8')
        await addMessageToQueue(filePath)
    }
}

async function addMessageToQueue(filePath: string): Promise<void> {
    const jobQueue = `../_queues/jobs-queue.json`
    
    return new Promise<void>((resolve, reject) => {
        readFile(jobQueue, 'utf8', (err, data) => {
            const queue = JSON.parse(data).concat(filePath)
            writeFile(jobQueue, JSON.stringify(queue, null, 4), 'utf8', (err) => {
                if (err) 
                    reject(err)
                resolve()
            })
        })
    })
}

(async () => {
    for(let c in config)
      await loadPage(config[c])
})();
