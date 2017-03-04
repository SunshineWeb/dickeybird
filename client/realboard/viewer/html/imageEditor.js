var editor = document.createElement("div");
var input = document.createElement("input");
var label = document.createElement("label");
var head = document.createElement("div");

editor.className = "text-editor";
input.className = "image-src";
input.placeholder = "src";
input.type = "file";
input.accept = "image/gif, image/jpeg, image/png";
head.innerText = "Image Editor";
label.textContent = "src";
editor.appendChild(head);
editor.appendChild(label);
editor.appendChild(input);

var Moveable = require("./Moveable.js").Moveable;
export default class extends Moveable {
    constructor(container, isMobile) {
        super(editor, isMobile);
        container.appendChild(editor);
    }

    show(pos, size, entity) {
        //editor.style.top = pos.y + "px";
        //editor.style.left = pos.x + "px";

        //label.innerText = entity.src;
        //editor.style.display = "block";
        //input.style.width = size.width + "px";
        var isVideo = false;
        input.onchange = (e) => {
            var _this = this;
            var url = input.value;
            var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg"|| ext == "svg")) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    _this._resolve && _this._resolve(e.target.result);
                }

                //_this._resolve && _this._resolve(URL.createObjectURL(input.files[0]));

                reader.readAsDataURL(input.files[0]);
            } else {

            }
        }
        input.click();
        return new Promise((resolve, reject) => {
            this._resolve = resolve;

        }).then((src) => {
            editor.style.display = "none";
            if (src) {
                var updated = (entity.src != src);
                return Promise.resolve({ updated: updated, value: { src: src, isVideo: isVideo } });
            } else {
                return Promise.resolve({ updated: false, value: {} });
            }
        });

    }

    hide() {
        //editor.style.display = "none";
        //this._resolve && this._resolve();
        return this;
    }
}
