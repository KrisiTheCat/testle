function parseRectFromString(rect){
    rect.left = parseFloat(rect.left);
    rect.top = parseFloat(rect.top);
    rect.width = parseFloat(rect.width);
    rect.height = parseFloat(rect.height);
    return rect;
}
function parsePointFromString(point){
    point.x = parseFloat(point.x);
    point.y = parseFloat(point.y);
    return point;
}

function fillRect(canvas, coords, color){
    var canvasContext = canvas.getContext("2d",{ willReadFrequently: true });
    var width = canvas.width;
    var height = canvas.height;
    canvasContext.beginPath();
    canvasContext.fillStyle = color;
    canvasContext.fillRect(coords.left*width,coords.top*height,coords.width*width,coords.height*height);
}

function clearCanvas(canvas){
    canvas.getContext("2d",{ willReadFrequently: true }).clearRect(0,0,canvas.width, canvas.height);
    return;
}

function strokeQuad(canvas, quad){
    var canvasContext = canvas.getContext("2d",{ willReadFrequently: true });
    var width = canvas.width;
    var height = canvas.height;
    canvasContext.beginPath();
    canvasContext.strokeStyle = 'black';
    canvasContext.lineWidth = 1;
    
    for(var k = 0; k <4; k++){
      if(k==0)canvasContext.moveTo(quad[k].components[0]*width, quad[k].components[1]*height);
      else canvasContext.lineTo(quad[k].components[0]*width, quad[k].components[1]*height);
    }
    canvasContext.lineTo(quad[0].components[0]*width, quad[0].components[1]*height);
    canvasContext.stroke();
}

function getBoundingRect(quad){
    var minX = quad[0].components[0];
    var maxX = quad[0].components[0];
    var minY = quad[0].components[1];
    var maxY = quad[0].components[1];
    for(var k = 1; k <4; k++){
      minX = Math.min(minX,quad[i].components[0]);
      maxX = Math.max(maxX,quad[i].components[0]);
      minY = Math.min(minY,quad[i].components[1]);
      maxY = Math.max(maxY,quad[i].components[1]);
    }
    return {left: minX, top: minY, width: maxX-minX, height: maxY-minY};
}

function strokeRect(canvas, coords){
    var canvasContext = canvas.getContext("2d",{ willReadFrequently: true });
    var width = canvas.width;
    var height = canvas.height;
    canvasContext.beginPath();
    canvasContext.strokeStyle = 'black';
    canvasContext.lineWidth = 1;
    canvasContext.strokeRect(coords.left*width,coords.top*height,coords.width*width,coords.height*height);
}

function drawCross(canvas, coords, color){
    var canvasContext = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    canvasContext.beginPath();
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = 3;
    canvasContext.moveTo(coords.x*width-10, coords.y*height-10);
    canvasContext.lineTo(coords.x*width+10, coords.y*height+10);
    canvasContext.stroke();
    canvasContext.moveTo(coords.x*width-10, coords.y*height+10);
    canvasContext.lineTo(coords.x*width+10, coords.y*height-10);
    canvasContext.stroke();
}

function distBetweenPoints(point1, point2){
    return Math.abs(point1.x-point2.x)+Math.abs(point1.y-point2.y);
}

function findRectByGuideEdges(rect, edgesTempl){
    return {left: (rect.left-edgesTempl[0].x)/(edgesTempl[3].x-edgesTempl[0].x), 
      top:(rect.top-edgesTempl[0].y)/(edgesTempl[3].y-edgesTempl[0].y), 
      width:rect.width/(edgesTempl[3].x-edgesTempl[0].x), 
      height:rect.height/(edgesTempl[3].y-edgesTempl[0].y)};

}