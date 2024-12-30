type EventHandler = (...args: any) => void;
export class EventEmiter {
    private events = new Map<string, Set<EventHandler>>();
    private subscribes = new Set<EventHandler>();

    emit(event: string, ...args: any) {
        this.subscribes.forEach((item) => item(event, ...args));

        if (this.events.has(event)) {
            this.events.get(event)?.forEach((item) => item(...args));
        }
    }

    one(event: string, handler: EventHandler) {
        const wrap = (...args: any) => {
            this.off(event, wrap);
            handler(...args);
        };
        this.on(event, wrap);
    }

    on(event: string, handler: EventHandler) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)?.add(handler);
    }
    off(event: string, handler: EventHandler) {
        if (this.events.has(event)) {
            this.events.get(event)?.delete(handler);
        }
    }
    subscribe(handler: EventHandler) {
        this.subscribes.add(handler);
    }
    unsubscribe(handler: EventHandler) {
        this.subscribes.delete(handler);
    }
}
