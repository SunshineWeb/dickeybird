var MouseEvents = require("./MouseEvents.js").MouseEvents;
export class Canvas {
    constructor(app, viewElement) {
        this.app = app;
        this.renderer = new PIXI.autoDetectRenderer(1280, 2000, { transparent: true, view: viewElement });
        this.stage = new PIXI.Container();
        this.htmlContainer = document.getElementById("html-render");
        this._drawBg();
        this._scalePow = 0;
        this._bg = document.getElementById("bg");
        this.isNeedUpdate = true;
        this.mouseEvents = new MouseEvents(this);
    }

    _drawBg() {
        this.bg = new PIXI.Graphics();//
        this.bg.beginFill(0, 0);
        this.bg.drawRect(-50000, -50000, 100000, 100000);
        this.bg.endFill();
        /*  this.bg.lineStyle(1, 0xd9e9a9, 0.5);
          var g1 = new PIXI.Graphics();
          var g2 = new PIXI.Graphics();
          var g4 = new PIXI.Graphics();
          g2.lineStyle(2, 0xd9e9a9, 0.5);
          g1.lineStyle(1, 0xd9e9a9, 0.5);
  
          for (var i = -100; i <= 100; i++) {
              if (i % 5 === 0) {
                  //this.bg.lineStyle(2, 0xd9e9a9, 0.5);
                  g2.moveTo(-5000, i * 50);
                  g2.lineTo(5000, i * 50);
                  g2.moveTo(i * 50, -5000);
                  g2.lineTo(i * 50, 5000);
              }
              else {
                  //this.bg.lineStyle(1, 0xd9e9a9, 0.5);
                  g1.moveTo(-5000, i * 50);
                  g1.lineTo(5000, i * 50);
                  g1.moveTo(i * 50, -5000);
                  g1.lineTo(i * 50, 5000);
              }/*
          }
          this.bg.addChild(g1);
          this.bg.addChild(g2);*/
        this.stage.addChild(this.bg);
    }

    addDisplayObject(obj) {
        if (obj.entity && obj.entity.id) {
            this.app.viewModels.set(obj.entity.id, obj);
        }
        if (obj.node) {
            this.stage.addChild(obj.node);
            this.isNeedUpdate = true;
        }

        if (obj.htmlNode) {
            this.htmlContainer.appendChild(obj.htmlNode);
        }
        return obj;
    }

    removeDisplayObject(obj) {
        if (obj.entity && obj.entity.id) {
            this.app.viewModels.delete(obj.entity.id);
        }
        if (obj.node)
            this.stage.removeChild(obj.node);

        if (obj.htmlNode) {
            this.htmlContainer.removeChild(obj.htmlNode);
        }

        this.isNeedUpdate = true;
    }

    updateDisplayObject(obj) {
        this.isNeedUpdate = true;
    }

    show() {
        var _this = this;
        var translate = document.getElementById("bg-translate");
        function animate() {

            if (_this.isNeedUpdate) {
                _this.isNeedUpdate = false;

                if (_this._transform) {
                    _this._transform = false;
                    _this.htmlContainer.style.left = _this.stage.position.x + "px";
                    _this.htmlContainer.style.top = _this.stage.position.y + "px";
                    _this.htmlContainer.style.transform = "scale(" + _this.stage.scale.x + ")";
                    _this.htmlContainer.style.webkitTransform = _this.htmlContainer.style.transform;
                    _this.renderer.view.parentElement.dataset.pos = "(" + _this.stage.scale.x + ", " + Math.floor(_this.stage.position.x) + ", " + Math.floor(_this.stage.position.y) + ")";
                    translate.setAttribute("transform", _this.htmlContainer.style.transform);
                    _this._bg.setAttribute("transform", "translate(" + (_this.stage.position.x % (1250*_this.stage.scale.x)) + "," + (_this.stage.position.y % (1250*_this.stage.scale.x))+ ")");
                }
                _this.renderer.render(_this.stage);
            }

            _this.stats && _this.stats.update();
            requestAnimationFrame(animate);
            //setTimeout(animate, 1);
        }
        this.resize(true);
        this.bindEvent();
        animate();
    }
    destory() {
        this.stage.destory();
        this.renderer.destroy();
    }
    resize(force) {
        var panel = this.renderer.view.parentElement.parentElement;
        if (force || !this.isMobile)
            this.renderer.resize(panel.clientWidth, panel.clientHeight);
        this.isNeedUpdate = true;
        this._transform = true;
    }

