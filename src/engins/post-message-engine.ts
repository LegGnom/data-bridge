import { safeJson } from "../helpers/safe-json";
import { DataBridgeEngine, DataBridgeEngineHandler } from "../types";

export class PostMessageEngine implements DataBridgeEngine {
    private handlers = new Set<DataBridgeEngineHandler>();

    constructor(
        private sendChannel: typeof window,
        private subscribeChannel?: typeof window
    ) {
        if (!subscribeChannel) this.subscribeChannel = sendChannel;
    }

    private subscribeHandler = (message: MessageEvent) => {
        const data = safeJson(message.data, message.data);
        this.handlers.forEach((item) => item(data));
    };

    send(data: any) {
        this.sendChannel.postMessage(data, "*");
    }

    subscribe(handler: DataBridgeEngineHandler) {
        this.handlers.add(handler);
        this.subscribeChannel?.addEventListener(
            "message",
            this.subscribeHandler,
            false
        );
    }

    unsubscribe(handler: DataBridgeEngineHandler) {
        this.handlers.delete(handler);
    }

    destroy() {
        this.subscribeChannel?.removeEventListener(
            "message",
            this.subscribeHandler,
            false
        );
    }
}
