var editor = document.createElement("div");
editor.className = "text-editor";
var head = document.createElement("div");
head.innerText = "Editor";

editor.appendChild(head);
var input = document.createElement("textarea");

editor.appendChild(input);

input.onkeypress = function (e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
        editor.blur();
    }
}



export class TextEditor {
    constructor(container) {
        container.appendChild(editor);
    }

    show(pos, size, entity) {
        editor.style.top = pos.y;
        editor.style.left = pos.x;

        input.value = entity.text;
        editor.style.display = "block";
        input.style.height = size.height;
        input.style.width = size.width;
        input.focus();
        editor.onmousedown = function (event) {
            event.stopPropagation();
        }

        return new Promise((resolve, reject) => {
            document.onmousedown = (e) => {
                this.hide();
                resolve(input.value);
            }

            this._resolve = resolve;
        });

    }

    hide() {
        editor.style.display = "none";
        editor.onclick = null;
        document.onmousedown = null;
        this._resolve && this._resolve(input.value);
    }
}