    click() {
        this.editor.hide();
        this.imageEditor.hide();
    }

    getVisiblePoint(x, y) {
        return this.stage.toLocal({ x: Math.ceil((x || 0)), y: Math.ceil((y || 0)) });
    }

    getVisibleCenterPoint() {
        var dx = this.renderer.width / 2, dy = this.renderer.height / 2;
        return this.getVisiblePoint(dx, dy);
    }

    toCanvasPoint(pt) {
        return { x: pt.x * this.renderer.resolution, y: pt.y * this.renderer.resolution };
    }

    toScreenPoint(pt) {
        return { x: pt.x / this.renderer.resolution, y: pt.y / this.renderer.resolution };
    }

    getPagePoint(eventData) {
        var cur = eventData;
        if (eventData.changedTouches) {
            cur = eventData.changedTouches[0];
        }

        return { x: cur.pageX / this.renderer.resolution, y: cur.pageY / this.renderer.resolution };
    }

    setCursor(cursor) {
        this.renderer.view.style.cursor = cursor;
    }

    resetCursor() {
        this.renderer.view.style.cursor = "default";
    }

    zoomout() {
        this.zoom(Math.pow(Math.sqrt(2), ++this._scalePow));
    }

    zoomin() {
        this.zoom(Math.pow(Math.sqrt(2), --this._scalePow));
    }

    zoom(newScale) {
        var m = new PIXI.Matrix();
        m.scale(newScale / this.stage.scale.x, newScale / this.stage.scale.x);
        var pt = {
            x: this.stage.position.x - this.renderer.width / 2,
            y: this.stage.position.y - this.renderer.height / 2
        }
        var npt = m.apply(pt);

        this.stage.scale.x = this.stage.scale.y = newScale;
        this.pan((npt.x - pt.x), (npt.y - pt.y));
    }

    pan(dx, dy) {
        this.stage.position.x += Math.ceil(dx || 0);
        this.stage.position.y += Math.ceil(dy || 0);
        //this.stage.position.x = this.stage.position.x > 5000 ? 5000 : this.stage.position.x < -5000 ? -5000 : this.stage.position.x;
        //this.stage.position.y = this.stage.position.y > 5000 ? 5000 : this.stage.position.y < -5000 ? -5000 : this.stage.position.y;
        this.isNeedUpdate = true;
        this._transform = true;
    }

    get scale() {
        return this.stage.scale.x;
    }

    get isMobile() {
        return this.renderer.plugins.accessibility.isMobileAccessabillity;
    }

    _move(newPos, force) {
        var delta = { x: newPos.x - this.lastPt.x, y: newPos.y - this.lastPt.y };
        this.lastPt = newPos;
        this.pan(delta.x, delta.y);
    }

    bindEvent() {
        this.stage.interactive = true;
        this.stage.on("mousedown", this.mouseEvents.onDragStart, this.mouseEvents)
            .on("touchstart", this.mouseEvents.onDragStart, this.mouseEvents)
            .on("mouseup", this.mouseEvents.onDragEnd, this.mouseEvents)
            .on("touchend", this.mouseEvents.onDragEnd, this.mouseEvents)
            .on("mousemove", this.mouseEvents.onDragMove, this.mouseEvents)
            .on("touchmove", this.mouseEvents.onDragMove, this.mouseEvents)
            .on('mouseupoutside', this.mouseEvents.onDragEnd, this.mouseEvents)
            .on('touchendoutside', this.mouseEvents.onDragEnd, this.mouseEvents);
    }
}