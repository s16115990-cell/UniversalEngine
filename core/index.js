(function (window) {
    "use strict";

    // Ensure the main UniversalEngine instance exists
    if (!window.UniversalEngine) {
        if (typeof window.MasterEngine !== "function") {
            throw new Error(
                "MasterEngine is not loaded. Load MasterEngine.js first."
            );
        }

        window.UniversalEngine = new window.MasterEngine(
            window.EngineConfig || {}
        );
    }

    // Public API
    window.UniversalEngineAPI = {

        version: "1.0.0",

        getEngine: function () {
            return window.UniversalEngine;
        },

        getStatus: function () {
            return window.UniversalEngine.getStatus();
        },

        start: function () {
            return window.UniversalEngine.start();
        },

        stop: function () {
            return window.UniversalEngine.stop();
        },

        reset: function () {
            return window.UniversalEngine.reset();
        },

        addEntity: function (entity) {
            return window.UniversalEngine.addEntity(entity);
        },

        removeEntity: function (entity) {
            return window.UniversalEngine.removeEntity(entity);
        },

        addTask: function (task) {
            return window.UniversalEngine.addTask(task);
        },

        removeTask: function (task) {
            return window.UniversalEngine.removeTask(task);
        },

        addProject: function (project) {
            return window.UniversalEngine.addProject(project);
        },

        removeProject: function (project) {
            return window.UniversalEngine.removeProject(project);
        },

        clearAll: function () {
            return window.UniversalEngine.clearAll();
        }
    };

})(typeof window !== "undefined" ? window : globalThis);
