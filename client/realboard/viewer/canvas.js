export class Canvas {
    constructor(app, viewElement) {
        this.app = app;
        this.isNeedUpdate = true;
        this.renderer = new PIXI.CanvasRenderer(1280, 2000, { backgroundColor: 0xf0f9bb, view: viewElement });
        this.stage = new PIXI.Container();
        this.htmlContainer = document.getElementById("html-render");
        this.bg = new PIXI.Graphics();//
        this.bg.beginFill(0, 0);
        this.bg.lineStyle(0, 0xffd900, 1);
        this.bg.drawRect(0, 0, 10000, 10000);
        this.bg.position.x = -5000;
        this.bg.position.y = -5000;
        this.stage.addChild(this.bg);
    }

    addDisplayObject(obj) {
        if (obj.entity && obj.entity.id) {
            this.app.viewModels.set(obj.entity.id, obj);
        }
        this.stage.addChild(obj.node);
        this.isNeedUpdate = true;
        return obj;
    }

    removeDisplayObject(obj) {
        if (obj.entity && obj.entity.id) {
            this.app.viewModels.delete(obj.entity.id);
        }
        this.stage.removeChild(obj.node);
        this.isNeedUpdate = true;
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
        this.resize();
        this.bindEvent();
        animate();
    }

    resize() {
        var panel = document.getElementById("svg-container");
        console.log(panel.parentElement.clientHeight);
        this.renderer.resize(panel.parentElement.clientWidth, panel.parentElement.clientHeight);
        this.isNeedUpdate = true;
    }

    getVisiblePoint(x, y) {

        return { x: Math.floor((x || 0) - this.stage.position.x), y: Math.floor((y || 0) - this.stage.position.y) }
    }

    getVisibleCenterPoint() {
        var dx = this.renderer.width / this.stage.scale.x / 2, dy = this.renderer.height / this.stage.scale.y / 2;
        return this.getVisiblePoint(dx, dy);
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
        if (this.moving && this.moved) {
            var newPos = this._getPoint(params.data.originalEvent);
            this._move(newPos, true);
        }

        if (this.moving && !this.moved) {
            this.editor.hide();
        }

        this.moving = false;
        return true
    }

    zoomout() {
        this.stage.scale.x = this.stage.scale.y = this.stage.scale.x + 0.1;
        this.htmlContainer.style.transform = "scale(" + this.stage.scale.x + ")";
        this.isNeedUpdate = true;
    }

    zoomin() {
        this.stage.scale.x = this.stage.scale.y = this.stage.scale.x - 0.1;
        this.htmlContainer.style.transform = "scale(" + this.stage.scale.x + ")";
        this.isNeedUpdate = true;
    }

    _move(newPos, force) {
        var delta = { x: newPos.x - this.lastPt.x, y: newPos.y - this.lastPt.y };
        var curEle = this.renderer.view.parentElement.parentElement;
        //delta.x = curEle.scrollLeft - delta.x > 0 ? delta.x : curEle.scrollLeft;
        //delta.y = curEle.scrollTop - delta.y > 0 ? delta.y : curEle.scrollTop;
        var htmlContainer = document.getElementById("html-render");
        if (force || Math.abs(delta.x) > 1) {
            this.lastPt.x = newPos.x;
            this.stage.position.x += delta.x;
            htmlContainer.style.left = this.stage.position.x + "px";
        }
        if (force || Math.abs(delta.y) > 1) {
            this.lastPt.y = newPos.y;
            this.stage.position.y += delta.y;
            htmlContainer.style.top = this.stage.position.y + "px";
        }
        this.isNeedUpdate = true;
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