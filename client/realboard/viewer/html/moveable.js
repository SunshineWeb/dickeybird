export class Moveable {
    constructor(element) {
        this._element = element;
        this.makeDraggable();
        //this._startMoveHanlder;
        //this._moveHanlder;
        //this._endMoveHanlder;
    }

    makeDraggable() {
        if (!this._element.draggable) {
            this._element.draggable = true;
            this._element.addEventListener('dragstart', (e) => this._drag_start(e), false);
            document.body.addEventListener('dragover', (e) => this._drag_over(e), false);
            document.body.addEventListener('drop', (e) => this._drop(e), false);
        }
        return this;
    }

    makeChildUnDraggable(child) {
        child.draggable = true;
        child.addEventListener('dragstart', (e) => {
            e.preventDefault();
        }, false);
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

    _drag_start(event) {
        this._last = { x: event.screenX, y: event.screenY };
        var style = window.getComputedStyle(event.target, null);
        event.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
        if (this._startMoveHandler) this._startMoveHandler();
    }
    _drag_over(event) {
        if (this._last) {
            var newlast = { x: event.screenX, y: event.screenY };
            var delta = {};
            delta.dx = newlast.x - this._last.x;
            delta.dy = newlast.y - this._last.y;
            this._last = newlast;
            if (delta.dx || delta.dy) {
                if (this._movehandler) {
                    this._movehandler(delta);
                }
            }

            event.preventDefault();
        }

        return false;
    }
    _drop(event) {
        if (this._last) {
            var offset = event.dataTransfer.getData("text/plain").split(',');
            console.log(offset)
            this._element.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
            this._element.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
            event.preventDefault();
            if (this._endMoveHandler) this._endMoveHandler();
            this._last = null;
        }
        return false;
    }

}
