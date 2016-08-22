require("../style.css");
var App = require("./models/app.js");
var commands = require("./commands/addNewCmd.js");
var menus = require("./menu.js");
var editors = require("./viewer/textEditor.js");
var viewer = require('./viewer/canvas.js');
var commandDraw = require("./commands/drawCmd.js");

window.onload = function () {
    var panel = document.getElementById("panel")
    window.app = new App.App();
    window.app.viewer = new viewer.Canvas(panel);
    window.app.viewer.show();
    window.app.viewer.editor = new editors.TextEditor(panel.parentElement);

    var toolbar = new menus.MenuToolBar(document.getElementsByTagName("ul")[0]);
    toolbar.addMenuItem("Text", function () {
        var addNew = new commands.AddNew(window.app, { type: "text", text: "this is test2", pos: { x: 300, y: 100 } });
        addNew.execute().editCmd.execute();
    });

    toolbar.addMenuItem("Rect", function () {
        var addNew = new commands.AddNew(window.app, { type: "rect", text: "this is test2", pos: { x: 300, y: 300 }, width: 100, height: 80 });
        addNew.execute();
    });

    toolbar.addMenuItem("Image", function () {
        var addNew = new commands.AddNew(window.app, { type: "image", src: "http://i0.wp.com/fun2video.in/wp-content/uploads/2012/08/love-birds-cute-picture.jpg", pos: { x: 300, y: 200 }, width: 100, height: 80 });
        addNew.execute();
    });
    var currentCmd;

    toolbar.addMenuItem("Draw", function (current) {
        if (this.className != "down") {
            this.className = "down";
            currentCmd = new commandDraw.DrawCmd(window.app, new PIXI.Graphics());
            currentCmd.execute();
        } else {
            this.className = "";
            if (currentCmd) {
                var data = { paths: currentCmd.complete(), type: "path", pos: { x: 0, y: 0 } };
                currentCmd = null;
                var addNew = new commands.AddNew(window.app, data);
                addNew.execute();
            }
        }
    });
}