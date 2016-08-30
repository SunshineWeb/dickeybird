var baseObjectDisplay = require("../displayObject.js").displayObject;
export class TextDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.node = new PIXI.Text(entity.text, { fontSize: '14px', fill: 0xff1010, wordWrap: true, wordWrapWidth: 300 });
        this.node.position.x = entity.pos.x;
        this.node.position.y = entity.pos.y;
    }

    update(data) {
        if (data.text) {
            this.entity.text = data.text;
            this.node.text = this.entity.text;
        }
        super.update(data);
    }

    get editor() {
        return this.view.editor;
    }
}

baseObjectDisplay.register("text", TextDisplay);