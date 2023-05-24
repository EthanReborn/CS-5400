
MySample.main = (function(graphics) {
    'use strict';

    var x1 = graphics.sizeX * .2;
    var y1 = graphics.sizeY * .5;
    var x2 = graphics.sizeX * .8;
    var y2 = graphics.sizeY * .5;
    let reverse = false;
    //[p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y]
    var a1 = x1+50;
    var b1 = y1-50;
    var a2 = x2-50;
    var b2 = y2-50;

    var c1 = y1+50;
    var c2 = y2+50;

    let previousTime = performance.now();

    var type;
    var control;

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {

        //console.log(elapsedTime);

        if(elapsedTime < 2500){
            type = graphics.Curve.Hermite;
        }else if(elapsedTime < 5000){
            type = graphics.Curve.Cardinal;
        }else if(elapsedTime < 7500){
            type = graphics.Curve.Bezier;
        }else if(elapsedTime < 10000){
            type = graphics.Curve.BezierMatrix;
        }else if(elapsedTime > 10000){
            type = undefined;
            
            if(reverse == false){
                y1++;
                y2++;
            }if(y1 == graphics.sizeY - 30){
                reverse = !reverse;
            }if(y1 == 30){
                reverse = !reverse;
            }if(reverse == true){
                y1--;
                y2--;
            }
            
            if(y1 <= 50){
                b1++;
                b2++;
            }else if(b1 > y1 - 50){
                b1--;
                b2--;
             }else if(b1 < y1 - 50){
                b1++;
                b2++;
            }

            if(y1 > graphics.sizeY -50){
                c1--;
                c2--;
            }
            else if(c1 < y1 + 50){
                c1++;
                c2++;
             }else if(c1 > y1 + 50){
                c1--;
                c2--;
            }
            
        }

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

        if(type == graphics.Curve.Hermite){
            control = hermiteControls;
            graphics.drawCurve(type, control, 10, true, true, true, 'blue');
        }else if(type == graphics.Curve.Cardinal){
            control = cardinalControls;
            graphics.drawCurve(type, control, 10, true, true, true, 'blue');
        }else if(type == graphics.Curve.Bezier){
            control = bezierControls;
            graphics.drawCurve(type, control, 10, true, true, true, 'blue');
        }else if(type == graphics.Curve.BezierMatrix){
            control = bezierMatrixControls;
            graphics.drawCurve(type, control, 10, true, true, true, 'blue');
        }else{
            graphics.clear();
            graphics.drawPoint(x1, y1, 'white');
            graphics.drawPoint(x2, y2, 'white');
            graphics.drawPoint(x2-100, y2, 'white');
            graphics.drawCurve(graphics.Curve.Bezier, [x1, y1, a1, b1, a2, b2, x2, y2], 20, true, true, false, 'white');
            graphics.drawCurve(graphics.Curve.Bezier, [x1, y1, a1, c1, a2, c2, x2, y2], 20, true, true, false, 'white');
        }

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
