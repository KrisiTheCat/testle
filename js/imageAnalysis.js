let MIN_WIDTH = 5;
let MIN_HEIGHT = 15;


// first version - looks for ALL rects, accurate, slow
function find4Edges(canvas){
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    console.log(ctx.getContextAttributes());
    var cw,ch;        
    var bkColor={r:255,g:255,b:255};
    var bkFillColor="rgb("+bkColor.r+","+bkColor.g+","+bkColor.b+")";
    
    cw=canvas.width;
    ch=canvas.height;
    console.log(cw+' ' +ch);
    // return;

    function xyIsInImage(data,x,y){
        var start=(y*cw+x)*4;
        var r=data[start+0];
        var g=data[start+1];
        var b=data[start+2];
        return(r<70 && g<70 && b<70);
    }

    function findEdge(data,Y){
        for(var y=Y;y<ch;y++){
        for(var x=0;x<cw;x++){
            if(xyIsInImage(data,x,y)){
                return({x:x,y:y,valid:true});
            }
        }}
        return({x:-100,y:-100,valid:false});
    }

    function findBoundary(pos,data){
        var x0=x1=pos.x;
        var y0=y1=pos.y;
        while(y1<=ch && xyIsInImage(data,x1,y1)){y1++;}
        var x2=x1;
        var y2=y1-1;
        while(x2<=cw && xyIsInImage(data,x2,y2)){x2++;}
        return({x:x0,y:y0,width:x2-x0+1,height:y2-y0+1});
    }

    function findRects(){// TO DO SEARCH ONLY IN 20%
        var data=ctx.getImageData(0,0,cw,ch).data;
        var pos=findEdge(data,0);
        var rects = [];
        while(pos.valid){
            var bb=findBoundary(pos,data);
            //console.log("Found target at "+bb.x+"/"+bb.y+", size: "+bb.width+"/"+bb.height);     
            rects.push(bb);       
            ctx.fillStyle=bkFillColor;
            ctx.fillRect(bb.x-2,bb.y-2,bb.width+4,bb.height+4);
            data=ctx.getImageData(0,0,cw,ch).data;
            pos=findEdge(data,pos.y);
        }
        return rects;
    }

    function dist(a,b,c,d){
        return Math.abs(c-a)+Math.abs(d-b);
    }

    var rects = findRects();
    var tl = 0, tr = 0, bl = 0, br = 0;
    for(i = 0; i < rects.length;i++){
        if(dist(rects[i].x,rects[i].y,0,0) < 
            dist(rects[tl].x,rects[tl].y,0,0)) tl = i;
        if(dist(rects[i].x+rects[i].width,rects[i].y,cw,0) < 
            dist(rects[tr].x+rects[tr].width,rects[tr].y,cw,0)) tr = i;
        if(dist(rects[i].x,rects[i].y+rects[i].height,0,ch) < 
            dist(rects[bl].x,rects[bl].y+rects[bl].height,0,ch)) bl = i;
        if(dist(rects[i].x+rects[i].width,rects[i].y+rects[i].height,cw,ch) < 
            dist(rects[br].x+rects[br].width,rects[br].y+rects[br].height,cw,ch)) br = i;
    }
    console.log(rects[tl]);
    console.log(rects[tr]);
    console.log(rects[bl]);
    console.log(rects[br]);
    var obj =  [convertRectToPercent(rects[tl],cw,ch), 
                convertRectToPercent(rects[tr],cw,ch),
                convertRectToPercent(rects[bl],cw,ch),
                convertRectToPercent(rects[br],cw,ch)];
                console.log(obj);
    return obj;
}

