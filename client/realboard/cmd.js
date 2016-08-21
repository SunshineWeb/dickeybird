export class Command {
    constructor(app) {
        this.app = app;
    }

    execute() {
        this.app.viewer.isNeedUpdate = true;
    }

    complete() {

    }
}