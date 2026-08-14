(function (window) {
    "use strict";

    class MasterEngine {
        constructor(config) {
            this.version = "1.0.0";
            this.running = false;

            this.config = config || window.EngineConfig || {};
            this.entities = [];
            this.tasks = [];
            this.projects = [];

            this.lastTime = 0;
            this.deltaTime = 0;
            this.frameCount = 0;
            this.startTime = 0;
        }

        getStatus() {
            return {
                name: this.config.name || "UniversalEngine",
                version: this.version,
                running: this.running,
                entities: this.entities.length,
                tasks: this.tasks.length,
                projects: this.projects.length,
                frameCount: this.frameCount
            };
        }

        start() {
            if (this.running) {
                return false;
            }

            this.running = true;
            this.startTime = Date.now();
            this.lastTime = performance.now();

            this._loop();

            return true;
        }

        stop() {
            this.running = false;
            return true;
        }

        _loop() {
            if (!this.running) {
                return;
            }

            const now = performance.now();

            this.deltaTime = Math.min(
                (now - this.lastTime) / 1000,
                this.config.engine?.maxDeltaTime || 0.1
            );

            this.lastTime = now;
            this.frameCount++;

            this.update(this.deltaTime);

            const targetFPS =
                this.config.engine?.targetFPS || 60;

            const frameDelay = 1000 / targetFPS;

            setTimeout(() => {
                if (this.running) {
                    this._loop();
                }
            }, frameDelay);
        }

        update(deltaTime) {
            this._updateTasks(deltaTime);
            this._updateEntities(deltaTime);
        }

        _updateTasks(deltaTime) {
            for (let i = 0; i < this.tasks.length; i++) {
                const task = this.tasks[i];

                if (!task || task.enabled === false) {
                    continue;
                }

                if (typeof task.update === "function") {
                    task.update(deltaTime);
                }
            }
        }

        _updateEntities(deltaTime) {
            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities[i];

                if (!entity || entity.enabled === false) {
                    continue;
                }

                if (typeof entity.update === "function") {
                    entity.update(deltaTime);
                }
            }
        }

        addEntity(entity) {
            if (!entity) {
                return null;
            }

            const maxEntities =
                this.config.entities?.maxEntities || 10000;

            if (this.entities.length >= maxEntities) {
                throw new Error("Maximum entity limit reached.");
            }

            this.entities.push(entity);

            return entity;
        }

        removeEntity(entity) {
            const index = this.entities.indexOf(entity);

            if (index === -1) {
                return false;
            }

            this.entities.splice(index, 1);

            return true;
        }

        addTask(task) {
            if (!task) {
                return null;
            }

            const maxTasks =
                this.config.tasks?.maxTasks || 1000;

            if (this.tasks.length >= maxTasks) {
                throw new Error("Maximum task limit reached.");
            }

            this.tasks.push(task);

            return task;
        }

        removeTask(task) {
            const index = this.tasks.indexOf(task);

            if (index === -1) {
                return false;
            }

            this.tasks.splice(index, 1);

            return true;
        }

        addProject(project) {
            if (!project) {
                return null;
            }

            const maxProjects =
                this.config.projects?.maxProjects || 100;

            if (this.projects.length >= maxProjects) {
                throw new Error("Maximum project limit reached.");
            }

            this.projects.push(project);

            return project;
        }

        removeProject(project) {
            const index = this.projects.indexOf(project);

            if (index === -1) {
                return false;
            }

            this.projects.splice(index, 1);

            return true;
        }

        clearAll() {
            this.entities.length = 0;
            this.tasks.length = 0;
            this.projects.length = 0;

            return true;
        }

        reset() {
            this.stop();

            this.entities.length = 0;
            this.tasks.length = 0;
            this.projects.length = 0;

            this.lastTime = 0;
            this.deltaTime = 0;
            this.frameCount = 0;
            this.startTime = 0;

            return true;
        }
    }

    window.MasterEngine = MasterEngine;

    if (!window.UniversalEngine) {
        window.UniversalEngine = new MasterEngine(
            window.EngineConfig || {}
        );
    }

})(typeof window !== "undefined" ? window : globalThis);
