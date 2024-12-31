import { safeJson } from "../helpers/safe-json";
import { DataBridgeEngine, DataBridgeEngineHandler } from "../types";

export class WebSocketEngine implements DataBridgeEngine {
    private handlers = new Set<DataBridgeEngineHandler>();
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

        this.socket.onmessage = (message) => {
            const data = safeJson(message.data, message.data);
            this.handlers.forEach((item) => item(data));
        };
    }

    private subscribeHandler = (message: MessageEvent) => {
        const data = safeJson(message.data, message.data);
        this.handlers.forEach((item) => item(data));
    };

    send(data: any) {
        if (!this.socket.readyState) {
            setTimeout(() => this.send(data), 100);
        } else {
            if (this.socket.readyState === WebSocket.OPEN)
                this.socket.send(JSON.stringify(data));
        }
    }

    subscribe(handler: DataBridgeEngineHandler) {
        this.handlers.add(handler);
    }

    unsubscribe(handler: DataBridgeEngineHandler) {
        this.handlers.delete(handler);
    }

    destroy() {
        this.socket.close();
    }
}
