// ------------------------------------------------------------------
// 
// This is the graphics object.  It provides a pseudo pixel rendering
// space for use in demonstrating some basic rendering techniques.
//
// ------------------------------------------------------------------
MySample.graphics = (function(pixelsX, pixelsY, showPixels) {
    'use strict';

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
        x = Math.trunc(x);
        y = Math.trunc(y);

        context.fillStyle = color;
        context.fillRect(x * deltaX, y * deltaY, deltaX, deltaY);
    }

    //------------------------------------------------------------------
    //
    // Helper function used to draw an X centered at a point.
    //
    //------------------------------------------------------------------
    function drawPoint(x, y, ptColor) {
        drawPixel(x - 1, y - 1, ptColor);
        drawPixel(x + 1, y - 1, ptColor);
        drawPixel(x, y, ptColor);
        drawPixel(x + 1, y + 1, ptColor);
        drawPixel(x - 1, y + 1, ptColor);
    }

    //------------------------------------------------------------------
    //
    // line drawing algorithm.
    //
    //------------------------------------------------------------------
    function drawLine(x1, y1, x2, y2, color){
        const deltaY = Math.abs(y2 - y1);
        const deltaX = Math.abs(x2 - x1);
        var m = deltaY / deltaX;

        //q0
        if(m > 1 && x2 > x1 && y1 > y2){
            drawBresenHam(x1, y1, x2, y2, -1, 1, deltaX, deltaY, true, false, true, color);
        }
        //q1
        else if(m >= 0 && m <= 1 && x2 > x1 && y2 < y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, false, false, false, color);
        }
        //q2
        else if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
            drawBresenHam(x1, y1, x2, y2, -1 , -1, deltaX, deltaY, false, true, false, color);
        }
        //q3
        else if(m > 1 && x2 >= x1 && y1 < y2){
            drawBresenHam(x1, y1, x2, y2, 1, 1, deltaX, deltaY, true, false, true, color); //originally true false
            //drawLineQ3(x1, y1, x2, y2, color);
        }
        //q4
        else if(m > 1 && x2 < x1 && y2 > y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, true, false, false, color);
        }
        //q5
        else if(m >= 0 && m <= 1 && x2 < x1 && y2 > y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, false, true, false, color);
        }
        //q6
        else if (m >= 0 && m <= 1 && x2 < x1 && y2 <= y1){
            drawBresenHam(x1, y1, x2, y2, -1, -1, deltaX, deltaY, false, false, false, color);
        }
        //q7
        else if (m > 1 && x2 <= x1 && y2 < y1){
            drawBresenHam(x1, y1, x2, y2, -1, -1, deltaX, deltaY, true, false, true, color);
        }
    }

    //------------------------------------------------------------------
    //
    // Bresenham line drawing algorithm.
    //
    //------------------------------------------------------------------

    function drawBresenHam(x1, y1, x2, y2, incX, incY, deltaX, deltaY, swapDelta, swapEnd, swapXY, color){
        var limit = 0;
        var pkinc0;
        var pkinc1;

        if(swapEnd){
            var curY = y2;
            var curX = x2;
        }else{
            var curY = y1;
            var curX = x1;
        }

        if(swapXY){
            var curY = x1;
            var curX = y1;
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

    //------------------------------------------------------------------
    //
    // Renders an Hermite curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveHermite(controls, segments, showPoints, showLine, showControl, lineColor) {
        //(s1, t1) = P'(x, y)
        var x1 = controls[0];
        var y1 = controls[1];
        var s1 = controls[2];
        var t1 = controls[3];
        var x2 = controls[4];
        var y2 = controls[5];
        var s2 = controls[6];
        var t2 = controls[7];

        if(showControl){
            drawPoint(x1, y1, 'green');
            drawPoint(x2, y2, 'green');
            drawLine(x1, y1, x1 + s1, y1 + t1, 'red'); // Draw first tangent vector
            drawLine(x2, y2, x2 + s2, y2 + t2, 'red'); // Draw second tangent vector
        }

        var startX = x1;
        var startY = y1;
        var endX = 0;
        var endY = 0;

        //drawLine(100, 100, 50, 90, 'red');
        //with parentheses 
        //endY = (y1 * ((2 * u**3) - (3 * u**2) + 1)) + (y2 * ((-2 * u**3) + (3 * u**2))) + (t1 * ((u**3) - (2 * u**2) + u)) + (t2 * ((u**3) - (u**2)));

        var inc = 1 / segments;
        var u = 0;

        while(u <= 1){
            endX = (x1 * ((2 * u**3) - (3 * u**2) + 1)) + (x2 * ((-2 * u**3) + (3 * u**2))) + (s1 * ((u**3) - (2 * u**2) + u)) + (s2 * ((u**3) - (u**2)));
            endY = (y1 * ((2 * u**3) - (3 * u**2) + 1)) + (y2 * ((-2 * u**3) + (3 * u**2))) + (t1 * ((u**3) - (2 * u**2) + u)) + (t2 * ((u**3) - (u**2)));
            
            if(showLine){
                drawLine(startX, startY, endX, endY, lineColor);
            }
          
            if(showPoints){
                drawPoint(endX, endY, 'red');
            }
            
            startX = endX;
            startY = endY;
            u += inc;
        }
    }

    //------------------------------------------------------------------
    //
    // Renders a Cardinal curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor) {
        var pkmx = controls[0]; //pk-1x
        var pkmy = controls[1];
        var pkx = controls[2];
        var pky = controls[3];
        var pk1x = controls[4];
        var pk1y = controls[5];
        var pk2x = controls[6];
        var pk2y = controls[7];

        var t = controls[8]; //tension
        var s = (1 - t) / 2;

        var startX = pkx;
        var startY = pky;
        var endX = pk1x;
        var endY = pk1y;

        if(showControl){
            drawPoint(pkmx, pkmy, 'red');
            drawLine(pkmx, pkmy, pkx, pky, 'red');
            drawPoint(pkx, pky, 'yellow');
            drawPoint(pk1x, pk1y, 'green');
            drawLine(pk1x, pk1y, pk2x, pk2y, 'red');
            drawPoint(pk2x, pk2y, 'red');
        }

        var u = 0; 
        var inc = 1 / segments;
        console.log('inc: ' + inc);

        while(u <= 1){
            //endX = (pkmx * ((-1 * s * u**3) + (2 * s * u**2) - (s * u))) + (pkx * (((2 - s) * u**3) + ((s - 3) * u**2) + 1)) + (pk1x * ((s - 2) * u**3) + ((3 - 2*s) * u**2) + (s * u)) + (pk2x * ((s * u**3) - (s * u**2)));
            //endY = (pkmy * ((-1 * s * u**3) + (2 * s * u**2) - (s * u))) + (pky * (((2 - s) * u**3) + ((s - 3) * u**2) + 1)) + (pk1y * ((s - 2) * u**3) + ((3 - 2*s) * u**2) + (s * u)) + (pk2y * ((s * u**3) - (s * u**2)));
            
            endX =
                pkmx * ((-1 * s * u ** 3) + (2 * s * u ** 2) - (s * u)) +
                pkx * (((2 - s) * u ** 3) + ((s - 3) * u ** 2) + 1) +
                pk1x * ((s - 2) * u ** 3 + (3 - 2 * s) * u ** 2 + s * u) +
                pk2x * (s * u ** 3 - s * u ** 2);
            endY =
                pkmy * ((-1 * s * u ** 3) + (2 * s * u ** 2) - (s * u)) +
                pky * (((2 - s) * u ** 3) + ((s - 3) * u ** 2) + 1) +
                pk1y * ((s - 2) * u ** 3 + (3 - 2 * s) * u ** 2 + s * u) +
                pk2y * (s * u ** 3 - s * u ** 2);

            if(u == 2 * inc){
                console.log(startX);
                console.log(startY);
                console.log(endX);
                console.log(endY);
            }

            if(showLine){
                drawLine(startX, startY, endX, endY, lineColor);
            }
          
            if(showPoints){
                drawPoint(endX, endY, 'red');
            }
            
            startX = endX;
            startY = endY;
            u += inc;
        }
    }

    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveBezier(controls, segments, showPoints, showLine, showControl, lineColor) {
        //C ( n ,k ) = n ! / k ! ( n − k ) !
        //c(n, k) = binomial coefficients 
        // n = 3

        //[p0x, poy, p1x, p1y, p2x, p2y, p3x, p3y]
        var P0x = controls[0];
        var P0y = controls[1];
        var P1x = controls[2];
        var P1y = controls[3];
        var P2x = controls[4];
        var P2y = controls[5];
        var P3x = controls[6];
        var P3y = controls[7];

        var xList = [controls[0], controls[2], controls[4], controls[6]];
        var yList = [controls[1], controls[3], controls[5], controls[7]];

        if(showPoints){
            drawPoint(P0x, P0y, 'green');
            drawPoint(P1x, P1y, 'red');
            drawPoint(P2x, P2y, 'red');
            drawPoint(P3x, P3y, 'green');
        }

        var n = 3;
        var inc = 1 / segments;
        var u = 0;

        var startX = P0x;
        var startY = P0y;
        var endX;
        var endY;

        cnkList = [];

        for(let k = 0; k <= n; k++){
            var cnk = factorial(n) / factorial(k) * factorial(n - k);
            var bez = cnk * (u**k) * (1 - u)**(n-k);
            console.log(cnk);
            console.log(bez);
        }   

        while(u <= 1){

            for(let k = 0; k <= n; k++){
                var cnk = factorial(n) / factorial(k) * factorial(n - k);
                var bez = cnk * (u**k) * (1 - u)**(n-k);
                endX = xList[k] * bez;
                endY = yList[k] * bez;
            }          

            drawLine(startX, startY, endX, endY, lineColor);

            u += inc;
        }


    }

    function factorial (num) { 
        if(num == 1 || num == 0){
            return 1;
        }else{
            return num * factorial(num -1);
        }
    }

    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters; using the matrix form.
    // This follows the Mathematics for Game Programmers form.
    //
    //------------------------------------------------------------------
    function drawCurveBezierMatrix(controls, segments, showPoints, showLine, showControl, lineColor) {

    }

    //------------------------------------------------------------------
    //
    // Entry point for rendering the different types of curves.
    // I know a different (functional) JavaScript pattern could be used
    // here.  My goal was to keep it looking C++'ish to keep it familiar
    // to those not expert in JavaScript.
    //
    //------------------------------------------------------------------
    function drawCurve(type, controls, segments, showPoints, showLine, showControl, lineColor) {
        switch (type) {
            case api.Curve.Hermite:
                drawCurveHermite(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
            case api.Curve.Cardinal:
                drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
            case api.Curve.Bezier:
                drawCurveBezier(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
            case api.Curve.BezierMatrix:
                drawCurveBezierMatrix(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
        }
    }

    //
    // This is what we'll export as the rendering API
    const api = {
        clear: clear,
        drawPixel: drawPixel,
        drawLine: drawLine,
        drawCurve: drawCurve
    };

    Object.defineProperty(api, 'sizeX', {
        value: pixelsX,
        writable: false
    });
    Object.defineProperty(api, 'sizeY', {
        value: pixelsY,
        writable: false
    });
    Object.defineProperty(api, 'Curve', {
        value: Object.freeze({
            Hermite: 0,
            Cardinal: 1,
            Bezier: 2,
            BezierMatrix: 3
        }),
        writable: false
    });

    return api;
}(300, 300, true));
