var Cmd = require("../cmd.js");
var Display = require("../viewer/displayDraw.js");
var commands = require("./addNewCmd.js");
export class DrawCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel || new Display.displayDraw(app);
        this.path = [];
        this.paths = [];
    }

    execute() {
        this._viewModel.show();
    }

    complete() {
        this._viewModel.hide();
        var data = { paths: this._viewModel.getData(), type: "path", pos: { x: 0, y: 0 } };
        var addNew = new commands.AddNew(this.app, data);
        addNew.execute();
        addNew.complete();
    }
}