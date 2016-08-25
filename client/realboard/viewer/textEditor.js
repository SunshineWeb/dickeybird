var editor = document.createElement("div");
editor.className = "text-editor";
var head = document.createElement("div");
head.innerText = "Editor";

editor.appendChild(head);
var input = document.createElement("textarea");
var delta = {};
var last = {};

editor.appendChild(input);

input.onkeypress = function (e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
        editor.blur();
    }
}

var movehandler;
function drag_start(event) {
    last = { x: event.screenX, y: event.screenY };
    console.log(event.target)
    var style = window.getComputedStyle(editor, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));

}
function drag_over(event) {
    var newlast = { x: event.screenX, y: event.screenY };
    delta.dx = newlast.x - last.x;
    delta.dy = newlast.y - last.y;
    last = newlast;
    if (delta.dx || delta.dy) {
        if (movehandler) {
            movehandler(delta);
        }
    }
    event.preventDefault();
    return false;
}
function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    console.log(offset)
    editor.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    editor.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}
editor.draggable = true;
editor.onmouseup = (e) => {
    e.stopPropagation();
}
editor.onmousedown = (e) => {
    e.stopPropagation();
}


export class TextEditor {
    constructor(container) {
        container.appendChild(editor);
        editor.addEventListener('dragstart', drag_start, false);
        document.body.addEventListener('dragover', drag_over, false);
        document.body.addEventListener('drop', drop, false);
    }

    show(pos, size, entity) {
        editor.style.top = pos.y + "px";
        editor.style.left = pos.x + "px";

        input.value = entity.text;
        editor.style.display = "block";
        input.style.height = size.height + "px";
        input.style.width = size.width + "px";
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

    move(handler) {
        movehandler = handler;
    }

    hide() {
        editor.style.display = "none";
        editor.onclick = null;
        document.onmousedown = null;
        this._resolve && this._resolve(input.value);
    }
}