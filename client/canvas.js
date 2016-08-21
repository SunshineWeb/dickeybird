
var renderer = new PIXI.CanvasRenderer(1280, 2000, { backgroundColor: 0xf0f9bb, view: document.getElementById("panel") });

// The renderer will create a canvas element for you that you can then insert into the DOM.
//document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

var selected = [];
var all = [];

// Declare a global variable for our sprite so that the animate function can access it.
var bunny = null;

var isClicked = false;
var downPt = {};
var isUpdated = true;
var stats = new Stats();
document.body.appendChild(stats.dom);
var startPos;
var _app;

function onDragStart(event) {
    event.data.originalEvent.stopPropagation();
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch

    isUpdated = true;
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    isClicked = true;
    startPos = this.data.getLocalPosition(this.parent);
}

function onDragEnd(event) {
    if (event.data.originalEvent.srcElement.nodeName != "CANVAS") return;
    event.data.originalEvent.stopPropagation();
    this.alpha = 1;
    isUpdated = true;
    this.dragging = false;

    if (isClicked) {
        //event.preventDefault();

        onClick(this);
    } else {
        _app.api.update({ data: this.text, id: this.id, x: this.x, y: this.y })
    }
    // set the interaction data to null
    this.data = null;

}

function onDragMove(event) {
    //event.preventDefault();
    //debugger

    if (this.dragging) {
        event.data.originalEvent.stopPropagation();
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x += newPosition.x - startPos.x;
        this.position.y += newPosition.y - startPos.y;
        startPos = newPosition;
        isClicked = false;
        isUpdated = true;
    }
}
var editor = document.createElement("textarea");
editor.addEventListener("blur", function (event) {
    console.log("blur");
    if (selected.text != editor.value) {
        selected.text = editor.value;
        _app.api.update({ data: selected.text, id: selected.id });
        isUpdated = true;
    }
    editor.style.display = "none";
}, true);

editor.onkeypress = function (e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
        editor.blur();
    }
}

var selected = null;
renderer.view.parentNode.appendChild(editor);
function onClick(hit) {
    if (selected && (selected.text != editor.value)) {
        console.log(selected.text != editor.value); selected.text = editor.value; _app.api.update({ data: selected.text, id: selected.id });
    }
    //debugger
    if (hit) {

        selected = hit;
        editor.style.position = "absolute";
        editor.style.top = hit.position.y * stage.scale.y;
        editor.style.left = hit.position.x * stage.scale.x;

        editor.value = hit.text;
        editor.style.height = hit.height * stage.scale.y;
        editor.style.width = hit.width * stage.scale.x;
        editor.style.zIndex = 1;



        editor.style.display = "";
        editor.focus();
        //hit.text = ("this is after click and will change the text length ,so the area of width and height iwll change too!");
        /*
                isUpdated = true;
                var rect = new PIXI.Graphics();//
                rect.beginFill(0, 1);
                rect.drawRect(hit.position.x, hit.position.y, hit.width, hit.height);
        
                rect.lineColor = "#ff0000";
                rect.lineWidth = "#ff0000";
                rect.endFill();
        
                selected.push(rect);
                stage.addChild(rect);
                var index = stage.getChildIndex(rect);
                stage.setChildIndex(hit, index);
        */
    } else {
        editor.style.display = "none";
    }
};

stage.on("click", function () {
    onClick();
});


for (var i = 0; i < 0; i++) {
    var l = Math.floor(i / 100);
    //var text = o.clone().move(l * 200, 15 * (i % 200));
    var text = new PIXI.Text('This is a pixi text,This is a pixi text', { fontSize: '30px', fill: 0xff1010, wordWrap: true, wordWrapWidth: 300 });
    text.position.x = l * 400;
    text.position.y = 50 * (i % 100);
    text.interactive = true;
    text.scale.x = 0.4;
    text.scale.y = 0.4;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    text.buttonMode = true;
    //text.width=200;
    text.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    all.push(text);
    stage.addChild(text);
    isUpdated = true;
}
var moving = false;

window.onresize = function (abc) {
    //debugger
    renderer.resize(document.body.clientWidth * 2, 5000);
    isUpdated = true;
};
renderer.resize(document.body.clientWidth * 2, 5000);
//renderer.resize(1500, 1500);

