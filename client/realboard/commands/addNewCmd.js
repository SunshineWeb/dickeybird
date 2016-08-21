var Cmd = require("../cmd.js");
var commandMove = require("./moveCmd.js");
var commandEdit = require("./editCmd.js");

export class AddNew extends Cmd.Command {
    constructor(app, data) {
        super(app);
        //this._parent = app.getEntity(data.parentid);
        this._viewer = app.viewer;
        this._data = data;
        this.entity = data;
    }
    execute() {
        this._viewer.addDisplayObject(this._createNewObject());
        this.app.add(this.entity);
    }
    _createNewObject() {
        var newDisplay = null;
        switch (this._data.type) {
            case "text":
                newDisplay = new PIXI.Text(this._data.text, { fontSize: '30px', fill: 0xff1010, wordWrap: true, wordWrapWidth: 300 });
                newDisplay.editCmd = new commandEdit.EditCmd(this.app, newDisplay);
                break;
            case "image":
                // create a texture from an image path
                var texture = PIXI.Texture.fromImage(this._data.src);
                var loader = new PIXI.loaders.Loader();
                loader.add("src", this._data.src).load((loader, resources) => {
                    newDisplay.texture = resources.src.texture;
                    this.app.viewer.isNeedUpdate = true;
                    newDisplay.width = 200;
                    newDisplay.height = 200 * resources.src.texture.height / resources.src.texture.width;
                });
                // create a new Sprite using the texture
                newDisplay = new PIXI.Sprite();
                newDisplay.width = 200;
                break;
            case "rect":
                newDisplay = new PIXI.Graphics();//
                newDisplay.beginFill(0, 0);
                newDisplay.lineStyle(5, 0xffd900, 1);
                newDisplay.drawRect(0, 0, this._data.width, this._data.height);
                break;
            case "circle":
                break;
            case "video":
                // create a video texture from a path
                var texture = PIXI.Texture.fromVideo(this._data.src);

                // create a new Sprite using the video texture (yes it's that easy)
                newDisplay = new PIXI.Sprite(texture);
                break;
            case "path":
                newDisplay = new PIXI.Graphics();//
                newDisplay.lineStyle(10, 0xffd900, 1);
                var box = { x: 100000, y: 100000, x2: 0, y2: 0 };
                this._data.paths.forEach(item => {
                    item.forEach((pt, index) => {
                        if (!index) {
                            newDisplay.moveTo(pt.x, pt.y);
                        } else {
                            newDisplay.lineTo(pt.x, pt.y);
                        }

                        if (pt.x > box.x2) {
                            box.x2 = pt.x;
                        }
                        if (pt.x < box.x) {
                            box.x = pt.x;
                        }
                        if (pt.y > box.y2) {
                            box.y2 = pt.y;
                        }
                        if (pt.y < box.y) {
                            box.y = pt.y;
                        }
                    });
                });

                //newDisplay.beginFill(0, 0);
                //newDisplay.lineStyle(0, 0xffffff, 1)
                //newDisplay.drawRect(box.x, box.y, box.x2 - box.x, box.y2 - box.y);

                break;
            default:
                break;

        }

        if (newDisplay) {
            newDisplay.position.x = this._data.pos.x;
            newDisplay.position.y = this._data.pos.y;

            newDisplay.moveCmd = new commandMove.MoveCmd(this.app, newDisplay);
        }

        return newDisplay;
    }
}