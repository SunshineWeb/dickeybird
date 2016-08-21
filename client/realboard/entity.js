class Entity {
    constructor(id, type, name) {
        this.id = id;
        this.type = type;
        this.name = name;
        Object.freeze(this.id);
        Object.freeze(this.type);
    }
}