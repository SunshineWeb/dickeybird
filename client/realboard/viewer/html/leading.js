export default class {
    constructor(app, container) {
        //this._container = container || document.body;
        this.renderer = new PIXI.CanvasRenderer(1280, 1000, { backgroundColor: 0xf039bb, view: container });
        this.stage = new PIXI.Container();
        this.stage.addChild(app.viewer.stage);
        //container.appendChild(this.renderer.view);
        this.renderer.view.style.transform = "scale(0.1)";
    }

    show() {
        var _this = this;
        function animate() {
            requestAnimationFrame(animate);
            if (true) {
                //_this.isNeedUpdate = false;
                _this.renderer.render(_this.stage);
            }
        }
        animate();
    }
}