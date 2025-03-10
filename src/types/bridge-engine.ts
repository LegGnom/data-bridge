export type DataBridgeEngineHandler = (paylod: any) => void;

export interface DataBridgeEngine {
    send: (paylod: any) => void;
    subscribe: (handler: DataBridgeEngineHandler) => void;
    unsubscribe: (handler: DataBridgeEngineHandler) => void;
    destroy: () => void;
}
