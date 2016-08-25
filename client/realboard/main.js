require("../style.css");
var App = require("./models/app.js");
var commands = require("./commands/addNewCmd.js");
var menus = require("./menu.js");
var editors = require("./viewer/textEditor.js");
var viewer = require('./viewer/canvas.js');
var commandDraw = require("./commands/drawCmd.js");
var commandUpdate = require("./commands/updateCmd.js").UpdateCmd;
var editor = require("./editor.js");

window.onload = function () {
    var panel = document.getElementById("panel")
    window.app = new App.App();
    window.app.viewer = new viewer.Canvas(window.app, panel);
    window.app.viewer.show();
    window.app.viewer.editor = new editors.TextEditor(document.getElementById("html-render"));
    window.app.connector = editor;

    var toolbar = new menus.MenuToolBar(document.getElementsByTagName("ul")[0]);
    toolbar.addMenuItem("Text", function () {
        var addNew = new commands.AddNew(window.app, { type: "text", text: "this is test2" }).execute();
        editor.api.update(addNew.entity);
    });

    toolbar.addMenuItem("Rect", function () {
        var addNew = new commands.AddNew(window.app, { type: "rect",  width: 100, height: 80 });
        addNew.execute();
    });

    toolbar.addMenuItem("Image", function () {
        var addNew = new commands.AddNew(window.app, { type: "image", src: "http://i0.wp.com/fun2video.in/wp-content/uploads/2012/08/love-birds-cute-picture.jpg", width: 100, height: 80 });
        addNew.execute();
    });
    var currentCmd;

    toolbar.addMenuItem("Draw", function (current) {
        if (this.className != "down") {
            this.className = "down";
            currentCmd = new commandDraw.DrawCmd(window.app);
            currentCmd.execute();
        } else {
            this.className = "";
            if (currentCmd) {
                currentCmd.complete();
                currentCmd = null;
            }
        }
    });

    toolbar.addMenuItem("+", function (event) {
        event.stopPropagation();
        window.app.viewer.zoomout();
    });
    toolbar.addMenuItem("-", function (event) {
        event.stopPropagation();
        window.app.viewer.zoomin();
    });


    var source = new EventSource('/api/data/2');
    source.addEventListener('message', function (e) {
        var json = JSON.parse(e.data);
        if (json.d.uid != editor.uid) {
            if (json.d.id && app.viewModels.has(json.d.id)) {
                new commandUpdate(window.app, app.viewModels.get(json.d.id)).execute(json.d);
            } else
                new commands.AddNew(window.app, json.d).execute();
        }
        console.log(json.d);
    }, false);
    source.addEventListener('open', function (e) {
        console.log("open!");
    }, false);
    source.addEventListener('error', function (e) {
        if (e.readyState == EventSource.CLOSED) {
            console.log("error!");
        }
    }, false);

}

window.onresize = function () {
    window.app.viewer.resize();
}