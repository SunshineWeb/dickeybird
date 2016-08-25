var Cmd = require("../cmd.js");
export class EditCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
    }

    execute(event) {
        if (this._viewModel.inMoving) {
            return;
        }
        if (event)
            event.data.originalEvent.stopPropagation();

        this.app.viewer.editor.hide();
        this.app.viewer.editor.show(this._viewModel.node.position, this._viewModel.node, this._viewModel.node).then(text => {

            if (this._viewModel.node.text != text) {
                this._viewModel.node.text = text;
                this._viewModel.entity.text = text;
                this.app.connector.api.update(this._viewModel.entity);
                this.app.viewer.isNeedUpdate = true;
            }
        });
        this.app.viewer.editor.move(d => {
            this._viewModel.move(d);
        });
    }

    commit() {

    }

    complete() {
        this.app.viewer.editor.hide();
    }
}