export function safeJson<T>(value: string, defaultValue?: T) {
    try {
        return JSON.parse(value);
    } catch (_) {
        return defaultValue;
    }
}
