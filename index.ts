import * as https from 'https'
import * as cheerio from 'cheerio'
import { readFileSync } from 'fs'

const config = JSON.parse(readFileSync('config.json', 'utf8'))

interface Job {
    title: string
    company: string
    salary: string
    location: string
    link: string
}

function request(url: string, cookie: string = ''): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        https.get(url, { headers: {'cookie': cookie}}, response => {
            let data = ''
        
            response.on('data', chunk => {
                data += chunk
            })
        
            response.on('end', () => {
                resolve(data)
            })
        }).on('error', err => {
            console.log('error retrieving request')
            reject(`Error: ${err.message}`)
        })

        // req.setHeader('cookie', cookie)
    })
}

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

async function loadPage(d: {
    url: string,
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
    const response = await request(d.url, d.cookie)
    const jobs = loadJobs(response, d)
    console.log(jobs)
}

for(let c in config)
    loadPage(config[c])