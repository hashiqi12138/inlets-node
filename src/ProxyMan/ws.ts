import { ProxyService } from "./http";
import { IncomingMessage, ServerResponse } from "http";
import WebSocket from "ws";
import { Socket } from "net";

export interface WSProxyService {
  serve(socket: Socket);
}

const defaultService: WSProxyService = {
  serve(socket: Socket) {
    const prefix = "ws://localhost:1234";
    const connection = new WebSocket(prefix, {
      headers: {},
    });

    const stream = WebSocket.createWebSocketStream(connection);
    connection.onopen = () => {
      // req.pipe(stream)
      socket
        .pipe(stream)
        
        .pipe(socket)
    };
  },
};

export class WebSocketProxyMan {
  static processRequest(socket: Socket) {
    const service = this.selectService();
    service.serve(socket);
  }

  static selectService() {
    return defaultService;
  }
}
