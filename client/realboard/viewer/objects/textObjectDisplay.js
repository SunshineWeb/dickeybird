var baseObjectDisplay = require("../displayObject.js").displayObject;
//var baseObjectDisplay = require("../display.js").Display;
export class TextDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.node = new PIXI.Text(entity.text, { fontSize: '14px', fill: 0x5f4f5f, wordWrap: true, wordWrapWidth: 300 });
        this.node.position.x = entity.pos.x;
        this.node.position.y = entity.pos.y;
        /*
        this.htmlNode = document.createElement("span");
        this.htmlNode.style.position = "absolute";
        this.htmlNode.style.top = entity.pos.y + "px";
        this.htmlNode.style.left = entity.pos.x + "px";
        this.htmlNode.textContent = entity.text;
        */
    }

    update(data) {
        if (data.text) {
            this.entity.text = data.text;
            this.node.text = this.entity.text;
        }
        super.update(data);
    }

    show() {
        super.show();

    }

    hide() {
        super.hide();
    }


    get editor() {
        return this.view.editor;
    }
}

baseObjectDisplay.register("text", TextDisplay);