export const EventEmitter = {
    events: {},
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(fn => fn(data));
        }
    },
    
    on(event, fn) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(fn);
    }
};