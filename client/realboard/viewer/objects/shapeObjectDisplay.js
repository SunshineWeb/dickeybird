var baseObjectDisplay = require("../displayObject.js").displayObject;

export class ShapeDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.node = new PIXI.Graphics();//
        this.node.beginFill(0, 0);
        this.node.lineStyle(entity.stroke || 2, 0xffd900, 1);
        this.node.drawRect(0, 0, entity.width, entity.height);

        this.node.position.x = entity.pos.x;
        this.node.position.y = entity.pos.y;
    }

    getBBox() {
        return this.node.getLocalBounds();
    }

    showResize() {
        baseObjectDisplay.showResize(this);
    }
}
baseObjectDisplay.register("rect", ShapeDisplay);