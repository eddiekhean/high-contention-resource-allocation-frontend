export function buildEventTarget(name) {
    const listeners = {};

    return {
        on(eventName, handler) {
            if (!listeners[eventName]) {
                listeners[eventName] = [];
            }
            listeners[eventName].push(handler);
        },
        off(eventName, handler) {
            if (!listeners[eventName]) return;
            if (!handler) {
                delete listeners[eventName];
                return;
            }
            const idx = listeners[eventName].indexOf(handler);
            if (idx > -1) {
                listeners[eventName].splice(idx, 1);
            }
        },
        trigger(eventName, data) {
            if (listeners[eventName]) {
                listeners[eventName].forEach(handler => handler(data));
            }
        }
    };
}
