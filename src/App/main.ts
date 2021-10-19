import { HttpProxyMan } from './../ProxyMan/http'
import { WebSocketProxyMan } from './../ProxyMan/ws'
import http, { IncomingMessage, ServerResponse } from 'http'
import net from 'net'
const PORT_MAX_NUMBER = 65535


export async function start(port = 3000) {
  const server = net.createServer((c) => {
    // 'connection' 监听器。
    WebSocketProxyMan.processRequest(c)
  });
  const portValid = await findPortNotInUse(port)
  console.log(portValid)
  server.listen(portValid)
}

function findPortNotInUse(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    let portTrying = startPort
    let serverTrying: http.Server
    serverTrying = http.createServer()
      .listen(startPort)
    serverTrying.on('listening', function () { // 执行这块代码说明端口未被占用
      serverTrying.close() // 关闭服务
      console.log('The port【' + portTrying + '】 is available.') // 控制台输出信息
      resolve(portTrying)
    })

    serverTrying.on('error', function (err: any) {
      if (err.code === 'EADDRINUSE') { // 端口已经被使用
        console.log('The port【' + portTrying + '】 is occupied, please change other port.')
        portTrying++
        resolve(findPortNotInUse(portTrying))
      }
    })
  })
}