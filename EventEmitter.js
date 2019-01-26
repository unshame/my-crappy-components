export default class EventEmitter {

    constructor() {
        this._events = Object.create(null);
    }

    subscribe(eventName, listener) {

        if (!(eventName in this._events)) {
            this._events[eventName] = [];
        }

        let listeners = this._events[eventName];

        if (!listeners.includes(listener)) {
            listeners.push(listener);
        }
    }

    unsibscribe(eventName, listener) {

        if (!(eventName in this._events)) {
            return;
        }

        let listeners = this._events[eventName];
        let index = listeners.indexOf(listener);
        if(index != -1) {
            listeners.splice(index, 1);
        }
    }

    dispatch(eventName, ...args) {

        if (!(eventName in this._events)) {
            return;
        }

        let listeners = this._events[eventName];
        for(let listener of listeners) {
            listener(...args);
        }
    }

    bubble(eventEmitter, eventName, ...args) {
        this.subscribe(eventName, (...moreArgs) => void eventEmitter.dispatch(eventName, ...args, ...moreArgs));
    }

    destroy() {
        this._events = null;
    }
}