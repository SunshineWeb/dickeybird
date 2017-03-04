var registeredTypes = new Map();
export class Display {
    constructor(app) {
        this.app = app;
        this.view = app.viewer;
    }
    
    show() {

    }

    static register(typeName, type) {
        registeredTypes.set(typeName, type);
    }

    static create(app, entity) {
        if (registeredTypes.has(entity.type)) {
            return new (registeredTypes.get(entity.type))(app, entity);
        }
        return null;
    }
}