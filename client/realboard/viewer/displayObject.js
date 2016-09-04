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
            /*
            this.node.on('mousedown', this._onDragStart, this)
                .on('touchstart', this._onDragStart, this)
                .on("mouseup", this._onDragEnd, this)
                .on("touchend", this._onDragEnd, this)
                .on('mouseupoutside', this._onDragEnd, this)
                .on('touchendoutside', this._onDragEnd, this)
                .on("mouseover", this._onOver, this)
                .on("mouseout", this._onLeave, this);
                */

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
        /*if (this.draggingType == 2) {
            this.moveCmd.move(delta);
        }
        else {
            this.view.pan(delta.dx, delta.dy);
        }*/
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

    _onDragStart(event) {
        if (!event.data.originalEvent.touches || event.data.originalEvent.touches.length <= 1) {
            this.node.scale.x = this.node.scale.y = this.scale;
            this.node
                .on("mousemove", this._onDragMove, this)
                .on("touchmove", this._onDragMove, this);
            if (this.interval) clearTimeout(this.interval);
            this.interval = setTimeout(() => {
                if (!this._moved) {
                    this.moveCmd && this.moveCmd.execute();
                }
                this.dragging = true;

            }, 80);
            this._startPos = this.view.getPagePoint(event.data.originalEvent);
            this._moved = false;
        }

        return false;
    }

    _onDragEnd(event) {
        if (this.dragging) {
            this.node
                .off("mousemove", this._onDragMove)
                .off("touchmove", this._onDragMove);
            if (!this._moved) {
                this.moveCmd.cancel();
                this.click();
            }
            else {
                this.moveCmd.complete();
            }
            this.dragging = false;
        } else {
            if (this.interval) {
                clearTimeout(this.interval);
                this.interval = null;
            }
        }
        return true
    }

    _onDragMove(event) {
        if (this.dragging) {
            event.stopPropagation();
            this._moveTo(this.view.getPagePoint(event.data.originalEvent));
            this._moved = true;
        } else {
            if (this.interval) clearTimeout(this.interval);
            this.interval = null;
        }
        return true;
    }

    click() {
        if (!this._moved) {
            this.showEditor();
        }
    }

    _onOver() {
        this.scale = this.scale || this.node.scale.x;
        this.node.scale.x = this.node.scale.y = this.scale * 1.1;
        this.view.isNeedUpdate = true;
    }

    _onLeave() {
        this.node.scale.x = this.node.scale.y = this.scale;
        this.view.isNeedUpdate = true;
    }
}