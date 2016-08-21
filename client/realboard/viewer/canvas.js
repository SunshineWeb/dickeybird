export class Canvas {
    constructor(viewElement) {
        this.isNeedUpdate = true;
        this.renderer = new PIXI.CanvasRenderer(1280, 2000, { backgroundColor: 0xf0f9bb, view: viewElement });
        this.stage = new PIXI.Container();
        this.bg = new PIXI.Graphics();//
        this.bg.beginFill(0, 0);
        this.bg.lineStyle(0, 0xffd900, 1);
        this.bg.drawRect(0, 0, 1280, 2000);
        this.stage.addChild(this.bg);
    }

    addDisplayObject(obj) {
        this.stage.addChild(obj);
        this.isNeedUpdate = true;
    }

    removeDisplayObject(obj) {
        this.stage.removeChild(obj);
    }

    updateDisplayObject(obj) {
        this.isNeedUpdate = true;
    }

    show() {
        var _this = this;
        function animate() {
            requestAnimationFrame(animate);
            if (_this.isNeedUpdate) {
                _this.isNeedUpdate = false;
                _this.renderer.render(_this.stage);
            }
        }

        this.bindEvent();
        animate();
    }

    _onDragStart(params) {
        this.moved = false;
        this.moving = true;
        var cur = params.data.originalEvent.changedTouches[0];
        this.lastPt = { x: cur.pageX, y: cur.pageY };
    }

    _onDragEnd(params) {
        if (this.moving) {
            var cur = params.data.originalEvent.changedTouches[0];
            var newPos = { x: cur.pageX, y: cur.pageY };
            var delta = { x: newPos.x - this.lastPt.x, y: newPos.y - this.lastPt.y };
            this.renderer.view.parentElement.parentElement.scrollTop -= delta.y;
            this.renderer.view.parentElement.parentElement.scrollLeft -= delta.x;
            this.moving = false;
        }
        
        if (!this.moved) {
            this.editor.hide();
        }

        this.moving = false;
    }

    _onDragMove(params) {
        if (this.moving) {
            var cur = params.data.originalEvent.changedTouches[0];
            var newPos = { x: cur.pageX, y: cur.pageY };
            var delta = { x: newPos.x - this.lastPt.x, y: newPos.y - this.lastPt.y };
            if (Math.abs(delta.x) > 1) {
                this.lastPt.x = newPos.x;
                this.renderer.view.parentElement.parentElement.scrollLeft -= delta.x;
            }
            if (Math.abs(delta.y) > 1) {
                this.lastPt.y = newPos.y;
                this.renderer.view.parentElement.parentElement.scrollTop -= delta.y;
            }

            this.moved = true;
        }
    }

    bindEvent() {
        this.bg.interactive = true;
        this.bg.on("mousedown", this._onDragStart, this)
            .on("touchstart", this._onDragStart, this)
            .on("mouseup", this._onDragEnd, this)
            .on("touchend", this._onDragEnd, this)
            .on("mousemove", this._onDragMove, this)
            .on("touchmove", this._onDragMove, this);
    }
}