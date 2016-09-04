var baseDisplay = require("./display.js");
export class displayDraw extends baseDisplay.Display {
    constructor(app) {
        super(app);
        this.node = new PIXI.Container();

        this.bg = new PIXI.Graphics();
        this.drawObject = new PIXI.Graphics();
        this.bg.interactive = true;
        this.bg.on('mousedown', this._onDragStart, this)
            .on('touchstart', this._onDragStart, this)
            // events for drag end
            .on('mouseup', this._onDragEnd, this)
            .on('mouseupoutside', this._onDragEnd, this)
            .on('touchend', this._onDragEnd, this)
            .on('touchendoutside', this._onDragEnd, this)
            // events for drag move
            .on('mousemove', this._onDragMove, this)
            .on('touchmove', this._onDragMove, this);
        this.bg.beginFill(0, 0);
        this.bg.drawRect(-5000, -5000, 10000, 10000);
        this.bg.endFill(0, 0);
        this.bg.position.x = 0;
        this.bg.position.y = 0;
        this.path = [];
        this.paths = [];

        //this.drawObject.position.x = 0;
        //this.drawObject.position.y = 0;
        this.node.addChild(this.bg);
        this.node.addChild(this.drawObject);
    }

    show() {
        var pos = this.view.getVisiblePoint();
        this.node.position.x = pos.x;
        this.node.position.y = pos.y;
        this.view.addDisplayObject(this);
        //this.view.stage.addChild(this.node);
        this.view.setCursor("pointer");
    }

    hide() {
        this.view.removeDisplayObject(this);
        this.view.resetCursor();
        //this.view.stage.removeChild(this.node);
        //this.node.destroy(true);
    }

    move(newPosition) {
        if (this.path.length) {
            this.drawObject.lineStyle(2, 0xf1d900, 1);
            this.drawObject.lineTo(newPosition.x - this.node.position.x, newPosition.y - this.node.position.y);
        } else {
            this.drawObject.lineStyle(2, 0xf1d900, 1);
            this.drawObject.moveTo(newPosition.x - this.node.position.x, newPosition.y - this.node.position.y);
        }
        this.path.push(newPosition);
        this.view.isNeedUpdate = true;
    }

    _onDragStart(event) {
        event.stopPropagation();
        this.drawing = true;
        //this.view.setCursor("crosshair");
        this.move(event.data.getLocalPosition(this.node.parent));
    }

    _onDragEnd(event) {
        event.stopPropagation();
        this.data = null;
        this.drawing = false;
        this.view.setCursor("pointer");
        if (this.addNew && this.path && this.path.length > 1) {
            this.paths.push(this.path);
            this.addNew(this.path);
        }
        this.path = [];
        this.drawObject.clear();
    }

    _onDragMove(event) {
        event.stopPropagation();
        if (this.drawing) {
            this.move(event.data.getLocalPosition(this.node.parent));
        }
    }

    getData() {

        return this.paths.filter(i => i.length > 1);
    }
}