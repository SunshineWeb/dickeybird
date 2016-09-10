var Cmd = require("../cmd.js");
export class MoveCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
    }

    execute(startPos) {
        this.isMoved = false;
        this._startPos = startPos;
        this._changed = { x: 0, y: 0 };
        this._path = [];
        this._viewModel.setStatus("move");
        this.app.viewer.isNeedUpdate = true;
        this._viewModel.node
            .on("mousemove", this._onDragMove, this)
            .on("touchmove", this._onDragMove, this);
        return this;
    }

    complete() {
        this._viewModel.node
            .off("mousemove", this._onDragMove)
            .off("touchmove", this._onDragMove);
        if (this.isMoved) {
            this._viewModel.setStatus("normal");
            var pos = this._viewModel.entity.pos;
            this._viewModel.update({ pos: { x: pos.x + this._changed.x, y: pos.y + this._changed.y } });
            this.app.connector.api.update({ id: this._viewModel.entity.id, pos: this._viewModel.entity.pos });
        }
        return this;
    }

    cancel() {
        this._viewModel.node
            .off("mousemove", this._onDragMove)
            .off("touchmove", this._onDragMove);
        this._viewModel.node.alpha = 1;
        this.app.viewer.renderer.view.style.cursor = "default";
        this.app.viewer.isNeedUpdate = true;
        return this;
    }

    _onDragMove(event) {
        this.isMoved = true;
        event.stopPropagation();
        var newPos = event.data.global.clone();
        var delta = { dx: newPos.x - this._startPos.x, dy: newPos.y - this._startPos.y };
        this._startPos = newPos;
        this.move(delta);
        return true;
    }

    move(delta) {
        this._path.push(delta);
        this._changed.x += delta.dx / this._viewModel.view.scale;
        this._changed.y += delta.dy / this._viewModel.view.scale;
        this._viewModel.move(delta);
        return this;
    }
}