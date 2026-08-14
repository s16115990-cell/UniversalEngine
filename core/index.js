(function (global) {
    "use strict";

    /*
     * UniversalEngine
     * Core Entry Point
     *
     * Connects:
     * - EngineConfig
     * - MasterEngine
     * - EventBus
     */

    // --------------------------------------------------
    // Load core modules when CommonJS / Node.js is used
    // --------------------------------------------------

    if (typeof require === "function") {
        try {
            require("./EngineConfig.js");
        } catch (error) {
            // Browser environments may not support require().
        }

        try {
            require("./EventBus.js");
        } catch (error) {
            // EventBus may already be loaded.
        }

        try {
            require("./MasterEngine.js");
        } catch (error) {
            // MasterEngine may already be loaded.
        }
    }

    // --------------------------------------------------
    // Read core classes and configuration
    // --------------------------------------------------

    var EngineConfig = global.EngineConfig || {};

    var MasterEngine = global.MasterEngine;

    var EventBus = global.EventBus;

    var eventBus = global.eventBus;

    // --------------------------------------------------
    // Safety check
    // --------------------------------------------------

    if (typeof MasterEngine !== "function") {
        throw new Error(
            "UniversalEngine: MasterEngine.js must be loaded before index.js."
        );
    }

    // --------------------------------------------------
    // Create or reuse the main engine instance
    // --------------------------------------------------

    var engine;

    if (
        global.UniversalEngine &&
        global.UniversalEngine instanceof MasterEngine
    ) {
        engine = global.UniversalEngine;
    } else {
        engine = new MasterEngine(EngineConfig);
        global.UniversalEngine = engine;
    }

    // --------------------------------------------------
    // Attach EventBus
    // --------------------------------------------------

    if (EventBus) {
        engine.EventBus = EventBus;
    }

    if (eventBus) {
        engine.eventBus = eventBus;
    }

    // --------------------------------------------------
    // Attach configuration
    // --------------------------------------------------

    engine.EngineConfig = EngineConfig;

    // --------------------------------------------------
    // Engine metadata
    // --------------------------------------------------

    engine.name = EngineConfig.name || "UniversalEngine";

    engine.version =
        EngineConfig.version ||
        engine.version ||
        "1.0.0";

    // --------------------------------------------------
    // Public API
    // --------------------------------------------------

    engine.getEngineConfig = function () {
        return EngineConfig;
    };

    engine.getEventBus = function () {
        return engine.eventBus || null;
    };

    engine.isReady = function () {
        return (
            typeof engine.start === "function" &&
            typeof engine.stop === "function" &&
            typeof engine.getStatus === "function"
        );
    };

    // --------------------------------------------------
    // Global references
    // --------------------------------------------------

    global.UniversalEngine = engine;

    global.UniversalEngineCore = {
        EngineConfig: EngineConfig,
        MasterEngine: MasterEngine,
        EventBus: EventBus || null,
        eventBus: eventBus || null,
        engine: engine
    };

    // --------------------------------------------------
    // CommonJS / Node.js support
    // --------------------------------------------------

    if (typeof module !== "undefined" && module.exports) {
        module.exports = global.UniversalEngineCore;
    }

})(typeof window !== "undefined" ? window : globalThis);
