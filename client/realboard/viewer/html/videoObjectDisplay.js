var baseObjectDisplay = require("../display.js").Display;
var Moveable = require("./Moveable.js").Moveable;
//var defaultTexture = PIXI.Texture.fromVideo('res/video/testVideo.mp4');
export class VideoDisplay extends baseObjectDisplay {
    constructor(app, entity) {
        super(app, entity);
        this.htmlNode = document.createElement("video");
        this.htmlNode.src = 'http://pixijs.github.io/examples/required/assets/testVideo.mp4';
        this.htmlNode.autoplay = "autoplay";
        this.htmlNode.controls = "controls";
        this.htmlNode.currentTime = entity.currentTime || 1;
        //this._loadTexture();
        //this.node.position.x = entity.pos.x;
        //this.node.position.y = entity.pos.y;
        this.htmlNode.style.top = entity.pos.y + "px";
        this.htmlNode.style.left = entity.pos.x + "px";
        this._move = new Moveable(this.htmlNode, this.view);
    }
    get editor() {
        return this.view.imageEditor;
    }

    static _isObjectUrl(src) {
        return src.startsWith("blob:");
    }

    show() {
        this.view.addDisplayObject(this);
    }

    update(entity) {
        if (entity.src && entity.src != this.entity.src) {
            if (this._isObjectUrl(this.entity.src)) {
                URL.revokeObjectURL(this.entity.src);
            }

            this.entity.src = entity.src;
            //this._loadTexture();
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
                    if (this.entity.width) {
                        this.node.width = this.entity.width;
                        this.node.height = this.node.width * e.height / e.width;
                    } else {

                    }
                    this.view.isNeedUpdate = true;
                    loading.hide();
                });
            }

            this.view.isNeedUpdate = true;
        } else {
            //this.node.texture = defaultTexture;
            this.showEditor();
        }
    }
}
baseObjectDisplay.register("video", VideoDisplay);

