import * as https from 'https'

export function httpGet(url: string, cookie: string = ''): Promise<string> {
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
    })
}