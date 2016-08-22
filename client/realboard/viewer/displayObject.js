class displayObject {
    constructor(app, entity) {
        this.app = app;
        this.view = app.viewer;
        this.entity = entity;
        this.moveCmd = new commandMove.MoveCmd(this.app, this);
        this.editCmd = new commandEdit.EditCmd(this.app, this);
    }

    show() {
        if (!this.node) {
            this.node = _createNewObject(this.entity);
            this.node.vm = this;
            this.view.addDisplayObject(this);
        }
    }

    hide() {
        this.view.removeDisplayObject(this);
    }

    static _createNewObject(entity) {
        var newDisplay = null;
        switch (entity.type) {
            case "text":
                newDisplay = new PIXI.Text(entity.text, { fontSize: '30px', fill: 0xff1010, wordWrap: true, wordWrapWidth: 300 });
                break;
            case "image":
                // create a texture from an image path
                var texture = PIXI.Texture.fromImage(entity.src);
                var loader = new PIXI.loaders.Loader();
                loader.add("src", entity.src).load((loader, resources) => {
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
                newDisplay.drawRect(0, 0, entity.width, entity.height);
                break;
            case "circle":
                break;
            case "video":
                // create a video texture from a path
                var texture = PIXI.Texture.fromVideo(entity.src);

                // create a new Sprite using the video texture (yes it's that easy)
                newDisplay = new PIXI.Sprite(texture);
                break;
            case "path":
                newDisplay = new PIXI.Graphics();//
                newDisplay.lineStyle(6, 0xffd900, 1);
                var box = { x: 100000, y: 100000, x2: 0, y2: 0 };
                entity.paths.forEach(item => {
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
            newDisplay.position.x = entity.pos.x;
            newDisplay.position.y = entity.pos.y;
        }

        return newDisplay;
    }
}