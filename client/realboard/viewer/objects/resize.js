var baseObjectDisplay = require("../displayObject.js").displayObject;
export class ResizeDisplay extends baseObjectDisplay {
    constructor(app) {
        super(app);
        this.node = new PIXI.Graphics();

        this.left = new PIXI.Graphics();
        this.left.beginFill(0x123456, 1);
        this.left.drawCircle(0, 0, 5);
        this.left.endFill();
        //this.right = this.node.drawCircle(0, 0, 15);
        //this.top = this.node.drawCircle(0, 0, 15);
        //this.bottom = this.node.drawCircle(0, 0, 15);
        this.node.endFill();
        this.node.addChild(this.left);
        this.left.interactive = true;
        this.left
            .on("mouseup", this.onDragEnd, this)
            .on("mousedown", this.onDragStart, this)
            .on("mousemove", this.onDragMove, this);
        //this.node.addChild(this.right);
        //this.node.addChild(this.top);
        //this.node.addChild(this.bottom);
    }

    onDragStart(event) {
        // one touches
        event.stopPropagation();
        if (!event.data.originalEvent.touches || event.data.originalEvent.touches.length <= 1) {
            this.dragging = true;
            this._startPos = event.data.global.clone();
            this._moved = false;
        }

        return false;
    }

    onDragEnd(event) {
        if (this.dragging) {

            this.dragging = false;
        }
        return true
    }

    onDragMove(event) {
        if (this.dragging) {
            event.stopPropagation();
            var newPos = event.data.global.clone();
            var delta = { x: newPos.x - this._startPos.x, y: newPos.y - this._startPos.y };
            this.left.position.x += delta.x;
            this.left.position.y += delta.y;
            this._startPos = newPos;
        }
        return true;
    }

    show(viewModel) {
        if (this.vm === viewModel) return;
        this.vm = viewModel;
        var bbox = viewModel.getBBox();
        console.log(bbox)
        this.left.x = viewModel.node.position.x;
        this.left.y = viewModel.node.position.y + bbox.height / 2;
        //this.node.position.x = viewModel.node.position.x;
        //this.node.position.y = viewModel.node.position.y;
        super.show();
    }
}
var _resize = null;
baseObjectDisplay.showResize = function (vm) {
    //_resize = _resize || new ResizeDisplay(vm.app);
    //_resize.show(vm);
}