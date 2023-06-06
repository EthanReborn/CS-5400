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
    function drawPoint(points, ptColor) {
        let x = points[0];
        let y = points[1];
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
        }
        //q4
        else if(m > 1 && x2 < x1 && y2 > y1){
            drawBresenHam(x1, y1, x2, y2, 1, -1, deltaX, deltaY, true, true, true, color);
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

    function respectToU() {
        const memo = [];
    
        function compute(u, section) {
            if (section === 1) {
                return (2 * u ** 3) - (3 * u ** 2) + 1;
            } else if (section === 2) {
                return (-2 * u ** 3) + (3 * u ** 2);
            } else if (section === 3) {
                return (u ** 3) - (2 * u ** 2) + u;
            } else if (section === 4) {
                return (u ** 3) - (u ** 2);
            }
        }
    
        return function inner(u, section) {
            const index = Math.floor(u * 1000);
            if (memo[index] === undefined || memo[index][section] === undefined) {
                if (memo[index] === undefined) {
                    memo[index] = [];
                }
                memo[index][section] = compute(u, section);
            }
            return memo[index][section];
        };
    }

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

        var inc = 1 / segments;
        var u = 0;

        const U = respectToU();

        const preU = respectToU();
      
        const result = preU(u, 1);

        console.log('result ' + result);

        while(u <= 1){
            //endX = (x1 * ((2 * u**3) - (3 * u**2) + 1)) + (x2 * ((-2 * u**3) + (3 * u**2))) + (s1 * ((u**3) - (2 * u**2) + u)) + (s2 * ((u**3) - (u**2)));
            //endY = (y1 * ((2 * u**3) - (3 * u**2) + 1)) + (y2 * ((-2 * u**3) + (3 * u**2))) + (t1 * ((u**3) - (2 * u**2) + u)) + (t2 * ((u**3) - (u**2)));

            var c0 = U(u, 1);
            console.log(c0);
            endX = x1 * preU(u, 1) + x2 * preU(u, 2) + s1 * preU(u, 3) + s2 * preU(u, 4);
            endY = y1 * preU(u, 1) + y2 * preU(u, 2) + t1 * preU(u, 3) + t2 * preU(u, 4);
 
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

    function respectToU4() {
        const memo = [];
    
        function compute(u, s, section) {
            if(section == 0){
                return (-1 * s * u ** 3) + (2 * s * u ** 2) - (s * u);
            }else if(section === 1) {
                return (2 - s) * u ** 3 + (s - 3) * u ** 2 + 1;
            } else if (section === 2) {
                return (s - 2) * u ** 3 + (3 - 2 * s) * u ** 2 + (s * u);
            } else if (section === 3) {
                return s * u ** 3 - s * u ** 2;
            }
        }
    
        return function inner(u, s, section) {
            const index = Math.floor(u * 1000);
            if (memo[index] === undefined || memo[index][section] === undefined) {
                if (memo[index] === undefined) {
                    memo[index] = [];
                }
                memo[index][section] = compute(u, s, section);
            }
            return memo[index][section];
        };
    }

    //------------------------------------------------------------------
    //
    // Renders a Cardinal curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor) {

        // let c0 = -s * u3 + 2 * s * u2 - s * u + 0;
        // let c1 = (2 - s) * u3 + (s - 3) * u2 + 0 * u + 1;
        // let c2 = (s - 2) * u3 + (3 - 2 * s) * u2 + s * u + 0;
        // let c3 = s * u3 - s * u2 + 0 * u + 0;
        // let pu = c0 * p0 + c1 * p1 + c2 * s0 + c3 * s1;
        
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
            drawPoint(pkmx, pkmy, "blue");
            drawPoint(pk2x, pk2y, 'blue');
            drawLine(pkx, pky, pkmx, pkmy, 'red');
            drawPoint(pkx, pky, 'yellow');
            drawPoint(pk1x, pk1y, 'green');
            drawLine(pk1x, pk1y, pk2x, pk2y, 'red');

            // drawPoint(p0Primey, p0Primex, 'red');
            // drawPoint(p1Primex, p1Primey, 'red');
        }

        var u = 0; 
        var inc = 1 / segments;

        var preU = respectToU4();

        while(u <= 1){
            
            // endX =
            //     pkmx * ((-1 * s * u ** 3) + (2 * s * u ** 2) - (s * u)) +
            //     pkx * (((2 - s) * u ** 3) + ((s - 3) * u ** 2) + 1) +
            //     pk1x * ((s - 2) * u ** 3 + (3 - 2 * s) * u ** 2 + s * u) +
            //     pk2x * (s * u ** 3 - s * u ** 2);
            // endY =
            //     pkmy * ((-1 * s * u ** 3) + (2 * s * u ** 2) - (s * u)) +
            //     pky * (((2 - s) * u ** 3) + ((s - 3) * u ** 2) + 1) +
            //     pk1y * ((s - 2) * u ** 3 + (3 - 2 * s) * u ** 2 + s * u) +
            //     pk2y * (s * u ** 3 - s * u ** 2);

            endX =
                pkmx * preU(u, s, 0) +
                pkx *  preU(u, s, 1) +
                pk1x * preU(u, s, 2) +
                pk2x * preU(u, s, 3);
            endY =
                pkmy * preU(u, s, 0) +
                pky *  preU(u, s, 1) +
                pk1y * preU(u, s, 2) +
                pk2y * preU(u, s, 3);

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
        drawLine(startX, startY, pk1x, pk1y, lineColor);
    }

    function respectToU3() {
        const memo = [];

        function compute(u, k) {
            let n = 3;
            return Math.pow(u, k) * Math.pow(1 - u, n - k);
        }

        return function inner(u, k) {
            const index = Math.floor(u * 1000);
            if (memo[index] === undefined || memo[index][k] === undefined) {
                if (memo[index] === undefined) {
                    memo[index] = [];
                }
                memo[index][k] = compute(u, k);
            }
            //console.log(memo);
            return memo[index][k];
        };
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

        if(showControl){
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

        var coefficients = [];

        for(let k = 0; k <= n; k++){
            var cnk = factorial(n) / (factorial(k) * factorial(n - k));
            coefficients.push(cnk);
            // console.log(cnk);
        }   

        var preU = respectToU3();

        while(u <= 1){
            var endX = 0;
            var endY = 0;

            for(let k = 0; k <= n; k++){
                var cnk = coefficients[k];
                //var bez = cnk * Math.pow(u, k) * Math.pow(1 - u, n - k);
                var bez = cnk * preU(u, k);
                endX += xList[k] * bez; //list of x values at each Pk
                endY += yList[k] * bez;
            }    
            //console.log('end x: ' + endX + ' end y: ' + endY);

            if(showLine){
                drawLine(startX, startY, endX, endY, lineColor);
            }

            if(showPoints){
                drawPoint(endX, endY, 'blue');
            }

            startX = endX;
            startY = endY;

            u += inc;
        }
        drawLine(endX, endY, P3x, P3y, lineColor);
    }

    function factorial (num) { 
        if(num == 1 || num == 0){
            return 1;
        }else{
            return num * factorial(num -1);
        }
    }

    function respectToU2() {
        const memo = [];
    
        function compute(u, section) {
            if(section == 0){
                return u**3;
            }else if(section === 1) {
                return -3 * (u**3) + 3 * (u**2);
            } else if (section === 2) {
                return 3 * (u**3) - 6 * (u**2) + (3 * u);
            } else if (section === 3) {
                return -1 * (u**3) + 3 * (u**2) - (3 * u) + 1;
            }
        }
    
        return function inner(u, section) {
            const index = Math.floor(u * 1000);
            if (memo[index] === undefined || memo[index][section] === undefined) {
                if (memo[index] === undefined) {
                    memo[index] = [];
                }
                memo[index][section] = compute(u, section);
            }
            return memo[index][section];
        };
    }

    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters; using the matrix form.
    // This follows the Mathematics for Game Programmers form.
    //
    //------------------------------------------------------------------
    function drawCurveBezierMatrix(controls, segments, showPoints, showLine, showControl, lineColor) {
        const MATRIX = [[1,0,0,0],[-3,3,0,0],[3,-6,3,0],[-1,3,-3,1]];
        
        var inc = 1 / segments;
        var u = 0;
        const Mu = [];

        var P0x = controls[6];
        var P0y = controls[7];
        var P1x = controls[4];
        var P1y = controls[5];
        var P2x = controls[2];
        var P2y = controls[3];
        var P3x = controls[0];
        var P3y = controls[1];

        if(showControl){
            drawPoint(P0x, P0y, 'green');
            drawPoint(P1x, P1y, 'red');
            drawPoint(P2x, P2y, 'red');
            drawPoint(P3x, P3y, 'green');
        }

        var startX = P3x;
        var startY = P3y;

        var endX = 0;
        var endY = 0;

        var preU2 = respectToU2();

        while(u <= 1){
            // endX =  P0x * (u**3) +
            //             P1x * ((-3 * (u**3)) + (3 * (u**2))) +
            //             P2x * ((3 * (u**3)) - (6 * (u**2)) + (3 * u)) +
            //             P3x * ((-1 * (u**3)) + (3 * (u**2)) - (3 * u) + 1);

            // endY =  P0y * (u**3) +
            //             P1y * ((-3 * (u**3)) + (3 * (u**2))) +
            //             P2y * ((3 * (u**3)) - (6 * (u**2)) + (3 * u)) +
            //             P3y * ((-1 * (u**3)) + (3 * (u**2)) - (3 * u) + 1);

            endX =  P0x * preU2(u, 0) +
                    P1x * preU2(u, 1) +
                    P2x * preU2(u, 2) +
                    P3x * preU2(u, 3);

            endY =  P0y * preU2(u, 0) +
                    P1y * preU2(u, 1) +
                    P2y * preU2(u, 2) +
                    P3y * preU2(u, 3);

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


//let WORLD_ORIGIN = [canvas.width / 4, canvas.height / 4];
let WORLD_ORIGIN = [0, 0];

    //------------------------------------------------------------------
    //
    // Renders a primitive of the form: {
    //    verts: [ {x, y}, ...],    // Must have at least 2 verts
    //    center: { x, y }
    // }
    // 
    // connect: If true, the last vertex and first vertex have a line drawn between them.
    //
    // color: The color to use when drawing the lines
    //
    //------------------------------------------------------------------
    function drawPrimitive(primitive, connect, color) {
        for(let i = 0; i < primitive.verts.length - 2; i += 2){
            drawLine(primitive.verts[i], primitive.verts[i+1], primitive.verts[i+2], primitive.verts[i+3], color);
        }
        if(connect){
            drawLine(primitive.verts[primitive.verts.length -2], primitive.verts[primitive.verts.length -1], primitive.verts[0], primitive.verts[1], color);
        }
    }

    //------------------------------------------------------------------
    //
    // Translates a point of the form: { x, y }
    //
    // distance: { x, y }
    //
    //------------------------------------------------------------------
    function translatePoint(point, distance) {
        let newPoint = [];
        let x = point[0] + distance[0];
        let y = point[1] + distance[1];
        newPoint.push(x);
        newPoint.push(y);
        return newPoint;
    }

    //------------------------------------------------------------------
    //
    // Translates a primitive of the form: {
    //    verts: [],    // Must have at least 2 verts
    //    center: { x, y }
    // }
    //
    // distance: { x, y }
    //
    //------------------------------------------------------------------
    function translatePrimitive(primitive, distance) {
        if(primitive.verts.length < 4){
            console.log("error: primitive must have at least 2 points.");
        }
        //update center code 
        // let newCenter = [];
        // let newX = primitive.center[0] + distance[0];   
        // let newY = primitive.center[1] + distance[1];   
        // newCenter.push(newX, newY);
        // return newCenter;

        for(let i = 0; i < primitive.verts.length; i++){
            if(i % 2 == 0){
                primitive.verts[i] += distance[0];
            }else{
                primitive.verts[i] += distance[1];
            }
        }
       
        primitive.center[0] += distance[0];
        primitive.center[1] += distance[1];
    }

    //------------------------------------------------------------------
    //
    // Scales a primitive of the form: {
    //    verts: [],    // Must have at least 2 verts
    //    center: { x, y }
    // }
    //
    // scale: { x, y }
    //
    //------------------------------------------------------------------
    function scalePrimitive(primitive, scale) {

        //console.log('original        ' + primitive.verts);

        let distance = [WORLD_ORIGIN[0] - primitive.center[0], WORLD_ORIGIN[1] - primitive.center[1]];
        let distanceBack = [(WORLD_ORIGIN[0] - primitive.center[0]) * -1, (WORLD_ORIGIN[1] - primitive.center[1]) * -1];
        translatePrimitive(primitive, distance);

        //console.log('translate 1     ' + primitive.verts);

        for(let i = 0; i < primitive.verts.length; i++){
            if(i % 2 == 0){
                primitive.verts[i] *= scale[0];
            }else{
                primitive.verts[i] *= scale[1];
            }
        }

        //console.log('scale           ' + primitive.verts);

        translatePrimitive(primitive, distanceBack);

        //console.log('translate back: ' + primitive.verts);
    }

    //------------------------------------------------------------------
    //
    // Rotates a primitive of the form: {
    //    verts: [],    // Must have at least 2 verts
    //    center: { x, y }
    // }
    //
    // angle: radians
    //
    //------------------------------------------------------------------
    function rotatePrimitive(primitive, angle) {
        //convert degrees into radians
        angle *= Math.PI / 180;

        let distance = [WORLD_ORIGIN[0] - primitive.center[0], WORLD_ORIGIN[1] - primitive.center[1]];
        let distanceBack = [(WORLD_ORIGIN[0] - primitive.center[0]) * -1, (WORLD_ORIGIN[1] - primitive.center[1]) * -1];

        translatePrimitive(primitive, distance);

        for(let i = 0; i < primitive.verts.length - 1; i += 2){
            let newX = (primitive.verts[i] * Math.cos(angle)) - (primitive.verts[i+1] * Math.sin(angle));
            let newY = (primitive.verts[i] * Math.sin(angle)) + (primitive.verts[i+1] * Math.cos(angle));
            primitive.verts[i] = newX;
            primitive.verts[i+1] = newY;
        }

        translatePrimitive(primitive, distanceBack);
    }

    //------------------------------------------------------------------
    //
    // Translates a curve.
    //    type: Cardinal, Bezier
    //    controls: appropriate to the curve type
    //    distance: { x, y }
    //
    //------------------------------------------------------------------
    function translateCurve(type, controls, distance) {
        let centerX = 0;
        let centerY = 0;
        //skips t value of cardinal controls in for loop
        let offset = 0;
        if(type == api.Curve.Cardinal){
            centerX = (controls[2] + controls[4]) / 2 + distance[0];
            centerY = (controls[3] + controls[5]) / 2 + distance[1];
            offset = -1;
        }else if(type == api.Curve.Bezier){
            centerX = (controls[0] + controls[6]) / 2 + distance[0];
            centerY = (controls[1] + controls[7]) / 2 + distance[1];
        }else if(type == api.Curve.BezierMatrix){
            centerX = (controls[0] + controls[6]) / 2 + distance[0];
            centerY = (controls[1] + controls[7]) / 2 + distance[1];
        }

        for(let i = 0; i < controls.length + offset; i++){
            if(i % 2 == 0){
                controls[i] += distance[0];
            }else{
                controls[i] += distance[1];
            }
        }   
    }

    //------------------------------------------------------------------
    //
    // Scales a curve relative to its center.
    //    type: Cardinal, Bezier
    //    controls: appropriate to the curve type
    //    scale: { x, y }
    //
    //------------------------------------------------------------------
    function scaleCurve(type, controls, scale) {
        let centerX = 0;
        let centerY = 0;
        //skips t value of cardinal controls in for loop
        let offset = 0;
        if(type == api.Curve.Cardinal){
            centerX = (controls[2] + controls[4]) / 2;
            centerY = (controls[3] + controls[5]) / 2;
            offset = -1;
        }else if(type == api.Curve.Bezier){
            centerX = (controls[0] + controls[6]) / 2;
            centerY = (controls[1] + controls[7]) / 2;
        }else if(type == api.Curve.BezierMatrix){
            centerX = (controls[0] + controls[6]) / 2;
            centerY = (controls[1] + controls[7]) / 2;
        }

        let distance = [WORLD_ORIGIN[0] - centerX, WORLD_ORIGIN[1] - centerY];
        let distanceBack = [(WORLD_ORIGIN[0] - centerX) * -1, (WORLD_ORIGIN[1] - centerY) * -1];

        translateCurve(type, controls, distance);

        //console.log('translate 1     ' + controls);

        for(let i = 0; i < controls.length + offset; i++){
            if(i % 2 == 0){
                controls[i] *= scale[0];
            }else{
                controls[i] *= scale[1];
            }
        }

        api.drawPoint([centerX, centerY], 'yellow');

        //console.log('scale           ' + controls);

        translateCurve(type, controls, distanceBack);

        //console.log('translate back: ' + controls);
    }

    //------------------------------------------------------------------
    //
    // Rotates a curve about its center.
    //    type: Cardinal, Bezier
    //    controls: appropriate to the curve type
    //    angle: radians
    //
    //------------------------------------------------------------------
    function rotateCurve(type, controls, angle) {
        //convert degrees into radians
        angle *= Math.PI / 180;

        let centerX = 0;
        let centerY = 0;
        let offset = 0;
        if(type == api.Curve.Cardinal){
            centerX = (controls[2] + controls[4]) / 2;
            centerY = (controls[3] + controls[5]) / 2;
            offset = -1;
        }else if(type == api.Curve.Bezier){
            centerX = (controls[0] + controls[6]) / 2;
            centerY = (controls[1] + controls[7]) / 2;
        }else if(type == api.Curve.BezierMatrix){
            centerX = (controls[0] + controls[6]) / 2;
            centerY = (controls[1] + controls[7]) / 2;
        }

        let distance = [WORLD_ORIGIN[0] - centerX, WORLD_ORIGIN[1] - centerY];
        let distanceBack = [(WORLD_ORIGIN[0] - centerX) * -1, (WORLD_ORIGIN[1] - centerY) * -1];

        translateCurve(type, controls, distance);

        for(let i = 0; i < controls.length + offset; i += 2){
            let newX = (controls[i] * Math.cos(angle)) - (controls[i+1] * Math.sin(angle));
            let newY = (controls[i] * Math.sin(angle)) + (controls[i+1] * Math.cos(angle));
            controls[i] = newX;
            controls[i+1] = newY;
        }

        translateCurve(type, controls, distanceBack);
    }

    //
    // This is what we'll export as the rendering API
    const api = {
        clear: clear,
        drawPixel: drawPixel,
        drawLine: drawLine,
        drawCurve: drawCurve,
        drawPoint: drawPoint,
        drawPrimitive: drawPrimitive,
        translatePrimitive: translatePrimitive,
        scalePrimitive: scalePrimitive,
        rotatePrimitive: rotatePrimitive,
        translateCurve: translateCurve,
        scaleCurve: scaleCurve,
        rotateCurve: rotateCurve,
        translatePoint: translatePoint
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
}(1000, 1000, true));
