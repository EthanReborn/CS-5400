
MySample.main = (function(graphics) {
    'use strict';

    function makePrim(verts){
        //calculate center 
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
        let center = [totalX / numPoints, totalY / numPoints];

        let prim = {
            verts: verts,
            center: center,
        }

        return prim;
    }

    var x1 = graphics.sizeX * .2;
    var y1 = graphics.sizeY * .5;
    var x2 = graphics.sizeX * .8;
    var y2 = graphics.sizeY * .5;
    var x3 = graphics.sizeX * .8;
    var y3 = graphics.sizeY * .8;
    var x4 = graphics.sizeX * .2;
    var y4 = graphics.sizeY * .8;
    
    var x5 = graphics.sizeX * .2;
    var y5 = graphics.sizeY * .3;
    var x6 = graphics.sizeX * .8;
    var y6 = graphics.sizeY * .3;
    var x7 = graphics.sizeX * .8;
    var y7 = graphics.sizeY * .6;

    var x9 = graphics.sizeX * .4;
    var y9 = graphics.sizeY * .3;
    var x10 = graphics.sizeX * .6;
    var y10 = graphics.sizeY * .3;
    var x11 = graphics.sizeX * .8;
    var y11 = graphics.sizeY * .6;
    var x12 = graphics.sizeX * .2;
    var y12 = graphics.sizeY * .6;

    var a1 = graphics.sizeX * .2;
    var b1 = graphics.sizeY * .3;

    var a2 = graphics.sizeX * .4;
    var b2 = graphics.sizeY * .3;

    var a3 = graphics.sizeX * .5;
    var b3 = graphics.sizeY * .1;

    var a4 = graphics.sizeX * .6;
    var b4 = graphics.sizeY * .3;

    var a5 = graphics.sizeX * .8;
    var b5 = graphics.sizeY * .3;

    var a6 = graphics.sizeX * .6;
    var b6 = graphics.sizeY * .45;

    var a7 = graphics.sizeX * .7;
    var b7 = graphics.sizeY * .7;

    var a8 = graphics.sizeX * .5;
    var b8 = graphics.sizeY * .5;

    var a9 = graphics.sizeX * .3;
    var b9 = graphics.sizeY * .7;

    var a10 = graphics.sizeX * .4;
    var b10 = graphics.sizeY * .45;

    let reverse = false;
    let reverseY = false;
    let reverseSize1 = false;
    let reverseSize2 = false;
    //[x1, y1, s1, t1, x2, y2, s2, t2]
    const hermiteControls = [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .1, graphics.sizeY * -.4, graphics.sizeX * .8, graphics.sizeY / 2, graphics.sizeX * -.1, graphics.sizeY * -.3]; 
    //[pk-1x, pk-1y, pkx, pky, pk+1x, pk+1y, pk+2x, pk+2y]
    const cardinalControls = [graphics.sizeX * .1, graphics.sizeY * .2, graphics.sizeX * .2, graphics.sizeY * .5, graphics.sizeX * .8, graphics.sizeY * .5, graphics.sizeX * .9, graphics.sizeY * .45, -2];
    //[p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y]
    const bezierControls = [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .3, graphics.sizeY * .3, graphics.sizeX * .7, graphics.sizeY * .9, graphics.sizeX * .9, graphics.sizeY * .5];
    const bezierControls2 = [graphics.sizeX * .9, graphics.sizeY / 2, graphics.sizeX * .7, graphics.sizeY * .3, graphics.sizeX * .3, graphics.sizeY * .9, graphics.sizeX * .1, graphics.sizeY * .5];
    //[p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y]
    const bezierMatrixControls = [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .3, graphics.sizeY * .7, graphics.sizeX * .7, graphics.sizeY * .2, graphics.sizeX * .9, graphics.sizeY * .5];

    let prim1 = makePrim([x1, y1, x2, y2, x3, y3, x4, y4]); //TODO, function for calculating center
    let prim2 = makePrim([x5, y5, x6, y6, x7, y7]); //TODO, function for calculating center
    let prim3 = makePrim([x9, y9, x10, y10, x11, y11, x12, y12]);
    let prim4 = makePrim([a1, b1, a2, b2, a3, b3, a4, b4, a5, b5, a6, b6, a7, b7, a8, b8, a9, b9, a10, b10]);

    let previousTime = performance.now();

    var type;
    var control;

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {

        graphics.rotateCurve(graphics.Curve.Bezier, bezierControls2, 1, true, true, true, 'green');
        graphics.rotateCurve(graphics.Curve.Bezier, bezierControls, -1, true, true, true, 'green');
        
        if(prim1.verts[0] == 0){
            reverse = true;
        }
        if(prim1.verts[2] == graphics.sizeX){
            reverse = false;
        }

        if(prim1.verts[1] == 0 || prim1.verts[3] == 0){
            reverseY = true;
        }
        if(prim1.verts[5] == graphics.sizeY || prim1.verts[7] == graphics.sizeY){
            reverseY = false;
        }

        if(reverse){
            graphics.translatePrimitive(prim1, [2, 0]);
        }
        else{
            graphics.translatePrimitive(prim1, [-2, 0]);
        }

        if(reverseY){
            graphics.translatePrimitive(prim1, [0, 2]);
        }
        else{
            graphics.translatePrimitive(prim1, [0, -2]);
        }

        if(Math.abs(prim2.verts[0] - prim2.verts[2]) <= 1){
            //graphics.scalePrimitive(prim2, [1.5, 1.5]);
            console.log('true');
            reverseSize1 = true;
        }

        if(Math.abs(prim2.verts[0] - prim2.verts[2]) >= 500){
            //graphics.scalePrimitive(prim2, [.9, .9]);
            reverseSize1 = false;
        }

        if(reverseSize1){
            graphics.scalePrimitive(prim2, [1.1, 1.1]);
        }else{
            graphics.scalePrimitive(prim2, [.9, .9]);
        }
    
        //

        if(Math.abs(prim3.verts[0] - prim3.verts[2]) <= 1){
            //graphics.scalePrimitive(prim2, [1.5, 1.5]);
            console.log('true');
            reverseSize2 = true;
        }

        if(Math.abs(prim3.verts[0] - prim3.verts[2]) >= 500){
            //graphics.scalePrimitive(prim2, [.9, .9]);
            reverseSize2 = false;
        }

        if(reverseSize2){
            graphics.scalePrimitive(prim3, [1.05, 1.05]);
        }else{
            graphics.scalePrimitive(prim3, [.95, .95]);
        }

        graphics.rotatePrimitive(prim4, 1);
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();

        //graphics.drawCurve(graphics.Curve.Hermite, hermiteControls, 15, true, true, true, 'blue');
        //graphics.drawCurve(graphics.Curve.Cardinal, cardinalControls, 10, true, true, true, 'blue');
        //graphics.drawCurve(graphics.Curve.Bezier, bezierControls, 10, true, true, true, 'blue');
        //graphics.drawCurve(graphics.Curve.BezierMatrix, bezierMatrixControls, 10, true, true, true, 'blue');
        //graphics.drawLine(x1, y1, x2, y2, 'red'); 

        graphics.drawPrimitive(prim1, true, 'yellow');
        graphics.drawPrimitive(prim2, true, 'blue');
        graphics.drawPrimitive(prim3, true, 'blue');
        graphics.drawPrimitive(prim4, true, 'white');

        graphics.drawCurve(graphics.Curve.Bezier, bezierControls, 20, true, true, true, 'green');
        graphics.drawCurve(graphics.Curve.Bezier, bezierControls2, 20, true, true, true, 'green');
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
