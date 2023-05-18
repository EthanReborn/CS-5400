
MySample.main = (function(graphics) {
    'use strict';
    
    let x1 = graphics.sizeX / 2;
    let y1 = graphics.sizeY / 2;
    let x2 = graphics.sizeX * .4;
    let y2 = graphics.sizeY * 0;

    let x3 = graphics.sizeX * .5;
    let y3 = graphics.sizeY / 2;
    
    let reverse = true;

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update() {

        const deltaY = Math.abs(y2 - y1);
        const deltaX = Math.abs(x2 - x1);
        var m = deltaY / deltaX;

        //q0
        if(m > 1 && x2 > x1 && y1 > y2){
            reverse? x2--: x2++;  
        }//q1
        else if(m >= 0 && m <= 1 && x2 > x1 && y2 < y1){
            reverse? y2--: y2++;
        }//q2
        else if(m >= 0 && m <= 1 && x1 < x2 && y2 >= y1){
            reverse? y2--: y2++; 
        }//q3
        else if(m > 1 && x2 >= x1 && y1 < y2){
            reverse? x2++: x2--;
        }//q4
        else if(m > 1 && x2 < x1 && y2 > y1){
            reverse? x2++: x2--;
        }//q5
        else if(m >= 0 && m <= 1 && x2 < x1 && y2 > y1){
            reverse? y2++: y2--;
        }//q6
        else if (m >= 0 && m <= 1 && x2 < x1){
            reverse? y2++: y2--; 
        }  //q7
        else if (m > 1 && x2 <= x1 && y2 < y1){
            reverse? x2--: x2++;
        }

        if(graphics.octant2 == 0){
            reverse? x3++: x3--;   
        }else if(graphics.octant2 == 1){
            reverse? y3++: y3--;
        }else if(graphics.octant2 == 2){
            reverse? y3++: y3--; 
        }else if(graphics.octant2 == 3){
            reverse? x3--: x3++;
        }else if(graphics.octant2 == 4){
            reverse? x3--: x3++;
        }else if(graphics.octant2 == 5){
            reverse? y3--: y3++;
        }else if(graphics.octant2 == 6){
            reverse? y3--: y3++; 
        }else if(graphics.octant2 == 7){
            reverse? x3++: x3--;
        }

        // if(x2 == graphics.sizeX / 2){
        //     reverse = !reverse;
        // }
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawLine(x1, y1, x2, y2, 'red');
        //graphics.drawLine(x1, y1, x3, y3, 'blue');
        // console.log("octant1: " + graphics.octant1);
        // console.log("octant2: " + graphics.octant2);
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        update();
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop); 

}(MySample.graphics));
