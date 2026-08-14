(function (window) {
    "use strict";

    const EngineConfig = {
        name: "UniversalEngine",
        version: "1.0.0",

        debug: true,

        engine: {
            autoStart: false,
            targetFPS: 60,
            maxDeltaTime: 0.1
        },

        events: {
            enabled: true
        },

        entities: {
            enabled: true,
            maxEntities: 10000
        },

        tasks: {
            enabled: true,
            maxTasks: 1000
        },

        projects: {
            enabled: true,
            maxProjects: 100
        },

        logging: {
            enabled: true,
            level: "info"
        }
    };

    // Freeze configuration to prevent accidental changes.
    if (typeof Object.freeze === "function") {
        Object.freeze(EngineConfig.engine);
        Object.freeze(EngineConfig.events);
        Object.freeze(EngineConfig.entities);
        Object.freeze(EngineConfig.tasks);
        Object.freeze(EngineConfig.projects);
        Object.freeze(EngineConfig.logging);
        Object.freeze(EngineConfig);
    }

    window.EngineConfig = EngineConfig;

})(typeof window !== "undefined" ? window : globalThis);
