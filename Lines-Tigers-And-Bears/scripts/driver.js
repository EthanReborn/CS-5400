
MySample.main = (function(graphics) {
    'use strict';
    
    let x1 = graphics.sizeX / 2;
    let y1 = graphics.sizeY / 2;
    let x2 = graphics.sizeX * .5;
    let y2 = graphics.sizeY * 1;

    let x3 = graphics.sizeX * .5;
    let y3 = graphics.sizeY;
    
    let reverse = true;

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update() {
        if(graphics.octant1 == 0){
            reverse? x2--: x2++;   
        }else if(graphics.octant1 == 1){
            reverse? y2--: y2++;
        }else if(graphics.octant1 == 2){
            reverse? y2--: y2++; 
        }else if(graphics.octant1 == 3){
            reverse? x2++: x2--;
        }else if(graphics.octant1 == 4){
            reverse? x2++: x2--;
        }else if(graphics.octant1 == 5){
            reverse? y2++: y2--;
        }else if(graphics.octant1 == 6){
            reverse? y2++: y2--; 
        }else if(graphics.octant1 == 7){
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
