var Cmd = require("../cmd.js");
export class MoveCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
        this._startPos = viewModel.position;
    }

    execute(param) {
        this._startPos = param;
        this._viewModel.node.interactive = true;
        this._viewModel.node
            .on('mousemove', this._onDragMove, this)
            .on('touchmove', this._onDragMove, this);
    }

    complete() {
        this._viewModel.node
            .off('mousemove', this._onDragMove)
            .off('touchmove', this._onDragMove);
        this.app.connector.api.update(this._viewModel.entity);
    }

    move(newPosition) {
        this._viewModel.move({ dx: newPosition.x - (this._startPos || this._viewModel._startPos).x, dy: newPosition.y - (this._startPos || this._viewModel._startPos).y });
        this._startPos = newPosition;
    }
    _onDragMove(event) {
        event.stopPropagation();
        this.move(this._viewModel.data.getLocalPosition(this._viewModel.node.parent));

        return true
    }
}