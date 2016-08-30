var Cmd = require("../cmd.js");
export class MoveCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
    }

    execute() {
        this._changed = { x: 0, y: 0 };
        this._path = [];
        return this;
    }

    complete() {
        var pos = this._viewModel.entity.pos;
        this._viewModel.update({ pos: { x: pos.x + this._changed.x, y: pos.y + this._changed.y } });
        this.app.connector.api.update({ id: this._viewModel.entity.id, pos: this._viewModel.entity.pos });
        return this;
    }

    move(delta) {
        this._path.push(delta);
        this._changed.x += delta.dx;
        this._changed.y += delta.dy;
        this._viewModel.move(delta);
        return this;
    }
}