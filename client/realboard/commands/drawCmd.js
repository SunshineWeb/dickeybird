var Cmd = require("../cmd.js");
export class DrawCmd extends Cmd.Command {
    constructor(app, viewModel) {
        super(app);
        this._viewModel = viewModel || new PIXI.Graphics();
        this.path = [];
        this.paths = [];
        this._viewModel.beginFill(0, 0);
        this._viewModel.drawRect(0, 0, this.app.viewer.renderer.width, this.app.viewer.renderer.height);
        this._viewModel.endFill(0, 0);
        this._viewModel.position.x = 0;
        this._viewModel.position.y = 0;
        this.app.viewer.addDisplayObject(this._viewModel);
        this.app.viewer.isNeedUpdate = true;
    }

    execute() {

        this._viewModel.interactive = true;
        this._viewModel.on('mousedown', this._onDragStart, this)
            .on('touchstart', this._onDragStart, this)
            // events for drag end
            .on('mouseup', this._onDragEnd, this)
            .on('mouseupoutside', this._onDragEnd, this)
            .on('touchend', this._onDragEnd, this)
            .on('touchendoutside', this._onDragEnd, this)
            // events for drag move
            .on('mousemove', this._onDragMove, this)
            .on('touchmove', this._onDragMove, this);
        this.app.viewer.isNeedUpdate = true;
    }

    complete() {
        var box = { x: 0, y: 0, x2: 0, y2: 0 };
        console.log(this.paths[0].length);
        this.paths = this.paths.filter(path => path.length > 1).map(path => {
            return simplify(path, 0.25, false);
        });
         console.log(this.paths[0].length);

        this.paths.forEach(item => {
            item.forEach(subitem => {
                if (subitem.x > box.x2) {
                    box.x2 = subitem.x;
                }
                if (subitem.x < box.x) {
                    box.x = subitem.x;
                }
                if (subitem.y > box.y2) {
                    box.y2 = subitem.y;
                }
                if (subitem.y < box.y) {
                    box.y = subitem.y;
                }
            });
        });
        this._viewModel.interactive = false;
        //this._viewModel.removeAllListener();
        this.app.viewer.removeDisplayObject(this._viewModel);
        this.app.viewer.isNeedUpdate = true;
        return this.paths;
    }

    move(newPosition) {
        if (this.path.length) {
            this._viewModel.lineTo(newPosition.x, newPosition.y);
        } else {
            this._viewModel.lineStyle(6, 0xffd900, 1);
            this._viewModel.moveTo(newPosition.x, newPosition.y);
        }
        this.path.push(newPosition);
        this.app.viewer.isNeedUpdate = true;
    }

    _onDragStart(event) {
        event.stopPropagation();
        this.drawing = true;
        this.move(event.data.getLocalPosition(this._viewModel.parent));
    }

    _onDragEnd(event) {
        event.stopPropagation();
        this.data = null;
        this.drawing = false;
        this.paths.push(this.path);
        this.path = [];
    }

    _onDragMove(event) {
        event.stopPropagation();
        if (this.drawing) {
            this.move(event.data.getLocalPosition(this._viewModel.parent));
        }
    }

}