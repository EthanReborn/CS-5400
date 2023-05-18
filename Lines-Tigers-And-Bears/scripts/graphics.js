// ------------------------------------------------------------------
// 
// This is the graphics object.  It provides a pseudo pixel rendering
// space for use in demonstrating some basic rendering techniques.
//
// ------------------------------------------------------------------
MySample.graphics = (function(pixelsX, pixelsY, showPixels) {
    'use strict';

    showPixels = false;

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d', { alpha: false });

    let deltaX = canvas.width / pixelsX;
    let deltaY = canvas.height / pixelsY;

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();

        //
        // Draw a very light background to show the "pixels" for the framebuffer.
        if (showPixels) {
            context.save();
            context.lineWidth = .1;
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.beginPath();
            for (let y = 0; y <= pixelsY; y++) {
                context.moveTo(1, y * deltaY);
                context.lineTo(canvas.width, y * deltaY);
            }
            for (let x = 0; x <= pixelsX; x++) {
                context.moveTo(x * deltaX, 1);
                context.lineTo(x * deltaX, canvas.width);
            }
            context.stroke();
            context.restore();
        }
    }

    //------------------------------------------------------------------
    //
    // Public function that renders a "pixel" on the framebuffer.
    //
    //------------------------------------------------------------------
    function drawPixel(x, y, color) {
        context.fillStyle = color;
        context.fillRect(Math.floor(x * deltaX), Math.floor(y * deltaY), Math.ceil(deltaX), Math.ceil(deltaY));
    }

    //------------------------------------------------------------------
    //
    // Bresenham line drawing algorithm.
    //
    //------------------------------------------------------------------
    function drawLine(x1, y1, x2, y2, color){
        const deltaY = Math.abs(y2 - y1);
        const deltaX = Math.abs(x2 - x1);
        var m = deltaY / deltaX;

        //q0
        if(m > 1 && x2 > x1 && y1 > y2){
            //drawLineQ0(x1, y1, x2, y2, color);
            //swappoints false, swap delta true, inc x = -1, inc y = 1
            drawBresenHam(x1, y1, x2, y2, -1, 1, deltaX, deltaY, true, false, color);
        }
        //q1
        else if(m >= 0 && m <= 1 && x2 > x1 && y2 < y1){
            //drawLineQ1(x1, y1, x2, y2, color);
            //inc x = 1, inc y = -1, swap delta false, swap points false
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, false, false, color);
        }
        //q2
        else if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
            //drawLineQ2(x1, y1, x2, y2, color);
            //xinc = -1, yinc = -1 swap delta false, swap points true
            drawBresenHam(x1, y1, x2, y2, -1 , -1, deltaX, deltaY, false, true, color);
        }
        //q3
        else if(m > 1 && x2 >= x1 && y1 < y2){
            //drawLineQ3(x1, y1, x2, y2, color);
            //xinc = 1 yinc = 1, swap delta true, swap points false
            
        }
        //q4
        else if(m > 1 && x2 < x1 && y2 > y1){
            drawLineQ4(x1, y1, x2, y2, color);
        }
        //q5
        else if(m >= 0 && m <= 1 && x2 < x1 && y2 > y1){
            drawLineQ5(x1, y1, x2, y2, color);
        }
        //q6
        else if (m >= 0 && m <= 1 && x2 < x1){
            drawLineQ6(x1, y1, x2, y2, color);
        }
        //q7
        else if (m > 1 && x2 <= x1 && y2 < y1){
            drawLineQ7(x1, y1, x2, y2, color);
        }
    }

    function drawBresenHam(x1, y1, x2, y2, incX, incY, deltaX, deltaY, swapDelta, swapPoints, color){
        var limit = 0;
        var pkinc0;
        var pkinc1;

        if(swapPoints){
            var curY = y2;
            var curX = x2;
        }else{
            var curY = y1;
            var curX = x1;
        }

        if(swapDelta){
            limit = deltaY;
            var pk = (2 * deltaX) - deltaY;
            pkinc1 = 2 * deltaX - 2 * deltaY;
            pkinc0 = 2 * deltaX;
        }else{
            limit = deltaX;
            var pk = (2 * deltaY) - deltaX;
            pkinc1 = 2 * deltaY - 2 * deltaX;
            pkinc0 = 2 * deltaY;
        }

        for(let i = 0; i < limit; i++){
            //d1 - d2 = positive go up, else go down
            if(swapDelta){
                api.drawPixel(curY, curX, color);
            }else{
                api.drawPixel(curX, curY, color);
            }
            if(pk >= 0){
                curX += incX;
                curY += incY;
                //pk+1
                //pk = pk + 2 * deltaY - 2 * deltaX;
                pk += pkinc1;
            }else{
                curX += incX;
                //pk+1
                pk += pkinc0;
            }
        }
    }

    function  drawBresenHam2(x1, y1, x2, y2, incX, incY, swapDelta, swapPoints, color) {  //swappoints false, swap delta true, inc x = -1, inc y = 1

        var limit = 0;
        var pkinc0;
        var pkinc1;

        if(swapDelta){
            limit = deltaY;
            var pk = (2 * deltaX) - deltaY;
            pkinc1 = 2 * deltaX - 2 * deltaY;
            pkinc0 = 2 * deltaX;
        }else{
            limit = deltaX;
            var pk = (2 * deltaY) - deltaX;
            pkinc1 = 2 * deltaY - 2 * deltaX;
            pkinc0 = 2 * deltaY;
        }

        console.log(limit);

        if(swapPoints){
            var curY = y2;
            var curX = x2;
        }else{
            var curY = y1;
            var curX = x1;
        }

        // var deltaY = Math.abs(y2 - y1);
        // var deltaX = Math.abs(x2 - x1);
        // var pk = (2 * deltaY) - deltaX;
        // var curX = x1;
        // var curY = y1;
    
        
        // for(let i = 0; i < limit; i++){
        //     //d1 - d2 = positive go up, else go down
        //     api.drawPixel(curX, curY, color);
        //     if(pk >= 0){
        //         curX += incX;
        //         curY += incY;
        //         //pk+1
        //         //pk = pk + 2 * deltaY - 2 * deltaX;
        //         pk += pkinc1;
        //     }else{
        //         curX += incX;
        //         //pk+1
        //         pk += pkinc0;
        //     }
        // }

        // var curY = y1;
        // var curX = x1;

        if(color === 'red'){
            api.octant1 = 0;
        }else{
            api.octant2 = 0;
        }
        
        for(let i =0; i<limit; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curY, curX, color);
            if(pk >= 0){
                curX--;
                curY++;
                //pk+1
                pk = pk + 2 * deltaX - 2 * deltaY;
            }else{
                curX--;
                //pk+1
                pk = pk + 2 * deltaX;
            }
        }
    }
    
    function drawLineQ1(x1, y1, x2, y2, color) { //inc x = 1, inc y = -1, swap delta false, swap points false
        var deltaY = Math.abs(y2 - y1);
        var deltaX = Math.abs(x2 - x1);
        var pk = (2 * deltaY) - deltaX;
        var curX = x1;
        var curY = y1;
        
        if(color === 'red'){
            api.octant1 = 1;
        }else{
            api.octant2 = 1;
        }
        
        for(let i = 0; i < deltaX; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curX, curY, color);
            if(pk >= 0){
                curX++;
                curY--;
                //pk+1
                pk = pk + 2 * deltaY - 2 * deltaX;
            }else{
                curX++;
                //pk+1
                pk = pk + 2 * deltaY;
            }
        }
    }

    function drawLineQ2(x1, y1, x2, y2, color) { //xinc = -1, yinc = -1 swap delta false, swap points true
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var pk = (2 * deltaY) - deltaX;
        var curX = x2;
        var curY = y2;

        if(color === 'red'){
            api.octant1 = 2;
        }else{
            api.octant2 = 2;
        }
        
        for(let i =0; i<deltaX + 1; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curX, curY, color);
            if(pk >= 0){
                curX--;
                curY--;
                //pk+1
                pk = pk + 2 * deltaY - 2 * deltaX;
            }else{
                curX--;
                //pk+1
                pk = pk + 2 * deltaY;
            }
        }
    }

    function drawLineQ3(x1, y1, x2, y2, color) { //xinc = 1 yinc = 1, swap delta true, swap points false
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var pk = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 3
        }else{
            api.octant2 = 3;
        }
        
        for(let i =0; i<deltaY; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curY, curX, color);
            if(pk >= 0){
                curX++;
                curY++;
                //pk+1
                pk = pk + 2 * deltaX - 2 * deltaY;
            }else{
                curX++;
                //pk+1
                pk = pk + 2 * deltaX;
            }
        }
    }

    function drawLineQ4(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var pk = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 4
        }else{
            api.octant2 = 4;
        }
        
        for(let i =0; i<deltaY; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curY, curX, color);
            if(pk >= 0){
                curX++;
                curY--;
                //pk+1
                pk = pk + 2 * deltaX - 2 * deltaY;
            }else{
                curX++;
                //pk+1
                pk = pk + 2 * deltaX;
            }
        }
    }

    function drawLineQ5(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var pk = (2 * deltaY) - deltaX;

        var curX = x2;
        var curY = y2;

        if(color === 'red'){
            api.octant1 = 5;
        }else{
            api.octant2 = 5;
        }
        
        for(let i =0; i<deltaX + 1; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curX, curY, color);
            if(pk >= 0){
                curX++;
                curY--;
                //pk+1
                pk = pk + 2 * deltaY - 2 * deltaX;
            }else{
                curX++;
                //pk+1
                pk = pk + 2 * deltaY;
            }
        }
    }

    function drawLineQ6(x1, y1, x2, y2, color) {

        console.log(y2);
        var deltaY = Math.abs(y2 - y1);
        var deltaX = Math.abs(x2 - x1);
        var pk = (2 * deltaY) - deltaX;
        var m = deltaY / deltaX;
    
        var curX = x1;
        var curY = y1;

        if(color === 'red'){
            api.octant1 = 6;
        }else{
            api.octant2 = 6;
        }
        
        for(let i =0; i<deltaX; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curX, curY, color);
            if(pk >= 0){
                curX--;
                curY--;
                //pk+1
                pk = pk + 2 * deltaY - 2 * deltaX;
            }else{
                curX--;
                //pk+1
                pk = pk + 2 * deltaY;
            }
        }
    }

    function drawLineQ7(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var pk = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 7;
        }else{
            api.octant2 = 7;
        }

        console.log(y2);
        
        for(let i =0; i<deltaY; i++){
            //d1 - d2 = positive go up, else go down
            api.drawPixel(curY, curX, color);
            if(pk >= 0){
                curX--;
                curY--;
                //pk+1
                pk = pk + 2 * deltaX - 2 * deltaY;
            }else{
                curX--;
                //pk+1
                pk = pk + 2 * deltaX;
            }
        }
    }

    let api = {
        clear: clear,
        drawPixel: drawPixel,
        drawLine: drawLine,
        get sizeX() { return pixelsX; },
        get sizeY() { return pixelsY; }
    };

    return api;
}(200, 200, true));
