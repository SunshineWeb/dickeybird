export class MenuToolBar {
    constructor(container) {
        this._container = container || document.body;
        this._root = document.createElement("ul");
        this._container.appendChild(this._root);
    }
    addMenuItem(text, handler) {
        var memuItem = document.createElement("li");
        memuItem.innerText = text;
        //memuItem.onclick = handler;
        var isTousch = false;
        memuItem.onmousedown = function (e) { e.stopPropagation(); if (!isTousch) handler.call(this, e); };
        memuItem.ontouchstart = function (e) { isTousch = true; handler.call(this, e); };
        memuItem.onmouseup = function (e) { e.stopPropagation();};
        memuItem.ontouchend = function (e) { e.stopPropagation();};
        this._root.appendChild(memuItem);
        return memuItem;
    }
    removeMenuItem() {

    }
}