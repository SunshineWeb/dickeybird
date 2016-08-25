export class MenuToolBar {
    constructor(container) {
        this._container = container || document.body;
        this._root = container || document.createElement("ul");
        //this._container.appendChild(this._root);
    }
    addMenuItem(text, handler) {
        var memuItem = document.createElement("li");
        memuItem.innerText = text;
        memuItem.onclick = handler;
        memuItem.onmousedown = (e) => {
            e.stopPropagation();
            return false;
        }
        this._root.appendChild(memuItem);
    }
    removeMenuItem() {

    }
}