var baseDisplay = require("./display.js");
var loadingStatus = require("../html/loading.js").LoadingStatus;
export class displayObject extends baseDisplay.Display {
    constructor(app, entity) {
        super(app);
        this.entity = entity;
    }

    show() {
        if (!this.node) {

            this.node = this._createNewObject(this.entity);
            this.node.interactive = true;
            this.node.vm = this;

            this.node.on('mousedown', this._onDragStart, this)
                .on('touchstart', this._onDragStart, this)

            this.node.on("mouseup", this._onDragEnd, this)
                .on("touchend", this._onDragEnd, this)
                .on('mouseupoutside', this._onDragEnd, this)
                .on('touchendoutside', this._onDragEnd, this);
            this.view.addDisplayObject(this);
        }
    }

    hide() {
        this.view.removeDisplayObject(this);
    }

    moveTo(newPosition) {
        this._startPos = newPosition;
        var delta = { dx: newPosition.x - this._startPos.x, dy: newPosition.y - this._startPos.y }
        this.move(delta);
    }

    move(delta) {
        this.entity.pos.x += delta.dx;
        this.entity.pos.y += delta.dy;
        this.node.position.x = this.entity.pos.x;
        this.node.position.y = this.entity.pos.y;

        this.view.isNeedUpdate = true;
    }
    update(data) {
        if (data.type === "text") {
            this.entity.text = data.text;
            this.node.text = vm.entity.text;
        }

        this.entity.pos = data.pos || vm.entity.pos;
        this.node.position.x = vm.entity.pos.x;
        this.node.position.y = vm.entity.pos.y;
        this.view.isNeedUpdate = true;
    }

    _onDragStart(event) {
        this.node.alpha = 0.5;
        if (!event.data.originalEvent.touches || event.data.originalEvent.touches.length <= 1) {
            this.view.isHandling = true;
            event.stopPropagation();
            this.data = event.data;
            this.dragging = true;
            this._startPos = this.data.getLocalPosition(this.node.parent);

            this.node.inMoving = false;
            this.moveCmd && this.moveCmd.execute(this._startPos);
        }
        this.view.isNeedUpdate = true;
        return true
    }

    _onDragEnd(event) {
        this.node.alpha = 1;
        var curPos = this.data.getLocalPosition(this.node.parent);
        if (Math.abs(this._startPos.x - curPos.x) + Math.abs(this._startPos.y - curPos.y) > 0) {
            // moved
            event.stopPropagation();
            this.dragging = false;
            this.data = null;

        } else {
            //clicked
            this.editCmd && this.editCmd.execute();
        }

        this.moveCmd && this.moveCmd.complete();
        this.view.isNeedUpdate = true;
        this.view.isHandling = false;
        return true
    }

    _onDragMove(event) {
        event.stopPropagation();
        this.move(this._viewModel.data.getLocalPosition(this._viewModel.node.parent));

        return true
    }

    _createNewObject(entity) {
        var newDisplay = null;
        switch (entity.type) {
            case "text":
                newDisplay = new PIXI.Text(entity.text, { fontSize: '30px', fill: 0xff1010, wordWrap: true, wordWrapWidth: 300 });
                break;
            case "image":
                // create a texture from an image path
                var texture = PIXI.Texture.fromImage(entity.src);
                var loader = new PIXI.loaders.Loader();
                var loading = new loadingStatus(this.view.htmlContainer).show(entity.pos, { width: 100, height: 80 });
                loader.add("src", entity.src).load((loader, resources) => {
                    newDisplay.texture = resources.src.texture;
                    newDisplay.width = 200;
                    newDisplay.height = 200 * resources.src.texture.height / resources.src.texture.width;
                    this.view.isNeedUpdate = true;
                    loading.hide();
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

    static register(typeName, type) {
        registeredTypes.set(typeName, type);
    }

    static createObject(app, entity) {
        if (registeredTypes.has(entity.type)) {
            return new registeredTypes.get(entity.type)(app, entity);
        }
    }
}

var registeredTypes = new Map();