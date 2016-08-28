require("./viewer/html/style.less");
var App = require("./models/app.js");
var commands = require("./commands/addNewCmd.js");
var menus = require("./menu.js");
var editors = require("./viewer/html/textEditor.js");
var viewer = require('./viewer/canvas.js');
var commandDraw = require("./commands/drawCmd.js");
var commandUpdate = require("./commands/updateCmd.js").UpdateCmd;
var editor = require("./editor.js");
var loadingStatus = require("./viewer/html/loading.js").LoadingStatus;
var imageEditor = require("./viewer/html/imageEditor.js").default;

require("./viewer/objects/imgObjectDisplay.js");
require("./viewer/objects/pathObjectDisplay.js");
require("./viewer/objects/textObjectDisplay.js");
require("./viewer/objects/shapeObjectDisplay.js");
var thumb = require("./viewer/html/leading.js").default;

var Stats = require("../lib/stats.min.js");

function fullScreen() {
    var el = document.documentElement,
        rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
        wscript;

    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}

function exitFullScreen() {
    var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript;

    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

window.onload = function () {

    //stats.dom.style.right = "0px";
    //stats.dom.style.left = "";
    var panel = document.getElementById("panel")
    window.app = new App.App();
    window.app.viewer = new viewer.Canvas(window.app, panel);
    window.app.viewer.show();
    window.app.viewer.editor = new editors.TextEditor(document.getElementById("html-render"));
    window.app.viewer.imageEditor = new imageEditor(document.getElementById("html-render"));
    window.app.connector = editor;
    window.app.viewer.loadingStatus = loadingStatus;
    window.app.viewer.stats = new Stats();
    document.body.appendChild(app.viewer.stats.dom);
    app.viewer.stats.dom.style.left = "";
    app.viewer.stats.dom.style.right = "0";
    app.viewer.stats.dom.style.top = "";
    app.viewer.stats.dom.style.bottom = "0";
    //new thumb(window.app, document.getElementById("thumb")).show();

    var toolbar = new menus.MenuToolBar(document.body);
    toolbar.addMenuItem("Text", function () {
        new commands.AddNew(window.app, { type: "text", text: "text" }).execute();
    });

    toolbar.addMenuItem("Rect", function () {
        new commands.AddNew(window.app, { type: "rect", width: 100, height: 80 }).execute();
    });

    toolbar.addMenuItem("Image", function () {
        var addNew = new commands.AddNew(window.app, { type: "image", src: "", width: 100, height: 80 });
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

    toolbar.addMenuItem("new", function (event) {
        localStorage.setItem("design", "[]");
    });


    var source = new EventSource('/api/data/2?uid=' + window.app.connector.uid);
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

    source.close();
    setTimeout(scrollTo, 0, 0, 0);

    var design = localStorage.getItem("design");
    if (design) {
        var entities = JSON.parse(design);
        entities.forEach((i) => {
            new commands.AddNew(window.app, i).execute();
        });
    }

}

window.onresize = function () {
    window.app.viewer.resize();
}