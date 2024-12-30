import { safeJson } from "../helpers/safe-json";
import { DataBridgeEngine, DataBridgeEngineHandler } from "../types";

export class WebSocketEngine implements DataBridgeEngine {
    private socket!: WebSocket;

    constructor(url: string) {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {};
        this.socket.onclose = (event: CloseEvent) => {
            if (event.wasClean) {
                console.log("Соединение закрыто");
            } else {
                console.log("Обрыв соединения");
            }

            console.log("Код: " + event.code + " причина: " + event.reason);
        };

        this.socket.onerror = (error: any) => {
            console.log("Ошибка подключения ws: " + error.message);
        };
    }
    send(data: any) {
        if (!this.socket.readyState) {
            setTimeout(() => this.send(data), 100);
        } else {
            if (this.socket.readyState === WebSocket.OPEN)
                this.socket.send(JSON.stringify(data));
        }
    }

    subscribe(handler: DataBridgeEngineHandler) {
        this.socket.onmessage = function (message) {
            const data = safeJson(message.data, message.data);
            handler(data);
        };
    }

    destroy() {
        this.socket.close();
    }
}
