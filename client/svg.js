
var draw = SVG(document.getElementById('svg-container'));

var moving = false;

var lastPt = {};

draw.on("mousedown", function (params) {
    moving = true;
    lastPt.x = params.clientX;
    lastPt.y = params.clientY;
});

draw.on("mouseup", function (params) {
    if (moving) {
        var vb = draw.viewbox();
        var delta = { x: params.clientX - lastPt.x, y: params.clientY - lastPt.y };

        draw.viewbox(vb.x - delta.x, vb.y - delta.y, vb.width, vb.height);
        moving = false;
    }
});

draw.on("mousemove", function (params) {
    if (moving) {
        var delta = { x: params.clientX - lastPt.x, y: params.clientY - lastPt.y };

        if (Math.abs(delta.x) + Math.abs(delta.y) > 5) {
            lastPt.x = params.clientX;
            lastPt.y = params.clientY;
            var vb = draw.viewbox();

            draw.viewbox(vb.x - delta.x, vb.y - delta.y, vb.width, vb.height);
        }
    }
});
var o = draw.text('fdsfafdfddfsdfsdf </br> fdsfddff fdsfafdfddfsdfsdf fdsfafdfddfsdfsdf fdsfafdfddfsdfsdf fdsfafdfddfsdfsdffdsfafdfddfsdfsdf ');
for (var i = 0; i < 10000; i++) {
    var l = Math.floor(i / 200);
    var text = o.clone().move(l * 200, 50 * (i % 200));
}

var a = "test";
function name(params) {
    animate();
    if (!params) return;
    switch (params.type) {
        case "text":
            break;
        case "image":
            break;
        case "path":
            break;
        case "image":
            break;
        case "image":
            break;
    }
    return draw;
}

console.log(a);

var stats2 = new Stats();
document.body.appendChild(stats2.dom);
//stats2.dom.style.top = "50px";
function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    stats2.update();
    // each frame we spin the bunny around a bit
    //bunny.rotation += 0.01;

    // this is the main render call that makes pixi draw your container and its children.
    
}

module.exports = name;