// Get the canvas element form the page
var canvas = document.getElementById("c");

/* Rresize the canvas to occupy the full page,
   by getting the widow width and height and setting it to canvas*/

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

//Done! Enjoy full page canvas!
var speed = 20; // pixel/ms
var distance = 300; // pixel
var fadingFactor = 0.2; // 0-1
var connectingFactor = 10; // >1
function Dot(fabricObject, duration) {
    this.fabricObject = fabricObject;
    this.duration = duration;
    this.life = 0;
    this.lifeEnd = false;
    this.fadeOut = false;
}
var dots = [];
var canvas = new fabric.Canvas('c', { renderOnAddRemove: false });
fabric.Object.prototype.transparentCorners = false;

function easeLinear (t, b, c, d) {
    return b + (t/d) * c;
}

function initialize() {
    for (let i=0; i<50; i++) {
        addDot();
    }
}

function addDot() {
    let o = new fabric.Circle({
        radius: 5,
        fill: 'black',
        opacity: 0,
        selectable: false,
        left: window.innerWidth * Math.random(),
        top: window.innerHeight * Math.random(),
        objectCaching: false,
        easing: easeLinear
    });
    let dot = new Dot(o, 1000 * (distance * (Math.random() + 0.5)) / speed);
    dots.push(dot);


    let angle = Math.random() * Math.PI * 2;
    dot.fabricObject.animate(
        {left: dot.fabricObject.left + (distance * Math.cos(angle)),
            top:  dot.fabricObject.top + (distance * Math.sin(angle))},
        {
            duration: dot.duration,
        });
    dot.fabricObject.animate(
        'opacity', 1,
        {
            duration: dot.duration * fadingFactor,
        });

    canvas.add(dot.fabricObject);
}

function onChangeDot(dot) {
    dot.life += 10;
    if (dot.life >= dot.duration) {
        dot.lifeEnd = true;
        canvas.getObjects().forEach((obj) => {
            if (obj === dot.fabricObject) {
                canvas.remove(obj);
            }
        });
        for (let i = 0; i < dots.length; i++) {
            if (dots[i] === dot) {
                dots.slice(i, 1);
                addDot();
                return;
            }
        }
    }
    if ((dot.life >= (dot.duration * (1 - fadingFactor))) && !dot.fadeOut) {
        dot.fadeOut = true;
        dot.fabricObject.animate(
            'opacity', 0,
            {
                duration: dot.duration * fadingFactor /2,
            });
    }
}

function animate() {
    setTimeout(motionLoop, 10);
}

function motionLoop() {
    canvas.renderAll();
    for (let dot of dots) {
        if (!dot.lifeEnd) onChangeDot(dot);
    }
    setTimeout(motionLoop, 10);
}


initialize();
animate();