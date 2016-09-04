var Moveable = require("./Moveable.js").Moveable;
var editor = document.createElement("div");
var head = document.createElement("div");
var unDraggableElement = document.createElement("span")
var input = document.createElement("textarea");

editor.appendChild(head);
editor.appendChild(unDraggableElement);
unDraggableElement.appendChild(input);

editor.className = "text-editor";
head.innerText = "Editor";

input.onkeypress = function (e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
        editor.blur();
    }
}

input.onmousedown = function (event) {
    event.stopPropagation();
}

export class TextEditor extends Moveable {
    constructor(container, isMobile) {
        super(editor, isMobile);
        container.appendChild(editor);
        this.makeChildUnDraggable(unDraggableElement);
    }

    show(pos, size, entity) {
        editor.style.top = pos.y + "px";
        editor.style.left = pos.x + "px";
        editor.style.display = "block";

        input.value = entity.text;
        input.style.height = size.height + "px";
        input.style.width = size.width + "px";
        input.focus();

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
        }).then((v) => {
            var updated = (entity.text != v);
            entity.text = v;
            return Promise.resolve({ updated: updated, value: entity });
        });

    }

    hide() {
        editor.style.display = "none";
        this._resolve && this._resolve(input.value);
        return this;
    }
}