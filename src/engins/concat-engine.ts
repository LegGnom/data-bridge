import {
    BridgeEvent,
    DataBridgeEngine,
    DataBridgeEngineHandler,
    DataBridgeInterface,
} from "../types";

export class ConcatEngine implements DataBridgeEngine {
    private instances = new Map<DataBridgeInterface, DataBridgeEngineHandler>();
    private handlers = new Set<DataBridgeEngineHandler>();

    constructor(...args: DataBridgeInterface[]) {
        this.add(...args);
    }

    add(...args: DataBridgeInterface[]) {
        let lastCall: string;

        args.forEach((item) => {
            const handler: DataBridgeEngineHandler = (data) => {
                if (data.event === BridgeEvent.Call && lastCall !== data.uuid) {
                    lastCall = data.uuid;
                    this.handlers.forEach((item) => item(data));
                }
            };

            this.instances.set(item, handler);
            item.engine.subscribe(handler);
        });
    }

    delete(...args: DataBridgeInterface[]) {
        args.forEach((item) => {
            const handler = this.instances.get(item);
            if (handler) item.engine.unsubscribe(handler);
            this.instances.delete(item);
        });
    }

    send(data: any) {
        this.instances.forEach((_, item) => {
            data["uuid"] = window.crypto.randomUUID();
            item.engine.send(data);
        });
    }

    subscribe(handler: DataBridgeEngineHandler) {
        this.handlers.add(handler);
    }

    unsubscribe(handler: DataBridgeEngineHandler) {
        this.handlers.delete(handler);
    }

    destroy() {}
}
