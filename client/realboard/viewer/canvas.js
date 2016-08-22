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
        return obj;
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

    _getPoint(eventData) {
        var cur = eventData;
        if (eventData.changedTouches) {
            cur = eventData.changedTouches[0];
        }

        return { x: cur.pageX, y: cur.pageY };
    }

    _onDragStart(params) {
        params.stopPropagation();
        this.moved = false;
        if (!params.data.originalEvent.touches || params.data.originalEvent.touches.length === 1) {
            this.moving = true;
        }
        this.lastPt = this._getPoint(params.data.originalEvent);
        return true
    }

    _onDragEnd(params) {
         params.stopPropagation();
        if (this.moving) {
            var newPos = this._getPoint(params.data.originalEvent);
            this._move(newPos, true);
            this.moving = false;
        }

        if (!this.moved) {
            this.editor.hide();
        }

        this.moving = false;
        return true
    }

    _move(newPos, force) {
        var delta = { x: newPos.x - this.lastPt.x, y: newPos.y - this.lastPt.y };
        var curEle = this.renderer.view.parentElement.parentElement;
        delta.x = curEle.scrollLeft - delta.x > 0 ? delta.x : curEle.scrollLeft;
        delta.y = curEle.scrollTop - delta.y > 0 ? delta.y : curEle.scrollTop;
        if (force || Math.abs(delta.x) > 1) {
            this.lastPt.x = newPos.x;
            curEle.scrollLeft -= delta.x;
        }
        if (force || Math.abs(delta.y) > 1) {
            this.lastPt.y = newPos.y;
            curEle.scrollTop -= delta.y;
        }
    }

    _onDragMove(params) {
         params.stopPropagation();
        if (this.moving) {
            var newPos = this._getPoint(params.data.originalEvent);
            this._move(newPos);
            this.moved = true;
        }
        return true
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