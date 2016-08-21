var Cmd = require("../cmd.js");
export class MoveCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
        this._startPos = viewModel.position;
        this._viewModel.buttonMode = true;
        this._viewModel.interactive = true;
        this._viewModel.on('mousedown', this._onDragStart, this)
            .on('touchstart', this._onDragStart, this)
            // events for drag end
            .on('mouseup', this._onDragEnd, this)
            .on('mouseupoutside', this._onDragEnd, this)
            .on('touchend', this._onDragEnd, this)
            .on('touchendoutside', this._onDragEnd, this)
            // events for drag move
            .on('mousemove', this._onDragMove, this)
            .on('touchmove', this._onDragMove, this);
    }

    execute(param) {
        var newPosition = param || this.data.getLocalPosition(this._viewModel.parent);
        this.move(newPosition);
    }

    move(newPosition) {
        this._viewModel.position.x += newPosition.x - this._startPos.x;
        this._viewModel.position.y += newPosition.y - this._startPos.y;
        this._startPos = newPosition;
        this.app.viewer.isNeedUpdate = true;
    }

    _onDragStart(event) {
        console.log("object");
        this.app.viewer.isHandling = true;
        event.stopPropagation();
        this.data = event.data;
        this._viewModel.alpha = 0.5;
        this.dragging = true;
        this._startPos = this.data.getLocalPosition(this._viewModel.parent);
        this.app.viewer.isNeedUpdate = true;
        this._viewModel.inMoving = false;
        return true
    }

    _onDragEnd(event) {
        this.app.viewer.isHandling = false;
        event.stopPropagation();
        this._viewModel.alpha = 1;
        if (this.dragging) {
            this.move(this.data.getLocalPosition(this._viewModel.parent));
        }
        this.dragging = false;
        this.data = null;
        this.app.viewer.isNeedUpdate = true;
        return true
    }

    _onDragMove(event) {
        if (this.dragging) {
            event.stopPropagation();
            this.move(this.data.getLocalPosition(this._viewModel.parent));
            this._viewModel.inMoving = true;
        }
        return true
    }
}