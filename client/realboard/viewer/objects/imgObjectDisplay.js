var baseObjectDisplay = require("../displayObject.js").displayObject;
var defaultTexture = PIXI.Texture.fromImage('res/image/noimage.png');
export class ImageDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.node = new PIXI.Sprite();
        this._loadTexture();
        this.node.position.x = entity.pos.x;
        this.node.position.y = entity.pos.y;
    }
    get editor() {
        return this.view.imageEditor;
    }

    _isObjectUrl(src) {
        return src.startsWith("blob:");
    }

    update(entity) {
        if (entity.src && entity.src != this.entity.src) {
            if (this._isObjectUrl(this.entity.src)) {
                URL.revokeObjectURL(this.entity.src);
            }

            this.entity.src = entity.src;
            this._loadTexture();
        }
        super.update(entity);
    }

    _loadTexture() {
        if (this.entity.src) {
            this.node.texture = PIXI.Texture.fromImage(this.entity.src);
            if (!this.node.texture.baseTexture.hasLoaded) {
                var loading = new this.view.loadingStatus(this.view.htmlContainer).show(this.entity.pos, { width: 100, height: 80 });
                this.node.texture.baseTexture.isLoading = true;
                this.node.texture.baseTexture.on("loaded", (e) => {
                    this.node.width = 200;
                    this.node.height = 200 * e.height / e.width;
                    this.view.isNeedUpdate = true;
                    loading.hide();
                });
            }

            this.view.isNeedUpdate = true;
            //this.node.width = this.entity.width || 160;
            //this.node.height = this.entity.height || 120;
            //this.view.isNeedUpdate = true;
            /*
            var loading = new this.view.loadingStatus(this.view.htmlContainer).show(this.entity.pos, { width: 100, height: 80 });
            new PIXI.loaders.Loader().add("src", this.entity.src).load((loader, resources) => {
                this.node.texture = resources.src.texture;
                this.node.width = 200;
                this.node.height = 200 * resources.src.texture.height / resources.src.texture.width;
                this.view.isNeedUpdate = true;
                loading.hide();
            });*/
        } else {
            this.node.texture = defaultTexture;
            this.node.width = 154;
            this.node.height = 82;
            this.showEditor();
        }
    }
}
baseObjectDisplay.register("image", ImageDisplay);