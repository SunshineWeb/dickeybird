var baseDisplay = require("./display.js");
var registeredTypes = new Map();
export class displayObject extends baseDisplay.Display {
    constructor(app, entity) {
        super(app);
        this.entity = entity;
        this.isCreated = false;
    }

    show() {
        if (!this.isCreated) {
            this.isCreated = true;
            this.node.vm = this;

            this.node.on('mousedown', this._onDragStart, this)
                .on('touchstart', this._onDragStart, this)
                .on("mouseup", this._onDragEnd, this)
                .on("touchend", this._onDragEnd, this)
                .on('mouseupoutside', this._onDragEnd, this)
                .on('touchendoutside', this._onDragEnd, this);
        }
        this.node.interactive = true;
        this.view.addDisplayObject(this);
    }

    hide() {
        this.node.interactive = false;
        this.view.removeDisplayObject(this);
    }

    moveTo(newPosition) {
        var delta = { dx: newPosition.x - this._startPos.x, dy: newPosition.y - this._startPos.y };
        this._startPos = newPosition;
        this.moveCmd.move(delta);
    }

    move(delta) {
        this.node.position.x += delta.dx;
        this.node.position.y += delta.dy;
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
            this.editor.show(this.node.position, this.node, this.entity).then((data) => {
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
            this.node
                .on("mousemove", this._onDragMove, this)
                .on("touchmove", this._onDragMove, this);
            setTimeout(() => {
                if (!this._moved) {
                    this.draggingType = 2;
                    this.node.alpha = 0.5;
                    this.view.isNeedUpdate = true;
                }
            }, 50);
            this.data = event.data;
            this.dragging = true;
            this._startPos = this.view.getPagePoint(event.data.originalEvent);
            this.draggingType = 1;
            this._moved = false;
        }

        return true
    }

    _onDragEnd(event) {
        if (this.dragging) {
            event.stopPropagation();
            this.node
                .off("mousemove", this._onDragMove)
                .off("touchmove", this._onDragMove);
            this.node.alpha = 1;
            if (!this._moved) {
                this.showEditor();
            } else if (this.draggingType == 2) {
                this.moveCmd.complete();
            }

            this.data = null;
            this._moved = false;
            this.dragging = false;
        }
        return true
    }

    _onDragMove(event) {
        if (this.dragging) {
            if (this.draggingType == 1) {
                this._moved = true;
                var curPt = this.view.getPagePoint(event.data.originalEvent);

                this.view.pan(curPt.x - this._startPos.x, curPt.y - this._startPos.y);
                this._startPos = curPt;
                return true;
            }
            event.stopPropagation();
            if (!this._moved) {
                this._moved = true;
                this.moveCmd && this.moveCmd.execute();
            } else
                this.moveTo(this.view.getPagePoint(event.data.originalEvent));
        }
        return true
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