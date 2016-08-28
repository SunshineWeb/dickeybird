var svg = require("./canvas.js");
var editor = require("./editor.js");

function onCreateNew() {
    editor.createNew && editor.createNew();
}

svg(editor);

document.getElementById("newText").onclick = onCreateNew;