// third version - looks for rects in 20%, accurate 50/50, fast
function find4Edges3(canvas){
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    console.log(ctx.getContextAttributes());
    var cw,ch;        
    var bkColor={r:255,g:255,b:255};
    var bkFillColor="rgb("+bkColor.r+","+bkColor.g+","+bkColor.b+")";
    
    cw=canvas.width;
    ch=canvas.height;
    console.log(cw+' ' +ch);
    // return;

    function xyIsInImage(data,x,y){
        var start=(y*cw+x)*4;
        var r=data[start+0];
        var g=data[start+1];
        var b=data[start+2];
        return(r<70 && g<70 && b<70);
    }

    function findEdge(data,Y, wBeg, wEnd, hEnd, kr){
        for(var y=Y;y<hEnd;y++){
        for(var x=wBeg;x<wEnd;x++){
            if(kr) console.log(x,y);
            if(xyIsInImage(data,x,y)){
                return({x:x,y:y,valid:true});
            }
        }}
        return({x:-100,y:-100,valid:false});
    }

    function findBoundary(pos,data){
        var x0=x1=pos.x;
        var y0=y1=pos.y;
        while(y1<=ch && xyIsInImage(data,x1,y1)){y1++;}
        var x2=x1;
        var y2=y1-1;
        while(x2<=cw && xyIsInImage(data,x2,y2)){x2++;}
        return({x:x0,y:y0,width:x2-x0+1,height:y2-y0+1});
    }

    function findRects(wBeg, wEnd, hBeg, hEnd, rects){
        var data=ctx.getImageData(0,0,cw,ch).data;
        var pos=findEdge(data,hBeg, wBeg, wEnd, hEnd);
       // if(rects.length == 16)pos=findEdge(data,hBeg, wBeg, wEnd, hEnd, true);
        var rC = rects.length;
        while(pos.valid){
            var bb=findBoundary(pos,data);
            // console.log("Found target at "+bb.x+"/"+bb.y+", size: "+bb.width+"/"+bb.height);     
            if(bb.height>=MIN_HEIGHT && bb.width>=MIN_WIDTH) rects.push(bb);       
            ctx.fillStyle=bkFillColor;
            ctx.fillRect(bb.x-2,bb.y-2,bb.width+4,bb.height+4);
            data=ctx.getImageData(0,0,cw,ch).data;
            pos=findEdge(data,pos.y+1, wBeg, wEnd, hEnd);
        }
        if(rects.length == rC) rects.push({x:(wBeg+wEnd)/2,y:(hBeg+hEnd)/2,width:10, height:10});
    }

    function dist(a,b,c,d){
        return Math.abs(c-a)+Math.abs(d-b);
    }

    var rects = [];
    var w5 = Math.round(cw/5);
    var h5 = Math.round(ch/5);
    findRects(0, w5, 0, h5, rects);
    findRects(0, w5, h5*3, ch, rects);//!
    findRects(w5*3, cw, 0, h5, rects);
    findRects(w5*3, cw, h5*3, ch, rects);
    var tl = 0, tr = 0, bl = 0, br = 0;
    for(i = 0; i < rects.length;i++){
        if(dist(rects[i].x,rects[i].y,0,0) < 
            dist(rects[tl].x,rects[tl].y,0,0)) tl = i;
        if(dist(rects[i].x+rects[i].width,rects[i].y,cw,0) < 
            dist(rects[tr].x+rects[tr].width,rects[tr].y,cw,0)) tr = i;
        if(dist(rects[i].x,rects[i].y+rects[i].height,0,ch) < 
            dist(rects[bl].x,rects[bl].y+rects[bl].height,0,ch)) bl = i;
        if(dist(rects[i].x+rects[i].width,rects[i].y+rects[i].height,cw,ch) < 
            dist(rects[br].x+rects[br].width,rects[br].y+rects[br].height,cw,ch)) br = i;
    }
    console.log(rects[tl]);
    console.log(rects[tr]);
    console.log(rects[bl]);
    console.log(rects[br]);
    var obj =  [convertRectToPercent(rects[tl],cw,ch), 
                convertRectToPercent(rects[tr],cw,ch),
                convertRectToPercent(rects[bl],cw,ch),
                convertRectToPercent(rects[br],cw,ch)];
                console.log(obj);
    return obj;
}

