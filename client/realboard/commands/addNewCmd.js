var Cmd = require("../cmd.js");
var commandMove = require("./moveCmd.js");
var commandEdit = require("./editCmd.js");
var view = require("../viewer/displayObject.js");

export class AddNew extends Cmd.Command {
    constructor(app, data) {
        super(app);
        //this._parent = app.getEntity(data.parentid);
        this._viewer = app.viewer;
        this._data = data;
        this.entity = data;
    }
    execute(local) {
        var centerPt = this._viewer.getVisibleCenterPoint();
        centerPt.x -= 50;
        centerPt.y -= 40;
        this.entity.pos = this.entity.pos || centerPt;
        this.app.add(this.entity);
        var _display = view.displayObject.create(this.app, this.entity);
        _display.show();

        _display.moveCmd = new commandMove.MoveCmd(this.app, _display);
        _display.editCmd = new commandEdit.EditCmd(this.app, _display);

        this.complete(local);
    }
    complete(local) {
        if (!local)
            this.app.connector.api.update(this.entity);
    }
}