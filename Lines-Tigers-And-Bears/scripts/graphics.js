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
        var deltaY = Math.abs(y2 - y1);
        var deltaX = Math.abs(x2 - x1);
        var m = deltaY / deltaX;

        //q0
        if(m > 1 && x2 > x1 && y1 > y2){
            drawLineQ0(x1, y1, x2, y2, color);
        }
        //q1
        else if(m >= 0 && m <= 1 && x2 > x1 && y2 < y1){
            drawLineQ1(x1, y1, x2, y2, color);
        }
        //q2
        else if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
            drawLineQ2(x1, y1, x2, y2, color);
        }
        //q3
        else if(m > 1 && x2 >= x1 && y1 < y2){
            drawLineQ3(x1, y1, x2, y2, color);
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

    function drawLineQ0(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var p0 = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 0;
        }else{
            api.octant2 = 0;
        }

        //initial
        api.drawPixel(x1, y1, color);

        //draw p0
        if(p0 >= 0){
            curX--;
            curY++;
            api.drawPixel(curY, curX, color);
        }else{
            curX--;
            api.drawPixel(curY, curX, color);
        }

        //first pk
        var pk = p0;
        
        for(let i =0; i<deltaY; i++){
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
    
    function drawLineQ1(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y2 - y1);
        var deltaX = Math.abs(x2 - x1);
        var p0 = (2 * deltaY) - deltaX;
        
        if(color === 'red'){
            api.octant1 = 1;
        }else{
            api.octant2 = 1;
        }

        var curX = x1;
        var curY = y1;

        //initial
        api.drawPixel(x1, y1, color); 

        //draw p0
        if(p0 >= 0){
            curX++;
            curY--;
            api.drawPixel(curX, curY, color);
        }else{
            curX++;
            api.drawPixel(curX, curY, color);
        }

        //first pk
        var pk = p0;
        
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

    function drawLineQ2(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var p0 = (2 * deltaY) - deltaX;

        var curX = x2;
        var curY = y2;

        if(color === 'red'){
            api.octant1 = 2;
        }else{
            api.octant2 = 2;
        }

        //initial
        api.drawPixel(x2, y2, color); 

        //draw p0
        if(p0 >= 0){
            curX--;
            curY--;
            api.drawPixel(curX, curY, color);
        }else{
            curX--;
            api.drawPixel(curX, curY, color);
        }

        //first pk
        var pk = p0;
        
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

    function drawLineQ3(x1, y1, x2, y2, color) {
        var deltaY = Math.abs(y1 - y2);
        var deltaX = Math.abs(x1 - x2);
        var p0 = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 3
        }else{
            api.octant2 = 3;
        }

        //initial
        api.drawPixel(x1, y1, color);

        //draw p0
        if(p0 >= 0){
            curX++;
            curY++;
            api.drawPixel(curY, curX, color);
        }else{
            curX++;
            api.drawPixel(curY, curX, color);
        }

        //first pk
        var pk = p0;
        
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
        var p0 = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 4
        }else{
            api.octant2 = 4;
        }

        //initial
        api.drawPixel(x1, y1, color);

        //draw p0
        if(p0 >= 0){
            curX++;
            curY--;
            api.drawPixel(curY, curX, color);
        }else{
            curX++;
            api.drawPixel(curY, curX, color);
        }

        //first pk
        var pk = p0;
        
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
        var p0 = (2 * deltaY) - deltaX;

        var curX = x2;
        var curY = y2;

        if(color === 'red'){
            api.octant1 = 5;
        }else{
            api.octant2 = 5;
        }

        //initial
        api.drawPixel(x2, y2, color); 

        //draw p0
        if(p0 >= 0){
            curX++;
            curY--;
            api.drawPixel(curX, curY, color);
        }else{
            curX++;
            api.drawPixel(curX, curY, color);
        }

        //first pk
        var pk = p0;
        
        for(let i =0; i<deltaX; i++){
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
        var deltaY = Math.abs(y2 - y1);
        var deltaX = Math.abs(x2 - x1);
        var p0 = (2 * deltaY) - deltaX;
        var m = deltaY / deltaX;
    
        var curX = x1;
        var curY = y1;

        if(color === 'red'){
            api.octant1 = 6;
        }else{
            api.octant2 = 6;
        }

        //initial
        api.drawPixel(x1, y1, color); 

        //draw p0
        if(p0 >= 0){
            curX--;
            curY--;
            api.drawPixel(curX, curY, color);
        }else{
            curX++;
            api.drawPixel(curX, curY, color);
        }

        //first pk
        var pk = p0;
        
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
        var p0 = (2 * deltaX) - deltaY;
        var curY = y1;
        var curX = x1;

        if(color === 'red'){
            api.octant1 = 7;
        }else{
            api.octant2 = 7;
        }

        //initial
        api.drawPixel(x1, y1, "red");

        //draw p0
        if(p0 >= 0){
            curX--;
            curY--;
            api.drawPixel(curY, curX, color);
        }else{
            curX--;
            api.drawPixel(curY, curX, color);
        }

        //first pk
        var pk = p0;
        
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
        octant1: 10,
        octant2: -1,
        get sizeX() { return pixelsX; },
        get sizeY() { return pixelsY; }
    };

    return api;
}(200, 200, true));
