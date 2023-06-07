
MySample.main = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let gl = canvas.getContext('webgl2');
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    const left =   -2;
    const right =   2;
    const top =     2;
    const bottom = -2;
    const near =    2;
    const far =     10;

    const camera = [0, 0, 2];

    let r = 0.1;
    // let rotateYZ = [
    //     1, 0, 0, 0,
    //     0, Math.cos(r), Math.sin(r), 0,
    //     0, -Math.sin(r), Math.cos(r), 0,
    //     0, 0, 0, 1,
    // ];

    const model = [];

    const view =    [
                        1, 0, 0, -camera[0],
                        0, 1, 0, -camera[1],
                        0, 0, 1, -camera[2],
                        0, 0, 0, 1
                    ];

    const parallelProj =   [
                                2 / (right - left), 0, 0, 0, 
                                0, 2 / (top - bottom), 0, 0, 
                                0, 0, -2 / (far - near),  0,
                                -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
                           ];

    const perspectiveProj = [
                                (2 * near) / (right - left), 0, 0, 0, 
                                0, (2 * near) / (top - bottom), 0, 0, 
                                (right + left) / (right - left), (top + bottom) / (top - bottom), -(far + near) / (far - near), -1, 
                                0, 0, -2 * (far * near) / (far - near), 0
                            ];

    //Step 3: prepare raw data

    //tetrahedron
    let vertices1 = new Float32Array([
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        0.0, 0.5, 1.0,
    ]);

    let indices1 = new Uint16Array([ 3, 1, 0, 3, 0, 2, 3, 2, 1 ]);

    let vertexColors1 = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 1.0, 0.0,
    ]);

    //create buffers 
    let vertexBuffer = gl.createBuffer(); //create buffer object in webgl
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices1, gl.STATIC_DRAW); //put vertices data into buffer object 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors1, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices1, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Step 5 : prepare shaders 
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
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices1.BYTES_PER_ELEMENT * 3, 0); //vertices.BYTES = stride 
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
            let color = gl.getAttribLocation(shaderProgram, 'aColor');
            gl.enableVertexAttribArray(color);
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors1.BYTES_PER_ELEMENT * 3, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            requestAnimationFrame(animationLoop);
        })
        .catch(error => {
            console.log("something went wrong: ");
            console.log(error);
        });

 
    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
 
    function update() {
        // webGl uniform parameters
        if(shaderProgram == null){
            return;
        }

        let rotateYZ = [
            1, 0, 0, 0,
            0, Math.cos(r), Math.sin(r), 0,
            0, -Math.sin(r), Math.cos(r), 0,
            0, 0, 0, 1,
        ];
       
        let locationM = gl.getUniformLocation(shaderProgram, 'model');
        let locationV = gl.getUniformLocation(shaderProgram, 'view');
        let locationP = gl.getUniformLocation(shaderProgram, 'projection');
        gl.uniformMatrix4fv(locationM, false, transposeMatrix4x4(rotateYZ));
        gl.uniformMatrix4fv(locationV, false, transposeMatrix4x4(view));
        gl.uniformMatrix4fv(locationP, false, transposeMatrix4x4(parallelProj));

        r += 0.02;
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        if(shaderProgram == null){
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
        gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);
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
