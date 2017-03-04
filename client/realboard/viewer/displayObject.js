var baseDisplay = require("./display.js").Display;

export class displayObject extends baseDisplay {
    constructor(app, entity) {
        super(app);
        this.entity = entity;
        this.isCreated = false;
    }

    show() {
        if (!this.isCreated) {
            this.isCreated = true;
            this.node.vm = this;
            this.node.on('mousedown', this.view.mouseEvents.onDragStart, this.view.mouseEvents)
                .on('touchstart', this.view.mouseEvents.onDragStart, this.view.mouseEvents)
                .on("mouseup", this.view.mouseEvents.onDragEnd, this.view.mouseEvents)
                .on("touchend", this.view.mouseEvents.onDragEnd, this.view.mouseEvents)
                .on('mouseupoutside', this.view.mouseEvents.onDragEnd, this.view.mouseEvents)
                .on('touchendoutside', this.view.mouseEvents.onDragEnd, this.view.mouseEvents)
                .on("mouseover", this._onOver, this)
                .on("mouseout", this._onLeave, this);
        }
        this.node.interactive = true;
        this.view.addDisplayObject(this);
    }

    hide() {
        this.node.interactive = false;
        this.view.removeDisplayObject(this);
    }

    _moveTo(newPosition) {
        var delta = { dx: newPosition.x - this._startPos.x, dy: newPosition.y - this._startPos.y };
        this._startPos = newPosition;
        this.moveCmd.move(delta);
        return;
    }

    move(delta) {
        this.node.position.x += (delta.dx / this.view.scale);
        this.node.position.y += (delta.dy / this.view.scale);
        this.view.isNeedUpdate = true;
    }

    update(data) {
        this.entity.pos = data.pos || this.entity.pos;
        this.node.position.x = this.entity.pos.x;
        this.node.position.y = this.entity.pos.y;
        this.view.isNeedUpdate = true;
    }

    showEditor() {
        if (this.editor) {
            this.editor
                .hide()
                .show(this.node.position, this.node, this.entity)
                .then((data) => {
                    this.editCmd.execute(data);
                    this.show();
                });

            this.editor
                .start(() => this.moveCmd.execute())
                .move((d) => this.moveCmd.move(d))
                .end(() => this.moveCmd.complete());
        }
    }

    click() {
        this.showEditor();
    }

    _onOver() {
        //this.setStatus("over");
        this.showResize && this.showResize();
    }

    _onLeave() {
        //this.setStatus("normal");
    }

    setStatus(status) {
        this.scale = this.scale || this.node.scale.x;
        switch (status) {
            case "move":
                this.node.scale.x = this.node.scale.y = this.scale;
                this.node.alpha = 0.5;
                this.view.renderer.view.style.cursor = "move";
                break;
            case "normal":
                this.node.scale.x = this.node.scale.y = this.scale;
                this.node.alpha = 1;
                this.view.renderer.view.style.cursor = "default";
                break;
            case "over":
                this.node.scale.x = this.node.scale.y = this.scale * 1.05;
                this.node.alpha = 1;
                break;
        }
        this.view.isNeedUpdate = true;
    }
}