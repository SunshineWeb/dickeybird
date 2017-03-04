export class MouseEvents {
    constructor(viewer) {
        this.view = viewer;
        this._currentMoveTarget = null;
    }

    onDragStart(event) {
        // one touches
        if (!event.data.originalEvent.touches || event.data.originalEvent.touches.length <= 1) {
            this.dragging = true;
            if (event.target.vm && event.target.vm.moveCmd) {
                if (this.interval) clearTimeout(this.interval);
                this._currentMoveTarget = event.target.vm;
                this.interval = setTimeout(() => {
                    if (!this._moved) {
                        this._currentMoveTarget.moveCmd.execute(this._startPos);
                    }
                }, 80);
            } else {

            }
            this._startPos = event.data.global.clone();
            this._moved = false;
        }

        return false;
    }

    onDragEnd(event) {
        if (this.dragging) {
            if (!this._moved) {
                this.view.click();
                if (this._currentMoveTarget && !this._currentMoveTarget.moveCmd.isMoved) {
                    this._currentMoveTarget.moveCmd.cancel();
                    this._currentMoveTarget.click();
                }
                else {
                    this._currentMoveTarget && this._currentMoveTarget.moveCmd.complete();
                }
            }
            this.dragging = false;
        } else {
            if (this.interval) {
                clearTimeout(this.interval);
                this.interval = null;
            }
        }
        this._currentMoveTarget = null;
        return true
    }

    onDragMove(event) {
        if (this.dragging) {
            this._moved = true;
            if (event.target.vm !== this._currentMoveTarget) {
                this._currentMoveTarget && this._currentMoveTarget.moveCmd.cancel();
                this._currentMoveTarget = null;
            } else {
                event.stopPropagation();
            }
            if (this.interval) clearTimeout(this.interval);
            this.interval = null;
            var newPos = event.data.global.clone();
            var delta = { x: newPos.x - this._startPos.x, y: newPos.y - this._startPos.y };
            this.view.pan(delta.x, delta.y);
            this._startPos = newPos;
        }
        return true;
    }
}