// third version - looks for rects on distance, NOT accurate, fast
function find4Edges2(canvas){
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    console.log(ctx.getContextAttributes());
    var cw,ch;        
    
    cw=canvas.width;
    ch=canvas.height;
    console.log(cw+' ' +ch);
    // return;

    function xyIsInImage(data,x,y){
        var start=(y*cw+x)*4;
        var r=data[start+0];
        var g=data[start+1];
        var b=data[start+2];
        return(r<70 && g<70 && b<70);
    }

    function findBoundary(pos,data, dX, dY, wLim, hLim){
        var x0=x1=pos.x;
        var y0=y1=pos.y;
        while(y1<=hLim && y1>=0 && xyIsInImage(data,x1,y1)){y1+=dX;}
        var x2=x1;
        var y2=y1-1;
        while(x2<=wLim && x2>=0 && xyIsInImage(data,x2,y2)){x2+=dY;}
        return({x:x0,y:y0,width:x2-x0+1,height:y2-y0+1});
    }

    function findRectsDirOld(wBeg, wEnd, hBeg, hEnd){
        console.log(wBeg, wEnd, hBeg, hEnd);
        var dX = (wBeg < wEnd) ? 1 : -1;
        var dY = (hBeg < hEnd) ? 1 : -1;
        var data=ctx.getImageData(Math.min(wBeg,wEnd),Math.min(hBeg,hEnd),Math.max(wBeg,wEnd),Math.max(hBeg,hEnd)).data;
        for(var dist = 0; dist < (Math.abs(wBeg-wEnd)+Math.abs(hBeg-hEnd))/2; dist++){
            for(x = 0; x <= dist; x++){
                if(xyIsInImage(data,wBeg+dX*x,hBeg+dY*(dist-x))){
                    console.log(dist, x, wBeg+dX*x,hBeg+dY*(dist-x));
                    return findBoundary({x: wBeg+dX*x, y: hBeg+dY*(dist-x)},data); 
                }
            }
        }
        return {x:wBeg+dX*10,y:wEnd+dY*10,width:10,height:10};
    }

    function findRectsDir(wBeg, wEnd, hBeg, hEnd){
        console.log(wBeg, wEnd, hBeg, hEnd,'---------------------------');
        var dX = (hBeg < hEnd) ? 1 : -1;
        var dY = (wBeg < wEnd) ? 1 : -1;
        var data=ctx.getImageData(Math.min(wBeg,wEnd),Math.min(hBeg,hEnd),Math.max(wBeg,wEnd),Math.max(hBeg,hEnd)).data;
        for(var dist = 0; dist < (Math.abs(wBeg-wEnd)+Math.abs(hBeg-hEnd))/2; dist++){
            for(x = 0; x <= dist; x++){
                if(xyIsInImage(data,hBeg+dX*x,wBeg+dY*(dist-x))){
                    h = findBoundary({x: wBeg+dY*(dist-x), y: hBeg+dX*x},data, dX, dY, Math.max(wBeg,wEnd), Math.max(hBeg,hEnd));
                    if(h.width>=10 && h.height>=10){
                        //ctx.fillRect(h.x-2,h.y-2,h.width+4,h.height+4);
                        console.log(h, dX, dY);
                        return h;
                    }
                }
            }
        }
        return {x:wBeg+dY*10,y:hBeg+dX*10,width:10,height:10};
    }
    function findRectsOld(wBeg, wEnd, hBeg, hEnd){
        console.log(wBeg, wEnd, hBeg, hEnd,'---------------------------');
        var dX = (hBeg < hEnd) ? 1 : -1;
        var dY = (wBeg < wEnd) ? 1 : -1;
        var data=ctx.getImageData(Math.min(wBeg,wEnd),Math.min(hBeg,hEnd),Math.max(wBeg,wEnd),Math.max(hBeg,hEnd)).data;
        var perf,h;
        for(var distSize = 99; distSize < (Math.abs(wBeg-wEnd)+Math.abs(hBeg-hEnd))/2; distSize = Math.min((Math.abs(wBeg-wEnd)+Math.abs(hBeg-hEnd))/2, distSize+100)){
            perf = undefined;
            for(var dist = distSize-99; dist <= distSize; dist++){
                for(x = 0; x <= dist; x++){
                    if(xyIsInImage(data,hBeg+dX*x,wBeg+dY*(dist-x))){
                        h = findBoundary({x: wBeg+dY*(dist-x), y: hBeg+dX*x},data);
                        if(h.width>=10 && h.height>=10){
                            if(perf == undefined) perf = h;
                            else if(perf.height < h.height && perf.width < h.width ) perf = h;
                        }
                    }
                }
            }
            console.log(distSize, perf);
            if(perf != undefined) return perf;
        }
        return {x:wBeg+dY*10,y:hBeg+dX*10,width:10,height:10};
    }
    function findRects(){
        var rects = [];
        rects.push(findRectsDir(10   , cw/2,  10,  ch/2));   // top left
        rects.push(findRectsDir(cw-10, cw/2,  10,  ch/2));  // top right
        rects.push(findRectsDir(10   , cw/2,ch-10, ch/2));  // bottom left
        rects.push(findRectsDir(cw-10, cw/2,ch-10, ch/2));  // bottom left
        return rects;
    }

    function dist(a,b,c,d){
        return Math.abs(c-a)+Math.abs(d-b);
    }

    console.log(ctx.getContextAttributes());
    var rects = findRects();
    console.log(rects);
    var obj =  [convertRectToPercent(rects[0],cw,ch), 
                convertRectToPercent(rects[1],cw,ch),
                convertRectToPercent(rects[2],cw,ch),
                convertRectToPercent(rects[3],cw,ch)];
    console.log(obj);
    return obj;
}


