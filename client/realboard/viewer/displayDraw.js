var baseDisplay = require("./display.js");
export class displayDraw extends baseDisplay.Display {
    constructor(app) {
        super(app);
        this.node = new PIXI.Graphics();
        this.node.interactive = true;
        this.node.on('mousedown', this._onDragStart, this)
            .on('touchstart', this._onDragStart, this)
            // events for drag end
            .on('mouseup', this._onDragEnd, this)
            .on('mouseupoutside', this._onDragEnd, this)
            .on('touchend', this._onDragEnd, this)
            .on('touchendoutside', this._onDragEnd, this)
            // events for drag move
            .on('mousemove', this._onDragMove, this)
            .on('touchmove', this._onDragMove, this);
        this.node.beginFill(0, 0);
        this.node.drawRect(0, 0, this.view.renderer.width, this.view.renderer.height);
        this.node.endFill(0, 0);
        this.node.position.x = 0;
        this.node.position.y = 0;
        this.path = [];
        this.paths = [];
    }

    show() {
        var pos = this.view.getVisiblePoint();
        this.node.position.x = pos.x;
        this.node.position.y = pos.y;
        this.view.addDisplayObject(this);
    }

    hide() {
        this.view.removeDisplayObject(this);
    }

    move(newPosition) {
        if (this.path.length) {
            this.node.lineTo(newPosition.x - this.node.position.x, newPosition.y - this.node.position.y);
        } else {
            this.node.lineStyle(6, 0xffd900, 1);
            this.node.moveTo(newPosition.x - this.node.position.x, newPosition.y - this.node.position.y);
        }
        this.path.push(newPosition);
        this.view.isNeedUpdate = true;
    }

    _onDragStart(event) {
        event.stopPropagation();
        this.drawing = true;
        this.move(event.data.getLocalPosition(this.node.parent));
    }

    _onDragEnd(event) {
        event.stopPropagation();
        this.data = null;
        this.drawing = false;
        this.paths.push(this.path);
        this.path = [];
    }

    _onDragMove(event) {
        event.stopPropagation();
        if (this.drawing) {
            this.move(event.data.getLocalPosition(this.node.parent));
        }
    }

    getData() {
        var box = { x: 0, y: 0, x2: 0, y2: 0 };
        this.paths = this.paths.filter(path => path.length > 1).map(path => {
            return simplify(path, 0.25, false);
        });

        this.paths.forEach(item => {
            item.forEach(subitem => {
                if (subitem.x > box.x2) {
                    box.x2 = subitem.x;
                }
                if (subitem.x < box.x) {
                    box.x = subitem.x;
                }
                if (subitem.y > box.y2) {
                    box.y2 = subitem.y;
                }
                if (subitem.y < box.y) {
                    box.y = subitem.y;
                }
            });
        });

        return this.paths;
    }
}