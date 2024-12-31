import { EventEmiter } from "../classes/event-emiter";
import { DataBridgeEngine, DataBridgeEngineHandler } from "../types";

export class ObjectEventEngine implements DataBridgeEngine {
    private event = new EventEmiter();
    private handlers = new Set<DataBridgeEngineHandler>();

    private subscribeHandler = (data: any) => {
        this.handlers.forEach((item) => item(data));
    };

    send(data: any) {
        this.event.emit("message", data);
    }

    subscribe(handler: DataBridgeEngineHandler) {
        this.handlers.add(handler);
        this.event.on("message", this.subscribeHandler);
    }

    unsubscribe(handler: DataBridgeEngineHandler) {
        this.handlers.delete(handler);
    }

    destroy() {
        this.event.off("message", this.subscribeHandler);
    }
}
