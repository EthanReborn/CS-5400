
MySample.main = (function(graphics) {
    'use strict';

    var x1 = graphics.sizeX * .2;
    var y1 = graphics.sizeY * .5;
    var x2 = graphics.sizeX * .8;
    var y2 = graphics.sizeY * .5;
    var x3 = graphics.sizeX * .5;
    var y3 = graphics.sizeY * .8;
    let reverse = false;

 
    function makePrim(verts, center){
        let prim = {
            verts: verts,
            center: center,
        }
        let numPoints = verts.length / 2;
        let totalX = 0;
        let totalY = 0;

        for(let i = 0; i < verts.length; i++){
            if(i % 2 == 0){
                totalX += verts[i];
            }else{
                totalY += verts[i];
            }
        }

        let center 
        return prim;
    }
    

    let previousTime = performance.now();

    var type;
    var control;

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {

        const deltaY = Math.abs(y2 - y1);
        const deltaX = Math.abs(x2 - x1);
        var m = deltaY / deltaX;
        // //q0
        // if(m > 1 && x2 > x1 && y1 > y2){
        //     reverse? x2--: x2++;  
        // }//q1
        // else if(m >= 0 && m <= 1 && x2 > x1 && y2 < y1){
        //     reverse? y2--: y2++;
        // }//q2
        // else if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
        //     reverse? y2--: y2++; 
        // }//q3
        // else if(m > 1 && x2 >= x1 && y1 < y2){
        //     reverse? x2++: x2--;
        // }//q4
        // else if(m > 1 && x2 < x1 && y2 > y1){
        //     reverse? x2++: x2--;
        // }//q5
        // else if(m >= 0 && m <= 1 && x2 < x1 && y2 > y1){
        //     reverse? y2++: y2--;
        // }//q6
        // else if (m >= 0 && m <= 1 && x2 < x1){
        //     reverse? y2++: y2--; 
        // }  //q7
        // else if (m > 1 && x2 <= x1 && y2 < y1){
        //     reverse? x2--: x2++;
        // }
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        //[x1, y1, s1, t1, x2, y2, s2, t2]
        const hermiteControls = [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .1, graphics.sizeY * -.4, graphics.sizeX * .8, graphics.sizeY / 2, graphics.sizeX * -.1, graphics.sizeY * -.3]; 
        //[pk-1x, pk-1y, pkx, pky, pk+1x, pk+1y, pk+2x, pk+2y]
        const cardinalControls = [graphics.sizeX * .1, graphics.sizeY * .2, graphics.sizeX * .2, graphics.sizeY * .5, graphics.sizeX * .8, graphics.sizeY * .5, graphics.sizeX * .9, graphics.sizeY * .45, -2.5];
        //[p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y]
        const bezierControls =       [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .3, graphics.sizeY * .3, graphics.sizeX * .7, graphics.sizeY * .9, graphics.sizeX * .9, graphics.sizeY * .5];
        //[p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y]
        const bezierMatrixControls = [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .3, graphics.sizeY * .7, graphics.sizeX * .7, graphics.sizeY * .2, graphics.sizeX * .9, graphics.sizeY * .5];

        //graphics.drawCurve(graphics.Curve.Hermite, hermiteControls, 15, true, true, true, 'blue');
        //graphics.drawCurve(graphics.Curve.Cardinal, cardinalControls, 10, true, true, true, 'blue');
        //graphics.drawCurve(graphics.Curve.Bezier, bezierControls, 10, true, true, true, 'blue');
        //graphics.drawCurve(graphics.Curve.BezierMatrix, bezierMatrixControls, 10, true, true, true, 'blue');
        //graphics.drawLine(x1, y1, x2, y2, 'red');
        
        let prim1 = makePrim([x1, y1, x2, y2, x3, y3], [(x1 + x2) / 2, (y1 + y2) / 2]); //TODO, function for calculating center 

        graphics.drawPrimitive(prim1, true, 'red');

        let point = [100, 100];

        graphics.drawPoint(point, 'red');
        let distance = [50, 0];
        //console.log(distance);
        point = graphics.translatePoint(point, distance);

        graphics.drawPoint(point, 'green');
        graphics.translatePrimitive(prim1, distance);
        graphics.drawPrimitive(prim1, 'green');
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        let elapsedTime = time - previousTime;
        //previousTime = time;
        update(elapsedTime);
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop);

}(MySample.graphics));
