(function (window) {
    "use strict";

    /**
     * UniversalEngine EventBus
     * Version: 1.0.0
     *
     * A lightweight event system for communication
     * between engine modules, entities, tasks and projects.
     */

    class EventBus {
        constructor() {
            this.version = "1.0.0";
            this.events = new Map();
            this.onceEvents = new Map();
        }

        /**
         * Register an event listener.
         *
         * @param {string} eventName
         * @param {Function} listener
         * @returns {Function} unsubscribe function
         */
        on(eventName, listener) {
            if (typeof eventName !== "string" || eventName.trim() === "") {
                throw new TypeError("Event name must be a non-empty string.");
            }

            if (typeof listener !== "function") {
                throw new TypeError("Event listener must be a function.");
            }

            if (!this.events.has(eventName)) {
                this.events.set(eventName, new Set());
            }

            this.events.get(eventName).add(listener);

            return () => {
                this.off(eventName, listener);
            };
        }

        /**
         * Register a one-time event listener.
         *
         * @param {string} eventName
         * @param {Function} listener
         * @returns {Function} unsubscribe function
         */
        once(eventName, listener) {
            if (typeof eventName !== "string" || eventName.trim() === "") {
                throw new TypeError("Event name must be a non-empty string.");
            }

            if (typeof listener !== "function") {
                throw new TypeError("Event listener must be a function.");
            }

            const wrapper = (...args) => {
                this.off(eventName, wrapper);
                this.onceEvents.delete(wrapper);

                return listener(...args);
            };

            this.onceEvents.set(wrapper, listener);

            return this.on(eventName, wrapper);
        }

        /**
         * Remove an event listener.
         *
         * @param {string} eventName
         * @param {Function} listener
         * @returns {boolean}
         */
        off(eventName, listener) {
            if (!this.events.has(eventName)) {
                return false;
            }

            const listeners = this.events.get(eventName);
            const removed = listeners.delete(listener);

            if (this.onceEvents.has(listener)) {
                this.onceEvents.delete(listener);
            }

            if (listeners.size === 0) {
                this.events.delete(eventName);
            }

            return removed;
        }

        /**
         * Emit an event.
         *
         * @param {string} eventName
         * @param {...any} args
         * @returns {boolean}
         */
        emit(eventName, ...args) {
            if (!this.events.has(eventName)) {
                return false;
            }

            const listeners = Array.from(this.events.get(eventName));

            for (const listener of listeners) {
                try {
                    listener(...args);
                } catch (error) {
                    this.handleError(error, eventName);
                }
            }

            return true;
        }

        /**
         * Emit an event asynchronously.
         *
         * @param {string} eventName
         * @param {...any} args
         * @returns {Promise<boolean>}
         */
        async emitAsync(eventName, ...args) {
            if (!this.events.has(eventName)) {
                return false;
            }

            const listeners = Array.from(this.events.get(eventName));

            for (const listener of listeners) {
                try {
                    await listener(...args);
                } catch (error) {
                    this.handleError(error, eventName);
                }
            }

            return true;
        }

        /**
         * Remove all listeners for one event,
         * or all listeners when no event is specified.
         *
         * @param {string|null} eventName
         */
        clear(eventName = null) {
            if (eventName === null) {
                this.events.clear();
                this.onceEvents.clear();
                return;
            }

            this.events.delete(eventName);
        }

        /**
         * Check whether an event has listeners.
         *
         * @param {string} eventName
         * @returns {boolean}
         */
        has(eventName) {
            return this.events.has(eventName) &&
                   this.events.get(eventName).size > 0;
        }

        /**
         * Get number of listeners for an event.
         *
         * @param {string} eventName
         * @returns {number}
         */
        listenerCount(eventName) {
            if (!this.events.has(eventName)) {
                return 0;
            }

            return this.events.get(eventName).size;
        }

        /**
         * Get all registered event names.
         *
         * @returns {Array<string>}
         */
        getEventNames() {
            return Array.from(this.events.keys());
        }

        /**
         * Internal error handler.
         *
         * @param {Error} error
         * @param {string} eventName
         */
        handleError(error, eventName) {
            if (typeof console !== "undefined" &&
                typeof console.error === "function") {
                console.error(
                    "[UniversalEngine EventBus]",
                    "Error in event:",
                    eventName,
                    error
                );
            }
        }

        /**
         * Destroy the EventBus and release all listeners.
         */
        destroy() {
            this.clear();
        }
    }

    /*
     * Create a shared global EventBus instance.
     */
    const eventBus = new EventBus();

    /*
     * Expose classes and instance globally.
     */
    window.UniversalEngine = window.UniversalEngine || {};

    window.UniversalEngine.EventBus = EventBus;
    window.UniversalEngine.eventBus = eventBus;

    /*
     * Backward-friendly global names.
     */
    window.EventBus = EventBus;
    window.eventBus = eventBus;

    /*
     * CommonJS / Node.js compatibility.
     */
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EventBus;
        module.exports.EventBus = EventBus;
        module.exports.eventBus = eventBus;
    }

})(typeof window !== "undefined" ? window : globalThis);
