export class App {
    constructor() {
        this.entities = new Map();
        this.viewModels = new Map();
        this.viewer = null;
        this.commands = [];
    }

    add(entity) {
        entity.id = entity.id || this.connector.util.guid();
        this.entities.set(entity.id, entity);
    }

}