var lastPt = {};
/*
renderer.view.onclick = function (params) {

    var hit = all.find(i => {
        return i.containsPoint(params);
    });
    //debugger
    if (hit && !selected.find(i => {
        return i.containsPoint(params);
    })) {
        //hit.text = ("this is after click and will change the text length ,so the area of width and height iwll change too!");

        var rect = new PIXI.Graphics();//
        rect.beginFill(0, 1);
        rect.drawRect(hit.position.x, hit.position.y, hit.width, hit.height);

        rect.lineColor = "#ff0000";
        rect.lineWidth = "#ff0000";
        rect.endFill();
        rect.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
        selected.push(rect);
        stage.addChild(rect);
        var index = stage.getChildIndex(rect);
        //stage.setChildIndex(hit, index);

    }
    else if (!hit) {
        selected.forEach(i => {
            stage.removeChild(i);
        });

        selected.length = 0;
    }
};
*/
document.body.addEventListener("mousedown", function (params) {
    if (renderer.view == params.srcElement)
        moving = true;
    lastPt.x = params.pageX;
    lastPt.y = params.pageY;
});

document.body.addEventListener("mouseup", function (params) {
    if (moving) {
        var delta = { x: params.clientX - lastPt.x, y: params.clientY - lastPt.y };

        //draw.viewbox(vb.x - delta.x, vb.y - delta.y, vb.width, vb.height);
        renderer.view.parentNode.scrollTop -= delta.y;
        renderer.view.parentNode.scrollLeft -= delta.x;
        moving = false;
        isUpdated = true;
    }
});

document.body.addEventListener("mousemove", function (params) {

    if (moving) {
        var delta = { x: params.pageX - lastPt.x, y: params.pageY - lastPt.y };

        if (Math.abs(delta.x) + Math.abs(delta.y) > 5) {
            lastPt.x = params.pageX;
            lastPt.y = params.pageY;
            //var vb = draw.viewbox();
            renderer.view.parentNode.scrollTop -= delta.y;
            renderer.view.parentNode.scrollLeft -= delta.x;
            //draw.viewbox(vb.x - delta.x, vb.y - delta.y, vb.width, vb.height);
            //stage.position.x += delta.x;
            //stage.position.y += delta.y;
            isUpdated = true;
        }
    }
});

var stats2 = new Stats();
document.body.appendChild(stats2.dom);
stats2.dom.style.top = "50px";
function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    stats2.update();
    // each frame we spin the bunny around a bit
    //bunny.rotation += 0.01;

    // this is the main render call that makes pixi draw your container and its children.
    if (isUpdated) {
        stats.update();
        isUpdated = false;
        renderer.render(stage);
    }
}

//renderer.render(stage);
stage.scale.x = 2;
stage.scale.y = 2;
console.log(stage.scale);
var count = 0;
module.exports = function (app) {
    _app = app;
    _app.createNew = function () {
        createText({
            data: "new text", x: 100 + renderer.view.parentNode.scrollLeft / 2
            , y: 100 + renderer.view.parentNode.scrollTop / 2
        });
    }
    animate();

    var evtSource = new EventSource("http://192.168.1.101:8088/api/greeting/test", {});
    evtSource.onmessage = function (e) {
        var data = JSON.parse(e.data);
        if (data.uid === app.uid) return;

        if (count > 1000) return;

        count++;

        updateText(data);
        isUpdated = true;
    }
};

function updateText(data) {
    var c = all.filter(i => {
        return i.id === data.id;
    });
    if (c.length) {
        c[0].text = data.data
        c[0].x = data.x || c[0].x;
        c[0].y = data.y || c[0].y;
    } else (createText(data))
}


function createText(data) {
    var text = new PIXI.Text(data.data, { fontSize: '30px', fill: 0xff1010, wordWrap: true, wordWrapWidth: 300 });
    var l = Math.floor(count / 100);
    text.position.x = data.x || l * 400;
    text.position.y = data.y || 50 * (count % 100);
    text.interactive = true;
    text.scale.x = 0.4;
    text.scale.y = 0.4;
    text.id = data.id || _app.util.guid();
    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    text.buttonMode = true;
    //text.width=200;
    text.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    all.push(text);
    stage.addChild(text);
    isUpdated = true;
}