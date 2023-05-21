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
            drawBresenHam(x1, y1, x2, y2, -1, 1, deltaX, deltaY, true, false, color);
        }
        //q1
        else if(m >= 0 && m <= 1 && x2 > x1 && y2 < y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, false, false, color);
        }
        //q2
        else if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
            drawBresenHam(x1, y1, x2, y2, -1 , -1, deltaX, deltaY, false, true, color);
        }
        //q3
        else if(m > 1 && x2 >= x1 && y1 < y2){
            drawBresenHam(x1, y1, x2, y2, 1, 1, deltaX, deltaY, false, false, color); //originally true false
        }
        //q4
        else if(m > 1 && x2 < x1 && y2 > y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, true, false, color);
        }
        //q5
        else if(m >= 0 && m <= 1 && x2 < x1 && y2 > y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, false, true, color);
        }
        //q6
        else if (m >= 0 && m <= 1 && x2 < x1 && y2 >= y1){
            drawBresenHam(x1, y1, x2, y2, -1, -1, deltaX, deltaY, false, false, color);
        }
        //q7
        else if (m > 1 && x2 <= x1 && y2 < y1){
            drawBresenHam(x1, y1, x2, y2, -1, -1, deltaX, deltaY, true, false, color);
        }
    }

    //------------------------------------------------------------------
    //
    // Bresenham line drawing algorithm.
    //
    //------------------------------------------------------------------
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

        drawPoint(x1, y1, 'green');
        drawPoint(x2, y2, 'green');
        drawPoint(s1, t1, 'red');
        drawPoint(s2, t2, 'red');

        var startX = x1;
        var startY = y1;
        var endX = 0;
        var endY = 0;

        //drawLine(s1, t1, x2, y2, 'red');
        //with parentheses 
        //endY = (y1 * ((2 * u**3) - (3 * u**2) + 1)) + (y2 * ((-2 * u**3) + (3 * u**2))) + (t1 * ((u**3) - (2 * u**2) + u)) + (t2 * ((u**3) - (u**2)));

        var inc = 1 / segments;
        var u = inc;

        for(let i = 0; i < segments + 1; i++){
            endX = (x1 * ((2 * u**3) - (3 * u**2) + 1)) + (x2 * ((-2 * u**3) + (3 * u**2))) + (s1 * ((u**3) - (2 * u**2) + u)) + (s2 * ((u**3) - (u**2)));
            endY = (y1 * ((2 * u**3) - (3 * u**2) + 1)) + (y2 * ((-2 * u**3) + (3 * u**2))) + (t1 * ((u**3) - (2 * u**2) + u)) + (t2 * ((u**3) - (u**2)));
            
            drawLine(startX, startY, endX, endY, lineColor);
          
            if(showPoints){
                drawPoint(endX, endY, 'red');
            }

            // var m = Math.abs((endY - startY) / (endX - startX));
            // if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
            //     drawLine(startX, startY, endX, endY, 'white');
            // }

            startX = endX;
            startY = endY;
            u += inc;
        }

        //drawLine(30, 150, 38.31, 167.27999, 'white');
        // drawLine(30, 150, 40, 168, 'white');
    }

    //------------------------------------------------------------------
    //
    // Renders a Cardinal curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor) {
    }

    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveBezier(controls, segments, showPoints, showLine, showControl, lineColor) {
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
