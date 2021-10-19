import http, { IncomingMessage } from 'http'
import WebSocket, { Server } from 'ws'
import net from 'net'
let uid = 0x123

export class UIDWebSocket extends WebSocket {
  uid: number
}

export function startWSClient() {
  const activeClients = new Map()
  const baseServer = http.createServer().listen(1234)
  const wsServer = new Server({ noServer: true })


  baseServer.on('upgrade', function upgrade(request, socket: any, head) {
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
  })
  wsServer.on('connection', (server: UIDWebSocket, request: IncomingMessage) => {
    const { url, headers } = request
    server.uid = uid++
    console.log('connected', headers)
    const stream = WebSocket.createWebSocketStream(server)
    const host = '127.0.0.1'
    const connection = net.createConnection({
      host,
      port: 5432
    })
    connection.on('connect', () => {
      stream.pipe(connection).pipe(stream)
    })
    connection.on('error', (err: Error) => {
      console.log(err)
    })
    // stream.write('hello')
  })
}

startWSClient()