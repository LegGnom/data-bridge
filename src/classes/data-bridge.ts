import { ConcatEngine } from "../engins/concat-engine";
import { ObjectEventEngine } from "../engins/object-event-engine";
import { PostMessageEngine } from "../engins/post-message-engine";
import { WebSocketEngine } from "../engins/web-socket-engine";
import {
    BridgeEvent,
    DataBridgeEngine,
    DataBridgeInterface,
    HandlerArgumentType,
    Message,
    RegistreHandlerReturnType,
    RegistreHandlerType,
} from "../types";

export class DataBridge implements DataBridgeInterface {
    static concatEngine = (...args: DataBridgeInterface[]) =>
        new ConcatEngine(...args);

    static objectEventEngine = () => new ObjectEventEngine();

    static postMessageEngine = (
        sendChannel = window,
        subscribeChannel?: typeof window
    ) => new PostMessageEngine(sendChannel, subscribeChannel);

    static webScoketEngine = (url: string) => new WebSocketEngine(url);

    private requests = new Map<string, any>();
    private response = new Map<string, RegistreHandlerType>();

    constructor(public engine: DataBridgeEngine) {
        engine.subscribe((data: Message) => {
            if (data.event === BridgeEvent.Response) {
                const handler = this.requests.get(data.uuid);
                if (handler) handler(data.payload.args);
            }

            if (data.event === BridgeEvent.Call) {
                const handler = this.response.get(data.payload.event);
                let args: RegistreHandlerReturnType = undefined;

                if (handler) {
                    const handlerArgs = Array.isArray(data.payload.args)
                        ? data.payload.args
                        : [data.payload.args];
                    args = handler(...handlerArgs);
                }

                this.engine.send({
                    event: BridgeEvent.Response,
                    uuid: data.uuid,
                    payload: {
                        event: data.event,
                        args,
                    },
                });
            }
        });
    }

    call(event: string, ...args: HandlerArgumentType[]): PromiseLike<any> {
        return new Promise((resolve, reject) => {
            const uuid = window.crypto.randomUUID();

            this.requests.set(uuid, resolve);
            this.engine.send({
                event: BridgeEvent.Call,
                uuid,
                payload: {
                    event,
                    args,
                },
            });
        });
    }

    registreHandler(event: string, handler: RegistreHandlerType): void {
        this.response.set(event, handler);
    }

    getEngine() {
        return this.engine;
    }

    destroy() {
        this.engine.destroy();
    }
}