function convertRectToPercent(rect,cw,ch){
    return {x: (rect.x+rect.width/2)/cw,
            y: (rect.y+rect.height/2)/ch};
}

function contrastImage(imageData, contrast) {  // contrast as an integer percent  
    var data = imageData.data;  // original array modified, but canvas not updated
    contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
    var factor = (255 + contrast) / (255.01 - contrast);  //add .1 to avoid /0 error

    for(var i=0;i<data.length;i+=4){  //pixel values in 4-byte blocks (r,g,b,a)
        data[i] = factor * (data[i] - 128) + 128;     //r value
        data[i+1] = factor * (data[i+1] - 128) + 128; //g value
        data[i+2] = factor * (data[i+2] - 128) + 128; //b value
    }
    return imageData;  //optional (e.g. for filter function chaining)
}

function cropImage(canvas, info, ratio){
    var ctx=canvas.getContext("2d",{ willReadFrequently: true });
    cw=canvas.width-1;
    ch=canvas.height-1;
    var imageData = ctx.getImageData(0, 0, cw, ch);

    // ctx.beginPath();
    // ctx.lineWidth = "1";
    // ctx.strokeStyle = "blue";
    // ctx.rect(info.colsRange.start, info.rowsRange.start, info.colsRange.end-info.colsRange.start, info.rowsRange.end -info.rowsRange.start);
    // ctx.stroke();

    var change = Math.floor((ratio.h - (info.rowsRange.end-info.rowsRange.start))/2);
    info.rowsRange.start -= change;
    if(info.rowsRange.start < 0) info.rowsRange.start = 0;
    change = Math.floor((ratio.w - (info.colsRange.end-info.colsRange.start))/2);
    info.colsRange.start -= change;
    if(info.colsRange.start < 0) info.colsRange.start = 0;

    // ctx.beginPath();
    // ctx.strokeStyle = "red";
    // ctx.rect(info.colsRange.start, info.rowsRange.start, ratio.h, ratio.w);
    // ctx.stroke();

	canvas.width = ratio.w;
	canvas.height = ratio.h;
    ctx.putImageData(imageData, -info.colsRange.start, -info.rowsRange.start);
    
    var imageData = ctx.getImageData(0, 0, ratio.w, ratio.h);
	data = imageData.data;
	ctx.putImageData(imageData,0,0);
}

function croppedImageWhitespaceRect(canvas){
    var ctx=canvas.getContext("2d",{ willReadFrequently: true });
    cw=canvas.width-1;
    ch=canvas.height-1;
    var imageData = ctx.getImageData(0, 0, cw, ch);
	data = imageData.data;

    var colorRange = getColorRange(data);

    var rows = Array(ch).fill(true);
    var cols = Array(cw).fill(true);

    for (var i = 0; i < cw; i++) {
        for (var j = 0; j < ch; j++) {
            if (!isWhite(getRGBsum(i, j,data,cw),colorRange)) {
                setColorInData(data, i,j,0,cw);
                rows[j] = false;
                cols[i] = false;
            } else {
                setColorInData(data, i,j,255,cw);
            }
        }
    }
    ctx.putImageData(imageData, 0,0);
    var rowsRange = largestFalseSection(rows);
    var colsRange = largestFalseSection(cols);
    return {'rowsRange': rowsRange, 'colsRange': colsRange};

    function largestFalseSection(arr){
        var start = 0 , end = -1, currStart = 0;
        for (var i = 0; i < arr.length; i++) {
            if(!arr[i] || (arr[i]==true && arr[i+1]==false)){
                if(end-start<i-currStart){
                    start = currStart; end = i;
                }
            } else {
                currStart = i+1;
            }
        }
        end++;
        return {start: start, end: end};
    }
    
    function getColorRange(){
        var min= 255*3, max = 0;
        for (var i = 0; i < cw; i++) {
            for (var j = 0; j < ch; j++) {
                min = Math.min(min,getRGBsum(i,j,data,cw));
                max = Math.max(max,getRGBsum(i,j,data,cw));
            }
        }
        return {min:min, max:max};
    }

}

