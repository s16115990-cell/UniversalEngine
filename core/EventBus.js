(function (window) {
    "use strict";

    class EventBus {

        constructor() {
            this.events = {};
        }

        on(eventName, listener) {

            if (typeof listener !== "function") {
                throw new TypeError(
                    "Event listener must be a function"
                );
            }

            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }

            this.events[eventName].push(listener);

            return () => {
                this.off(eventName, listener);
            };
        }

        off(eventName, listener) {

            if (!this.events[eventName]) {
                return false;
            }

            const index =
                this.events[eventName].indexOf(listener);

            if (index === -1) {
                return false;
            }

            this.events[eventName].splice(index, 1);

            return true;
        }

        emit(eventName, data) {

            const listeners =
                this.events[eventName];

            if (!listeners) {
                return;
            }

            listeners.slice().forEach(listener => {

                try {
                    listener(data);
                } catch (error) {

                    console.error(
                        "[UniversalEngine EventBus]",
                        error
                    );
                }

            });
        }

        once(eventName, listener) {

            const wrapper = (data) => {

                this.off(eventName, wrapper);

                listener(data);
            };

            this.on(eventName, wrapper);

            return wrapper;
        }

        clear(eventName) {

            if (eventName) {
                delete this.events[eventName];
            } else {
                this.events = {};
            }
        }
    }

    window.EventBus = EventBus;

})(window);
