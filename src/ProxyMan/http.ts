import http, { IncomingMessage, ServerResponse } from 'http'

export const ServiceHeader = 'Proxy-Service-Token'

export interface ProxyService {
  serve(req: IncomingMessage, res: ServerResponse): void
}

export const defaultService: ProxyService = {
  serve(req, res) {
    res.statusCode = 404
    res.end()
  }
}

export const huyaService: ProxyService = {
  serve(req, res) {
    const host = 'codeplay.dev.hikhub.net'
    const { url, method, headers } = req
    const reqOptions = {
      path: url,
      headers: {
        ...headers,
        host
      },
      method,
      port: 80,
      host
    }
    const serviceReq = http.request(reqOptions, (serviceRes: IncomingMessage) => {
      for (const key in serviceRes.headers) {
        res.setHeader(key, serviceRes.headers[key])
      }
      serviceRes.on('close', () => {
        // res.socket.destroy()
      })
      serviceRes.on('data', (data: Buffer) => {
        res.write(data)
      })
      serviceRes.on('end', () => {
        res.end()
      })
      serviceRes.on('error', () => {
        res.statusCode = 500
        res.end()
      })
    })
    serviceReq.on('error', () => {

    })
    req.on('data', (data) => {
      serviceReq.write(data)
    })
    req.on('end', () => {
      serviceReq.end()
    })
  }
}

export const baiduService: ProxyService = {
  serve(req, res) {
    const host = 'www.baidu.com'
    const { url, method, headers } = req
    const reqOptions = {
      url: url,
      headers: {
        ...headers,
        host
      },
      method,
      port: 80,
      host: host
    }
    const serviceReq = http.request(reqOptions, (serviceRes: IncomingMessage) => {
      for (const key in serviceRes.headers) {
        res.setHeader(key, serviceRes.headers[key])
      }
      serviceRes.on('close', () => {
        // res.socket.destroy()
      })
      serviceRes.on('data', (data: Buffer) => {
        res.write(data)
      })
      serviceRes.on('end', () => {
        res.end()
      })
      serviceRes.on('error', () => {
        res.statusCode = 500
        res.end()
      })
    })
    serviceReq.on('error', () => {

    })
    req.on('data', (data) => {
      serviceReq.write(data)
    })
    req.on('end', () => {
      serviceReq.end()
    })
  }
}

export class HttpProxyMan {
  static processRequest(req: IncomingMessage, res: ServerResponse) {
    const { url, socket, headers } = req
    console.log(url, headers)
    const token = headers[ServiceHeader.toLowerCase()]
    const service = this.selectService(token)
    service.serve(req, res)
  }

  static selectService(token): ProxyService {
    if (!token) {
      return huyaService
    }
    switch (token) {
      case 'huya':
        return huyaService
      case 'baidu':
        return baiduService
      default:
        return defaultService
    }
  }
}