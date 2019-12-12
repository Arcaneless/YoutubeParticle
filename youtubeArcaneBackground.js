// Get the canvas element form the page
let elem = document.getElementById("drawing");
var two = new Two({
    fullscreen: true
}).appendTo(elem);

/* Rresize the canvas to occupy the full page,
   by getting the widow width and height and setting it to canvas*/

//Done! Enjoy full page canvas!
let frame = 10; //ms/frame
let speed = 0.2; // pixel/ms
let distance = 1000; // pixel
let fadingFactor = 0.5; // 0-1
let connectingFactor = 100; // >1
let connectionBuffer = 100;
function Dot(object, vector, duration) {
    this.object = object;
    this.duration = duration;
    this.vector = vector;
    this.life = 0;
    this.lifeEnd = false;
    this.fadeOut = false;
}
function Line(object, circle1, circle2) {
    this.object = object;
    this.c1 = circle1;
    this.c2 = circle2;
    this.hasConnection = function(c1, c2) {
        return ((this.c1 === c1) && (this.c2 === c2)) || ((this.c1 === c2) && (this.c2 === c1));
    };
}
let dots = [];
let lines = [];
function linesWithConnection(c1, c2) {
    for (let line of lines) {
        if (line.hasConnection(c1 ,c2)) return true;
    }
    return false;
}

function initialize() {
    for (let i=0; i<100; i++) {
        addDot();
    }
}

function addDot() {
    let angle = Math.random() * Math.PI * 2;
    let vector = new Two.Vector(speed * Math.cos(angle), speed * Math.sin(angle));
    let o = two.makeCircle(Math.random() * two.width, Math.random() * two.height, 1);
    o.opacity = 0;
    o.fill = 'black';
    let dot = new Dot(o, vector, (distance * (Math.random() + 0.5)) / speed);

    dots.push(dot);


}

function onChangeDot(dot) {
    dot.life += frame;
    if (dot.life <= (dot.duration * fadingFactor) && dot.object.opacity <= 1) {
        dot.object.opacity += 0.01;
    }

    if (dot.life >= dot.duration) {
        dot.lifeEnd = true;
        for (let i = 0; i < dots.length; i++) {
            if (dots[i] === dot) {
                two.remove(dot.object);
                dots.splice(i, 1);
                //console.log('3');
                addDot();
                //console.log('4');
                return;
            }
        }

    } else if ((dot.life >= (dot.duration * (1 - fadingFactor))) && dot.object.opacity > 0) {
        dot.fadeOut = true;
        dot.object.opacity -= 0.01;
    }

    //console.log(dot.vector.toString());
    dot.object.translation.addSelf(dot.vector);
}

function eulerDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
}

// TODO: Fix the performance issue
function updateLines() {
    for (let d1 of dots) {
        let o1 = d1.object;
        for (let d2 of dots) {
            let o2 = d2.object;
            if (d1 === d2) continue;
            // Adding
            let distance = eulerDistance(o1.translation.x, o1.translation.y, o2.translation.x, o2.translation.y);
            let connected = linesWithConnection(o1, o2);
            if (!connected) {
                if ((distance <= connectingFactor)
                    && !(d1.fadeOut || d2.fadeOut)
                    && !(d1.lifeEnd || d2.lifeEnd)) {
                    let line = two.makeLine(o1.translation.x, o1.translation.y, o2.translation.x, o2.translation.y);
                    line.fill = 'black';
                    lines.push(new Line(line, o1, o2));
                }
            } else if (connected) {
                if ((distance >= (connectingFactor + connectionBuffer))
                    || (d1.fadeOut || d2.fadeOut)
                    || (d1.lifeEnd || d2.lifeEnd)) {
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].hasConnection(o1, o2)) {
                            two.remove(lines[i].object);
                            lines.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    // Updating
    for (let line of lines) {
        line.object.vertices[0].x = line.c1.translation.x - line.object.translation.x;
        line.object.vertices[0].y = line.c1.translation.y - line.object.translation.y;
        line.object.vertices[1].x = line.c2.translation.x - line.object.translation.x;
        line.object.vertices[1].y = line.c2.translation.y - line.object.translation.y;
    }
}

function animate() {
    for (let dot of dots) {
        if (!dot.lifeEnd) onChangeDot(dot);
    }
    updateLines();
    //console.log(dots.length);
    two.update();
}

initialize();
setInterval(animate, frame);