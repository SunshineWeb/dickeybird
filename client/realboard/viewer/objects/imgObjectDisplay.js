var baseObjectDisplay = require("../displayObject.js").displayObject;
export class ImageDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.node = new PIXI.Sprite();
        var texture = PIXI.Texture.fromImage(entity.src);
        var loader = new PIXI.loaders.Loader();
        //var loading = new loadingStatus(this.view.htmlContainer).show(entity.pos, { width: 100, height: 80 });
        loader.add("src", entity.src).load((loader, resources) => {
            this.node.texture = resources.src.texture;
            this.node.width = 200;
            this.node.height = 200 * resources.src.texture.height / resources.src.texture.width;
            this.view.isNeedUpdate = true;
            //loading.hide();
        });
    }

}
baseObjectDisplay.register("image", ImageDisplay);