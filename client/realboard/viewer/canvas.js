export class Canvas {
    constructor(app, viewElement) {
        this.app = app;
        this.isNeedUpdate = true;
        this.renderer = new PIXI.autoDetectRenderer(1280, 2000, { backgroundColor: 0x7ac9bb, view: viewElement });
        this.stage = new PIXI.Container();
        this.htmlContainer = document.getElementById("html-render");
        this.bg = new PIXI.Graphics();//
        this.bg.beginFill(0, 0);
        this.bg.drawRect(0, 0, 10000, 10000);
        this.bg.endFill();
        this._drawBg();
        this.bg.position.x = -5000;
        this.bg.position.y = -5000;
        this.stage.addChild(this.bg);
    }

    _drawBg() {
        this.bg.lineStyle(1, 0xd9e9a9, 0.5);
        for (var i = 0; i < 100; i++) {
            this.bg.moveTo(0, i * 100);
            this.bg.lineTo(10000, i * 100);
            this.bg.moveTo(i * 100, 0);
            this.bg.lineTo(i * 100, 10000);
        }
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

            if (_this.isNeedUpdate) {
                _this.isNeedUpdate = false;
                _this.renderer.render(_this.stage);
            }

            _this.stats && _this.stats.update();
            requestAnimationFrame(animate);
        }
        this.resize();
        this.bindEvent();
        animate();
    }

    resize() {
        var panel = this.renderer.view.parentElement.parentElement;
        this.renderer.resize(panel.clientWidth, panel.clientHeight);
        this.isNeedUpdate = true;
    }

    getVisiblePoint(x, y) {

        return { x: Math.floor((x || 0) - this.stage.position.x), y: Math.floor((y || 0) - this.stage.position.y) }
    }

    getVisibleCenterPoint() {
        var dx = this.renderer.width / this.stage.scale.x / 2, dy = this.renderer.height / this.stage.scale.y / 2;
        return this.getVisiblePoint(dx, dy);
    }

    getPagePoint(eventData) {
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
        this.lastPt = this.getPagePoint(params.data.originalEvent);
        return true
    }

    _onDragEnd(params) {
        params.stopPropagation();
        if (this.moving && this.moved) {
            var newPos = this.getPagePoint(params.data.originalEvent);
            this._move(newPos, true);
        }

        if (this.moving && !this.moved) {
            this.editor.hide();
            this.imageEditor.hide();
        }

        this.moving = false;
        return true
    }

    zoomout() {
        this.zoom(0.1);
    }

    zoomin() {
        this.zoom(-0.1);
    }

    zoom(delta) {
        var newScale = this.stage.scale.x + delta;
        this.stage.scale.x = this.stage.scale.y = (newScale < 0.1 ? 0.1 : newScale);
        this.htmlContainer.style.transform = "scale(" + this.stage.scale.x + ")";
        this.isNeedUpdate = true;
    }

    pan(dx, dy) {
        this.stage.position.x += (dx || 0);
        this.stage.position.y += (dy || 0);
        this.stage.position.x = this.stage.position.x > 5000 ? 5000 : this.stage.position.x < -5000 ? -5000 : this.stage.position.x;
        this.stage.position.y = this.stage.position.y > 5000 ? 5000 : this.stage.position.y < -5000 ? -5000 : this.stage.position.y;

        this.htmlContainer.style.left = this.stage.position.x + "px";
        this.htmlContainer.style.top = this.stage.position.y + "px";
        this.renderer.view.parentElement.dataset.pos = "(" + this.stage.position.x + ", " + this.stage.position.y + ")";
        this.isNeedUpdate = true;
    }

    _move(newPos, force) {
        var delta = { x: newPos.x - this.lastPt.x, y: newPos.y - this.lastPt.y };
        this.lastPt = newPos;
        this.pan(delta.x, delta.y);
    }

    _onDragMove(params) {
        params.stopPropagation();
        if (this.moving) {
            var newPos = this.getPagePoint(params.data.originalEvent);
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
            .on("touchmove", this._onDragMove, this)
            .on('mouseupoutside', this._onDragEnd, this)
            .on('touchendoutside', this._onDragEnd, this);
    }
}