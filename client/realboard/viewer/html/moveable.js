export class Moveable {
    constructor(element, viewer) {
        this._element = element;
        this.makeDraggable(viewer.isMobile);
        this._isMobile = viewer.isMobile;
        this.viewer = viewer;
        //this._startMoveHanlder;
        //this._moveHanlder;
        //this._endMoveHanlder;
    }

    makeDraggable(isMobile) {
        if (!this.draggable) {
            this.draggable = true;
            if (isMobile) {
                this._element.addEventListener('touchstart', (e) => this._drag_start(e), false);
                this._element.addEventListener('touchmove', (e) => this._drag_over(e), false);
                document.body.addEventListener('touchend', (e) => this._drop(e), false);
                this._element.addEventListener('touchendoutside', (e) => this._drop(e), false);
            }
            else {
                this._element.addEventListener('mousedown', (e) => this._drag_start(e), false)
                //this._element.firstElementChild.addEventListener('mousemove', (e) => this._drag_over(e), false);
                document.body.addEventListener('mousemove', (e) => this._drag_over(e), false);
                document.body.addEventListener('mouseup', (e) => this._drop(e), false);
                this._element.addEventListener('mouseupoutside', (e) => this._drop(e), false);
            }

            //this._element.addEventListener('mouseleave', (e) => this._drop(e), false);

        }
        return this;
    }

    makeChildUnDraggable(child) {
        //child.addEventListener('mousedown', (e) => { e.stopPropagation(); return true; }, false);
        return this;
    }

    start(handler) {
        this._startMoveHandler = handler;
        return this;
    }
    move(handler) {
        this._movehandler = handler;
        return this;
    }
    end(handler) {
        this._endMoveHandler = handler;
        return this;
    }
    getPagePoint(eventData) {
        var cur = eventData;
        if (this._isMobile && eventData.changedTouches && eventData.changedTouches.length) {
            cur = eventData.changedTouches[0];
        }

        return { x: cur.pageX, y: cur.pageY };
    }
    _drag_start(event) {
        event.preventDefault();
        event.stopPropagation();
        this._last = this.getPagePoint(event);
        this._element.style.opacity = 0.5;

        var style = this._element.style;
        this._position = { x: parseInt(style.left.replace("px", "")), y: parseInt(style.top.replace("px", "")) };
        if (this._startMoveHandler) this._startMoveHandler();
    }
    _drag_over(event) {
        if (this._last) {
            var newlast = this.getPagePoint(event);
            var delta = {};
            delta.dx = newlast.x - this._last.x;
            delta.dy = newlast.y - this._last.y;
            this._last = newlast;

            if (delta.dx || delta.dy) {
                this._position.x += delta.dx / this.viewer.scale;
                this._position.y += delta.dy / this.viewer.scale;
                this._element.style.top = this._position.y + "px";
                this._element.style.left = this._position.x + "px";
                if (this._movehandler) {
                    this._movehandler(delta);
                }
            }

            event.preventDefault();
        }

        return false;
    }
    _drop(event) {
        event.preventDefault();
        if (this._last) {
            //event.preventDefault();
            if (this._endMoveHandler) this._endMoveHandler();
            this._last = null;
            this._element.style.opacity = 1;
        }
        return false;
    }

}
