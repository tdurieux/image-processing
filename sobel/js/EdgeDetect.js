function EdgeDetect(){

}

// return image data as 2D array, one 4 element array per pixel
// [[r,g,b,a],...[r,g,b,a]] for easier looping
function getImageData(context){
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    var data = imageData.data;

    var arr = [];
    for(var i = 0; i < data.length; i += 4){
        var pixel = [data[i], data[i+1], data[i+2], data[i+3]];
        arr.push(pixel);
    }
    return arr;
}

// convolutes 3x3 pixel window through Sobel kernel 
// and returns if exceeds threshold
function isEdge(w){
    var threshold = 200;
    var kernelY = [
                [-1, 0, 1], 
                [-2, 0, 2],
                [-1, 0, 1]];
    var kernelX = [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]];

    var sumX = 0, sumY = 0;

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w[i].length; j++){
            sumX += w[i][j][0] * kernelX[i][j];
            sumY += w[i][j][0] * kernelY[i][j];
        }
    }

    var magnitude = Math.sqrt(Math.ceil(Math.pow(sumX, 2) + Math.pow(sumY, 2)));
    
    // mark as 1 if it exceeds threshold
    return magnitude > threshold;
}

function edgeDetectSobel(){
    var edgeColor = [255, 255, 0, 255]
    // for each pixel window, put it through Sobel kernel
    var data = getImageData(context);
    var edges = [];

    var maxPixelOffset = canvas.width*2+2;
    var row2Offset = canvas.width
    var row3Offset =  canvas.width*2
    for(var i = 0; i + maxPixelOffset < data.length; i+=1){
        var r2 = i + row2Offset;
        var r3 = i + row3Offset;
        var pxWindow = [
            [data[i], data[i+1], data[i+2]],
            [data[r2], data[r2+1], data[r2+2]],
            [data[r3], data[r3+1], data[r3+2]],
            ]
        var edge = isEdge(pxWindow);
        if(edge){
            Array.prototype.push.apply(edges, edgeColor);
        }
        else{
            var transparentPix = data[i].slice();
            transparentPix[3] = 200;
            Array.prototype.push.apply(edges, transparentPix);
        }
    }

    // pad missing edges
    var missing = data.length*data[0].length - edges.length
    for(var i = 0; i < missing/4; i++){
        Array.prototype.unshift.apply(edges, edgeColor);
    }

    // overwrite image
    context.putImageData(new ImageData(new Uint8ClampedArray(edges), canvas.width, canvas.height), 0, 0);

}