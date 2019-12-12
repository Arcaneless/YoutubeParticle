// Get the canvas element form the page
var canvas = document.getElementById("c");

/* Rresize the canvas to occupy the full page,
   by getting the widow width and height and setting it to canvas*/

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

//Done! Enjoy full page canvas!
var speed = 100; // pixel/ms
var distance = 300; // pixel
function Dot(fabricObject, duration) {
    this.fabricObject = fabricObject;
    this.duration = duration;
}
var dots = [];
var canvas = new fabric.Canvas('c', { renderOnAddRemove: false });
fabric.Object.prototype.transparentCorners = false;

function initialize() {
    for (let i=0; i<50; i++) {
        let o = new fabric.Circle({
            radius: 5,
            fill: 'black',
            selectable: false,
            left: window.innerWidth * Math.random(),
            top: window.innerHeight * Math.random(),
            objectCaching: false
        });
        dots.push(new Dot(o, 1000 * distance / speed));
    }
}

function animate() {
    for (let dot of dots) {
        let angle = Math.random() * Math.PI * 2;
        dot.fabricObject.animate(
            {left: dot.fabricObject.left + (distance * Math.cos(angle)),
             top:  dot.fabricObject.top + (distance * Math.sin(angle))},
            {
                duration: dot.duration,
            })
    }
    setTimeout(motionLoop, 10);
}

function motionLoop() {
    canvas.renderAll();
    setTimeout(motionLoop, 10);
}


initialize();
for (let dot of dots) {
    canvas.add(dot.fabricObject);
}
animate();