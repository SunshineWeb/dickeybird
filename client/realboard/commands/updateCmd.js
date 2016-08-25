var Cmd = require("../cmd.js");
export class UpdateCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel;
    }

    execute(data) {
        var vm = this.app.viewModels.get(data.id);
        vm.update(data);
    }

    commit() {

    }

    complete() {
        this.app.viewer.editor.hide();
    }
}