function setColorInData(data, i,j,color,cw){
    data[((cw * j) + i) * 4] = color;
    data[((cw * j) + i) * 4+1] = color;
    data[((cw * j) + i) * 4+2] = color;
}

function drawSeparetingLines(canvas){
    var ctx=canvas.getContext("2d",{ willReadFrequently: true });
    cw=canvas.width;
    ch=canvas.height;
    var imageData = ctx.getImageData(0, 0, cw, ch);
    var data = imageData.data;
    var color = 0;
    for(var x = 0,i,j; x < 5; x++){
        i = cw/2; j = x;
        data[((cw * j) + i) * 4] = color;
        data[((cw * j) + i) * 4+1] = color;
        data[((cw * j) + i) * 4+2] = color;
        i = cw/2; j = ch-x;
        data[((cw * j) + i) * 4] = color;
        data[((cw * j) + i) * 4+1] = color;
        data[((cw * j) + i) * 4+2] = color;
        i = x; j = ch/2;
        data[((cw * j) + i) * 4] = color;
        data[((cw * j) + i) * 4+1] = color;
        data[((cw * j) + i) * 4+2] = color;
        i = cw-x; j = ch/2;
        data[((cw * j) + i) * 4] = color;
        data[((cw * j) + i) * 4+1] = color;
        data[((cw * j) + i) * 4+2] = color;
    }
    ctx.putImageData(imageData, 0,0);
}
    
function getRGBsum(x, y, data, cw) {
    return data[((cw * y) + x) * 4] + data[((cw * y) + x) * 4 + 1] + data[((cw * y) + x) * 4 + 2];
}

function isWhite(rgb, colorRange) {
    return rgb-colorRange.min > colorRange.max-rgb+(colorRange.max-colorRange.min)/5;
}

function countWhitePixels(ctx){
    var imageData = ctx.getImageData(0, 0, 40, 40);
    cw=imageData.width;
    ch=imageData.height;
	data = imageData.data;
    var checked = Array(cw).fill().map(() => Array(ch));
    var ans = 0, curr;
    for (var i = 2*cw/5; i < cw/5*3; i++) {
        for (var j = 2*ch/5; j < ch/5*3; j++) {
            curr = countWhite(data, checked, i, j, cw, ch);
            if(ans < curr){
                ans = curr;
            }
        }
    }
    return ans;
}
  
function countWhite(data, checked, x, y, cw, ch){
    if(x < 0 || y < 0 || x >= cw || y >= ch ) return 0;
    if(checked[x][y] == true) return 0;
    if(getRGBsum(x, y, data,cw) < 600) return 0;
    checked[x][y] = true;
    return countWhite(data, checked, x+1, y, cw, ch) +
            countWhite(data, checked, x-1, y, cw, ch) +
            countWhite(data, checked, x, y+1, cw, ch) +
            countWhite(data, checked, x, y-1, cw, ch) + 1 +
            countWhite(data, checked, x-1, y-1, cw, ch) +
            countWhite(data, checked, x+1, y-1, cw, ch) +
            countWhite(data, checked, x-1, y+1, cw, ch) +
            countWhite(data, checked, x+1, y+1, cw, ch);
}

