var Cmd = require("../cmd.js");
export class EditCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
        this._viewModel.on("click", this.execute, this);
        this._viewModel.on("touchend", this.execute, this);
    }

    execute(event) {
        if (this._viewModel.inMoving) {
            return;
        }
        if (event)
            event.data.originalEvent.stopPropagation();

        this.app.viewer.editor.hide();
        this.app.viewer.editor.show(this._viewModel.position, this._viewModel, this._viewModel).then(text => {
            this._viewModel.text = text;
            this.app.viewer.isNeedUpdate = true;
        });
    }

    commit() {

    }

    complete() {
        this.app.viewer.editor.hide();
    }
}