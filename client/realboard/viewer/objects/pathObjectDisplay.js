var baseObjectDisplay = require("../displayObject.js").displayObject;
export class GraphicDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.node = new PIXI.Graphics();//
        this.node.lineStyle(6, 0xffd900, 1);
        var box = { x: 100000, y: 100000, x2: 0, y2: 0 };
        entity.paths.forEach(item => {
            item.forEach((pt, index) => {
                if (!index) {
                    this.node.moveTo(pt.x, pt.y);
                } else {
                    this.node.lineTo(pt.x, pt.y);
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

    }

}
baseObjectDisplay.register("path", GraphicDisplay);