function countBlackPixels(ctx){
    var imageData = ctx.getImageData(0, 0, 40, 40);
    cw=imageData.width;
    ch=imageData.height;
	data = imageData.data;
    var checked = Array(cw).fill().map(() => Array(ch));
    var ans = 0, curr;
    //console.log('----------------------------------------------------------------');
    var w5 = Math.round(cw/5);
    var h5 = Math.round(ch/5);
    var xMin = w5, xMax = 4*w5, yMin = h5, yMax = 4*h5;
    for (var i = 2*w5; i <= 3*w5; i++) {
        for (var j = 2*h5; j <= 3*h5; j++) {
            if(i == 16 && j == 16) curr = countBlack(data, checked, i, j, xMin, xMax, yMin, yMax,cw,true);
            else curr = countBlack(data, checked, i, j, xMin, xMax, yMin, yMax,cw,false);
            if(ans < curr){
                ans = curr;
            }
        }
    }
    ctx.putImageData(imageData, 0,0);
    return ans;
}
function getArrData(ctx){
    var arr = [];
    var imageData = ctx.getImageData(0, 0, 28, 28);
    cw=imageData.width;
    ch=imageData.height;
	data = imageData.data;
    for (var i = 0; i < cw; i++) {
        for (var j = 0; j < ch; j++) {
            if(getRGBsum(i, j, data,cw) < 600) arr.push(1);
            else arr.push(0);
        }
    }
    return arr;
}
  
function countBlack(data, checked, x, y, xMin, xMax, yMin, yMax,cw,fl){
    // console.log(data, checked, x, y, xMin, xMax, yMin, yMax);
    if(x < xMin || y < yMin || x > xMax || y > yMax ) return 0;
    if(checked[x][y] == true) return 0;
    if(getRGBsum(x, y, data,cw) > 600) return 0;
    checked[x][y] = true;
    if(fl) setColorInData(data, x,y,180,cw);
    return countBlack(data, checked, x+1, y, xMin, xMax, yMin, yMax,cw,fl) + 
            countBlack(data, checked, x-1, y, xMin, xMax, yMin, yMax,cw,fl) +
            countBlack(data, checked, x, y+1, xMin, xMax, yMin, yMax,cw,fl) +
            countBlack(data, checked, x, y-1, xMin, xMax, yMin, yMax,cw,fl) +
            countBlack(data, checked, x-1, y-1, xMin, xMax, yMin, yMax,cw,fl) +
            countBlack(data, checked, x-1, y+1, xMin, xMax, yMin, yMax,cw,fl) +
            countBlack(data, checked, x+1, y-1, xMin, xMax, yMin, yMax,cw,fl) +
            countBlack(data, checked, x+1, y+1, xMin, xMax, yMin, yMax,cw,fl) + 1;
}

function drawBlackRect(data, xMin, xMax, yMin, yMax, cw, ch){
    var checked = Array(cw).fill().map(() => Array(ch));
    var xW = (xMax - xMin + 1) /2;
    var yW = (yMax - yMin + 1) /2;
    for (var i = Math.floor(xMin + xW/2); i <= xMax - xW/2; i++) {
        for (var j = Math.floor(yMin + yW/2); j <= yMax - yW/2; j++) {
            countBlack(data, checked, i, j, xMin, xMax, yMin, yMax,cw);
        }
    }
    for (var i = xMin; i <= xMax; i++) {
        for (var j = yMin; j <= yMax; j++) {
            if(!checked[i][j] &&
                (getRGBsum(i+1, j, data, cw) >400 || (getRGBsum(i+1, j, data, cw) < 400 && checked[i+1][j])) &&
                (getRGBsum(i-1, j, data, cw) >400 || (getRGBsum(i-1, j, data, cw) < 400 && checked[i-1][j])) &&
                (getRGBsum(i, j+1, data, cw) >400 || (getRGBsum(i, j+1, data, cw) < 400 && checked[i][j+1])) &&
                (getRGBsum(i, j-1, data, cw) >400 || (getRGBsum(i, j-1, data, cw) < 400 && checked[i][j-1]))){
                setColorInData(data, i,j,180,cw);
            }
        }
    }
    for (var i = xMin; i <= xMax; i++) {
        for (var j = yMin; j <= yMax; j++) {
            // console.log(getRGBsum(i+1, j, data, cw));
            if(getRGBsum(i,j,data,cw) == 180*3){
                setColorInData(data, i,j,0,cw);
            }
        }
    }
}
