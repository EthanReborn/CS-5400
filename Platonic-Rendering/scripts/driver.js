//import { loadFileFromServer } from "./utilities";

MySample.main = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let gl = canvas.getContext('webgl2');

    let vertices = new Float32Array([
        0.0, 0.5, 0.0,
        0.5, 0.0, 0.0,
        -0.5, 0.0, 0.0
    ]);

    let indices = new Uint16Array([ 0, 1, 2 ]);

    let vertexColors = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ]);

    let vertexBuffer = gl.createBuffer(); //create buffer object in webgl
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); //put vertices data into buffer object 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Step 5 : prepare shaders 
        // string of the vertex shader code

    let vertexShader = null;
    let fragmentShader = null;
    let shaderProgram = null;
    
    loadFileFromServer('shaders/vertex.vert')  
        .then(source => {
            console.log('step 1 done');
            vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, source);
            gl.compileShader(vertexShader);
            console.log(gl.getShaderInfoLog(vertexShader)); // for debugging
            return loadFileFromServer('shaders/fragment.frag');
        })
        .then(fragmentShaderSource => {
            // handle the next shader/thing
            console.log('step 2 done');
            fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentShaderSource);
            gl.compileShader(fragmentShader);
        })
        .then(() => {
            console.log('step 3 done');
            shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram); //set webgl state to use this shader program

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            let position = gl.getAttribLocation(shaderProgram, 'aPosition');
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0); //vertices.BYTES = stride 
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
            let color = gl.getAttribLocation(shaderProgram, 'aColor');
            gl.enableVertexAttribArray(color);
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors.BYTES_PER_ELEMENT * 3, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            requestAnimationFrame(animationLoop);
        })
        .catch(error => {
            console.log("something went wrong: ");
            console.log(error);
        });
        
    // let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    // gl.shaderSource(vertexShader, vertexShaderSource);
    // gl.compileShader(vertexShader);
    // console.log(gl.getShaderInfoLog(vertexShader)); // for debugging

    // let fragmentShaderSource = loadFileFromServer('shaders/fragment.frag'); // string of the fragment shader code
    // let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // gl.shaderSource(fragmentShader, fragmentShaderSource);
    // gl.compileShader(fragmentShader);

    //create shader program
    //attach fragment and vertex shader to shader program 
        // let shaderProgram = gl.createProgram();
        // gl.attachShader(shaderProgram, vertexShader);
        // gl.attachShader(shaderProgram, fragmentShader);
        // gl.linkProgram(shaderProgram);
        // gl.useProgram(shaderProgram); //set webgl state to use this shader program 

    //Step 6 : Specify Shader & Buffer Object Attributes
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // let position = gl.getAttribLocation(shaderProgram, 'aPosition');
    // gl.enableVertexAttribArray(position);
    // gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0); //vertices.BYTES = stride 
    // //gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    // let color = gl.getAttribLocation(shaderProgram, 'aColor');
    // gl.enableVertexAttribArray(color);
    // gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors.BYTES_PER_ELEMENT * 3, 0);
    // //gl.bindBuffer(gl.ARRAY_BUFFER, null);

        
    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update() {
        // webGl uniform parameters
        // let uMatrix = [...];
        // let location = gl.getUniformLocation(shader, 'uThing');
        // gl.uniformMatrix4fv(location, false, uMatrix);
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        if(shaderProgram == undefined){
            return;
        }

        gl.clearColor(
            0.3921568627450980392156862745098,
            0.58431372549019607843137254901961,
            0.92941176470588235294117647058824,
            1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //step 9
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
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

}());
