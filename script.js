/*-------------------------------------------------------------
Created By: August Toman-Yih
Main Git Repository: https://github.com/atomanyih/Calligrapher
--------------------------------------------------------------*/
var canvas = document.getElementById('canvas'),
    width = canvas.width,
    height = canvas.height,
    context = canvas.getContext("2d");

function drawCircle(x,y,r,ctx) {
    ctx.beginPath();
    ctx.arc(x,y,r, 0, 2*Math.PI,false);
    //ctx.fill();
    ctx.stroke();
}

function drawLine(x0,y0,x1,y1,ctx) {
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}


//FIXME REORGANIZE EBERYTING
//--- constants ---//
RESOLUTION = 4; 
WEIGHT = 15;
MIN_MOUSE_DIST = 5;
SPLIT_THRESHOLD = 8;
SQUARE_SIZE = 300;
    
//--- variables ---//
strokes = [];
points = [];
lines = [];
currentPath = [];
errPoint = [];
mouseDown = false;


function update() {
    context.clearRect(0,0,width,height);
    for(var i = 0; i<strokes.length; i++)
        strokes[i].draw(WEIGHT,context);
}

function drawCurrentPath() {
    context.beginPath();
    context.moveTo(currentPath[0][0],currentPath[0][1]);
    for(var i = 1; i<currentPath.length; i++) 
        context.lineTo(currentPath[i][0],currentPath[i][1]);
    context.stroke();
}

canvas.onmousedown = function(event) {
    mouseDown = true;
    currentPath = [];
};

canvas.onmouseup = function(event) {
    mouseDown = false;
    points = currentPath;
    
    var curves = fitStroke(points);
    //var curves = [leastSquaresFit(points)]; //reparameterize testing
    
    strokes.push(new Stroke(curves));
    //strokes[0]=new Stroke(curves); //reparameterize testing
    
    update();
};

canvas.onmousemove = function(event) {
    var mousePos = [event.clientX,event.clientY];
    if(mouseDown) {
        
        if(currentPath.length != 0) {
            if(getDist(mousePos,currentPath[currentPath.length-1])>=MIN_MOUSE_DIST)
                currentPath.push(mousePos);
            drawCurrentPath();
        } else
            currentPath.push(mousePos);
    } 
};

keydown = function(event) {
    var k = event.keyCode;
    console.log(k);
    if(k==68) {
        strokes.pop();
    }
    update();
};

window.addEventListener("keydown",keydown,true);

update();
