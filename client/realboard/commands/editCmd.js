var Cmd = require("../cmd.js");
export class EditCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
    }

    execute(changed) {
        this.complete(changed);
    }

    complete(changed) {
        if (changed && changed.updated) {
            this._viewModel.update(changed.value);
            this.app.connector.api.update(this._viewModel.entity);
        }
    }
}