import { ObjectEventEngine } from "../engins/object-event-engine";
import { PostMessageEngine } from "../engins/post-message-engine";
import { WebSocketEngine } from "../engins/web-socket-engine";
import { DataBridgeEngine } from "../types";

export type HandlerArgumentType =
    | Record<string, any>
    | string
    | number
    | boolean;
export type RegistreHandlerType = (
    ...args: HandlerArgumentType[]
) => HandlerArgumentType | Promise<HandlerArgumentType> | void;

export interface Message {
    event: BridgeEvent;
    uuid: string;
    payload: {
        event: string;
        args: HandlerArgumentType | HandlerArgumentType[];
    };
}

export enum BridgeEvent {
    Call = "call",
    Response = "response",
}

export class DataBridge {
    static objectEventEngine = () => new ObjectEventEngine();

    static postMessageEngine = (
        sendChannel = window,
        subscribeChannel?: typeof window
    ) => new PostMessageEngine(sendChannel, subscribeChannel);

    static webScoketEngine = (url: string) => new WebSocketEngine(url);

    private requests = new Map<string, any>();
    private response = new Map<string, RegistreHandlerType>();

    constructor(private engine: DataBridgeEngine) {
        engine.subscribe((data: Message) => {
            if (data.event === BridgeEvent.Response) {
                const handler = this.requests.get(data.uuid);
                if (handler) handler(data.payload.args);
            }

            if (data.event === BridgeEvent.Call) {
                const handler = this.response.get(data.payload.event);
                if (handler) {
                    const args = Array.isArray(data.payload.args)
                        ? data.payload.args
                        : [data.payload.args];

                    this.engine.send({
                        event: BridgeEvent.Response,
                        uuid: data.uuid,
                        payload: {
                            event: data.event,
                            args: handler(...args),
                        },
                    });
                }
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

    destroy() {
        this.engine.destroy();
    }
}
