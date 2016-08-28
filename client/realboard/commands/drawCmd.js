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
        this._viewModel.addNew = (a) => {
            this.addNew(a);
        }
    }

    addNew(path) {
        var data = { paths: [path], type: "path", pos: { x: 0, y: 0 }, stroke: 3, color: 0xf1d900 };
        var addNew = new commands.AddNew(this.app, data);
        addNew.execute();
        addNew.complete();
    }

    complete() {
        this._viewModel.hide();
    }
}