var Cmd = require("../cmd.js");
export class UpdateCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
    }

    execute(data) {
        this._viewModel = this.app.viewModels.get(data.id);
        this._viewModel.update(data);
        this.complete();
    }

    commit() {

    }

    complete() {
       
    }
}