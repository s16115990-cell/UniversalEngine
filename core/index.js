(function (window) {
    "use strict";

    /*
     * Make sure MasterEngine exists
     */

    if (!window.UniversalEngine) {

        console.error(
            "[UniversalEngine] MasterEngine was not loaded."
        );

        return;
    }

    const engine =
        window.UniversalEngine;

    /*
     * Initialize engine
     */

    engine.init();

    /*
     * Public API
     */

    const API = {

        /* Engine */

        init() {
            return engine.init();
        },

        start() {
            return engine.start();
        },

        stop() {
            return engine.stop();
        },

        reset() {
            return engine.reset();
        },

        destroy() {
            return engine.destroy();
        },

        /* Status */

        getStatus() {
            return engine.getStatus();
        },

        /* Entities */

        addEntity(entity) {
            return engine.addEntity(entity);
        },

        removeEntity(entity) {
            return engine.removeEntity(entity);
        },

        clearEntities() {
            return engine.clearEntities();
        },

        /* Tasks */

        addTask(task) {
            return engine.addTask(task);
        },

        removeTask(task) {
            return engine.removeTask(task);
        },

        /* Projects */

        addProject(project) {
            return engine.addProject(project);
        },

        /* Events */

        on(eventName, listener) {
            return engine.on(
                eventName,
                listener
            );
        },

        off(eventName, listener) {
            return engine.off(
                eventName,
                listener
            );
        },

        emit(eventName, data) {
            return engine.emit(
                eventName,
                data
            );
        },

        /*
         * Direct access to engine
         * for advanced usage.
         */

        getEngine() {
            return engine;
        }
    };

    /*
     * Public API
     */

    window.UniversalEngineAPI = API;

    /*
     * Compatibility:
     * Both names work.
     */

    window.UniversalEngine.api = API;

    /*
     * Debug message
     */

    if (
        window.EngineConfig &&
        window.EngineConfig.debug
    ) {

        console.log(
            "[UniversalEngine] Loaded successfully."
        );

        console.log(
            "[UniversalEngine] Version:",
            engine.version
        );
    }

})(window);
