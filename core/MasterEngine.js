(function (window) {
    "use strict";

    class MasterEngine {

        constructor(config) {

            this.config = config || {};

            this.name =
                this.config.name ||
                "UniversalEngine";

            this.version =
                this.config.version ||
                "1.0.0";

            this.running = false;

            this.initialized = false;

            this.entities = [];

            this.tasks = [];

            this.projects = [];

            this.frameCount = 0;

            this.deltaTime = 0;

            this.elapsedTime = 0;

            this.lastTime = 0;

            this._animationFrame = null;

            this.eventBus =
                new window.EventBus();

            this._boundLoop =
                this._loop.bind(this);
        }

        /* --------------------------------
           INITIALIZE
        -------------------------------- */

        init() {

            if (this.initialized) {
                return true;
            }

            this.initialized = true;

            this.eventBus.emit(
                "engine:init",
                this.getStatus()
            );

            return true;
        }

        /* --------------------------------
           START
        -------------------------------- */

        start() {

            if (!this.initialized) {
                this.init();
            }

            if (this.running) {
                return false;
            }

            this.running = true;

            this.lastTime =
                performance.now();

            this.eventBus.emit(
                "engine:start",
                this.getStatus()
            );

            this._animationFrame =
                requestAnimationFrame(
                    this._boundLoop
                );

            return true;
        }

        /* --------------------------------
           STOP
        -------------------------------- */

        stop() {

            if (!this.running) {
                return false;
            }

            this.running = false;

            if (this._animationFrame !== null) {

                cancelAnimationFrame(
                    this._animationFrame
                );

                this._animationFrame = null;
            }

            this.eventBus.emit(
                "engine:stop",
                this.getStatus()
            );

            return true;
        }

        /* --------------------------------
           MAIN LOOP
        -------------------------------- */

        _loop(currentTime) {

            if (!this.running) {
                return;
            }

            this.deltaTime =
                (currentTime - this.lastTime) / 1000;

            this.lastTime = currentTime;

            this.elapsedTime +=
                this.deltaTime;

            this.frameCount++;

            this._updateEntities(
                this.deltaTime
            );

            this._runTasks(
                this.deltaTime
            );

            this.eventBus.emit(
                "engine:update",
                {
                    deltaTime: this.deltaTime,
                    elapsedTime: this.elapsedTime,
                    frameCount: this.frameCount
                }
            );

            this._animationFrame =
                requestAnimationFrame(
                    this._boundLoop
                );
        }

        /* --------------------------------
           UPDATE ENTITIES
        -------------------------------- */

        _updateEntities(deltaTime) {

            const list =
                this.entities.slice();

            list.forEach(entity => {

                if (!entity) {
                    return;
                }

                if (entity.enabled === false) {
                    return;
                }

                if (
                    typeof entity.update !==
                    "function"
                ) {
                    return;
                }

                try {

                    entity.update(
                        deltaTime
                    );

                } catch (error) {

                    console.error(
                        "[UniversalEngine Entity Error]",
                        error
                    );

                    this.eventBus.emit(
                        "engine:error",
                        error
                    );
                }

            });
        }

        /* --------------------------------
           ADD ENTITY
        -------------------------------- */

        addEntity(entity) {

            if (!entity) {
                throw new Error(
                    "Entity cannot be null or undefined"
                );
            }

            if (
                this.entities.length >=
                (this.config.maxEntities || 10000)
            ) {
                throw new Error(
                    "Maximum entity limit reached"
                );
            }

            if (
                typeof entity !== "object"
            ) {
                throw new TypeError(
                    "Entity must be an object"
                );
            }

            if (
                typeof entity.update !==
                "function"
            ) {
                entity.update = function () {};
            }

            if (entity.enabled === undefined) {
                entity.enabled = true;
            }

            this.entities.push(entity);

            this.eventBus.emit(
                "entity:add",
                entity
            );

            return entity;
        }

        /* --------------------------------
           REMOVE ENTITY
        -------------------------------- */

        removeEntity(entity) {

            const index =
                this.entities.indexOf(entity);

            if (index === -1) {
                return false;
            }

            this.entities.splice(index, 1);

            this.eventBus.emit(
                "entity:remove",
                entity
            );

            return true;
        }

        /* --------------------------------
           REMOVE ALL ENTITIES
        -------------------------------- */

        clearEntities() {

            this.entities.length = 0;

            this.eventBus.emit(
                "entity:clear"
            );

            return true;
        }

        /* --------------------------------
           TASKS
        -------------------------------- */

        addTask(task) {

            if (typeof task !== "function") {
                throw new TypeError(
                    "Task must be a function"
                );
            }

            this.tasks.push(task);

            return task;
        }

        removeTask(task) {

            const index =
                this.tasks.indexOf(task);

            if (index === -1) {
                return false;
            }

            this.tasks.splice(index, 1);

            return true;
        }

        _runTasks(deltaTime) {

            this.tasks.slice().forEach(task => {

                try {
                    task(deltaTime);
                } catch (error) {

                    console.error(
                        "[UniversalEngine Task Error]",
                        error
                    );
                }

            });
        }

        /* --------------------------------
           PROJECTS
        -------------------------------- */

        addProject(project) {

            if (!project) {
                throw new Error(
                    "Project cannot be empty"
                );
            }

            this.projects.push(project);

            return project;
        }

        /* --------------------------------
           EVENTS
        -------------------------------- */

        on(eventName, listener) {

            return this.eventBus.on(
                eventName,
                listener
            );
        }

        off(eventName, listener) {

            return this.eventBus.off(
                eventName,
                listener
            );
        }

        emit(eventName, data) {

            return this.eventBus.emit(
                eventName,
                data
            );
        }

        /* --------------------------------
           STATUS
        -------------------------------- */

        getStatus() {

            return {

                name: this.name,

                version: this.version,

                initialized:
                    this.initialized,

                running:
                    this.running,

                entities:
                    this.entities.length,

                tasks:
                    this.tasks.length,

                projects:
                    this.projects.length,

                frameCount:
                    this.frameCount,

                deltaTime:
                    Number(
                        this.deltaTime.toFixed(4)
                    ),

                elapsedTime:
                    Number(
                        this.elapsedTime.toFixed(2)
                    )
            };
        }

        /* --------------------------------
           RESET
        -------------------------------- */

        reset() {

            this.stop();

            this.clearEntities();

            this.tasks.length = 0;

            this.projects.length = 0;

            this.frameCount = 0;

            this.deltaTime = 0;

            this.elapsedTime = 0;

            this.lastTime = 0;

            this.initialized = false;

            this.eventBus.emit(
                "engine:reset"
            );

            return true;
        }

        /* --------------------------------
           DESTROY
        -------------------------------- */

        destroy() {

            this.stop();

            this.clearEntities();

            this.tasks.length = 0;

            this.projects.length = 0;

            this.eventBus.clear();

            this.initialized = false;

            return true;
        }
    }

    /*
     * IMPORTANT:
     * Create ONE global engine instance.
     */

    window.UniversalEngine =
        new MasterEngine(
            window.EngineConfig
        );

})(window);
