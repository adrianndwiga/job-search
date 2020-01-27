import * as https from 'https'
// import * as request from 'request'

type GetResponse = string | { content, cookie }

export function httpGet(url: string, cookie: string = '', returnCookie: boolean = false): Promise<GetResponse> {
    return new Promise<GetResponse>((resolve, reject) => {
        https.get(url, { headers: {'cookie': cookie}}, response => {
            let data = ''
        
            response.on('data', chunk => {
                data += chunk
            })

            
        
            response.on('end', () => {
                returnCookie ? resolve({
                    content: data,
                    cookie: JSON.stringify(response.headers, null, 4)
                }) : resolve(data)
            })
        }).on('error', err => {
            console.log('error retrieving request')
            reject(`Error: ${err.message}`)
        })
    })
}

export function httpPost(url: {
    host: string, 
    path: string, 
    headers: { 
        contentType: string, 
        cookie: string }
    }, 
    data: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const options = {
            hostname: url.host,
            port: 443,
            path: url.path,
            method: 'POST',
            headers: {
              'Cookie': url.headers.cookie
            }
          }

        const req = https.request(options, (response) => {
            response.on('data', d => resolve((d as Buffer).toString()))
        });
        
        req.on('error', error => reject(error))
        req.write(data)
        req.end()

    })
}