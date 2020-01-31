import * as https from 'https'
import { IncomingMessage } from 'http'

export const baseRequest = (options: https.RequestOptions, data = ''): Promise<IncomingMessage> => {
    return new Promise<IncomingMessage>((resolve, reject) => {
        const request = https.request(options, response => {
            resolve(response)
        })
        if (data !== '')
            request.write(data);
        request.end()
    })
}
