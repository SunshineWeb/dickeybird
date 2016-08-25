export class LoadingStatus {
    constructor(container) {
        this._container = container;
    }

    show(position, size) {
        if (!this.node) {
            this.node = document.createElement("div");
            this.node.className = "loading-status";

            this._container.appendChild(this.node);
            this.node.style.top = position.y + "px";
            this.node.style.left = position.x + "px";
            this.node.style.width = size.width + "px";
            this.node.style.height = size.height + "px";
            this.node.innerHTML = "<div></div>";
        }

        return this;
    }

    hide() {
        this._container.removeChild(this.node);
        return this;
    }
}