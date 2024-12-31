import { DataBridgeEngine } from "./bridge-engine";

export interface DataBridgeInterface {
    engine: DataBridgeEngine;

    call(event: string, ...args: HandlerArgumentType[]): PromiseLike<any>;
    registreHandler(event: string, handler: RegistreHandlerType): void;
    destroy(): void;
}

export type HandlerArgumentType =
    | Record<string, any>
    | string
    | number
    | boolean;

export type RegistreHandlerReturnType =
    | HandlerArgumentType
    | Promise<HandlerArgumentType>
    | undefined
    | void;

export type RegistreHandlerType = (
    ...args: HandlerArgumentType[]
) => RegistreHandlerReturnType;

export interface Message {
    event: BridgeEvent;
    uuid: string;
    payload: {
        event: string;
        args: HandlerArgumentType | HandlerArgumentType[] | undefined;
    };
}

export enum BridgeEvent {
    Call = "call",
    Response = "response",
}
