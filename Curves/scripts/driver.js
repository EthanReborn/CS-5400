
MySample.main = (function(graphics) {
    'use strict';

    let previousTime = performance.now();

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        const controls = [graphics.sizeX * .1, graphics.sizeY / 2, graphics.sizeX * .2, graphics.sizeY * .9, graphics.sizeX * .8, graphics.sizeY / 2, graphics.sizeX * .9, graphics.sizeY * .1]; 
        //[x1, y1, s1, t1, x2, y2, s2, t2]
        graphics.drawCurve(graphics.Curve.Hermite, controls, 50, true, true, true, 'red');
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        let elapsedTime = time - previousTime;
        previousTime = time;
        update(elapsedTime);
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop);

}(MySample.graphics));
