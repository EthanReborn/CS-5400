
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

    const camera = [0, 0, 4];

    let r = 0.01;

    let s = 0.01;

    const view =    [
                        1, 0, 0, -camera[0],
                        0, 1, 0, -camera[1],
                        0, 0, 1, -camera[2],
                        0, 0, 0, 1
                    ];
//---
    const parallelProj =   [
                                2 / (right - left), 0, 0, -(left + right) / (right - left), 
                                0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom), 
                                0, 0,  -2 / (far - near),  -(far + near) / (far - near),
                                0, 0, 0, 1
                           ];

    const perspectiveProj = [
                                (2 * near) / (right - left), 0, 0, 0, 
                                0, (2 * near) / (top - bottom), 0, 0, 
                                (right + left) / (right - left), (top + bottom) / (top - bottom), -(far + near) / (far - near), -1, 
                                0, 0, -2 * (far * near) / (far - near), 0
                            ];

    //Step 3: prepare raw data

//----------TETRAHEDRON---------

    let vertices1 = new Float32Array([
        0.0, 1.0, 0.0, //0
        1.0, 0.0, 0.0, //1
        -1.0, 0.0, 0.0, //2
        0.0, -0.5, 1.0, //3
    ]);

    let indices1 = new Uint16Array([ 3, 1, 0, 3, 0, 2, 3, 2, 1, 1, 2, 0 ]);

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
    
//-------OCTAHEDRON--------

    let vertices2 = new Float32Array([
        0.0, 0.0, 1.0, //front 0
        1.0, 0.0, 0.0, //right 1
        0.0, 0.0, -1.0, //back 2
        -1.0, 0.0, 0.0, //left 3
        0.0, 1.0, 0.0, //top   4
        0.0, -1.0, 0.0, //bottom 5
    ]);

    let indices2 = new Uint16Array([ 0, 4, 3,  0, 4, 1,  2, 3, 4,  2, 1, 4,  0, 3, 5,  0, 5, 1,  5, 2, 3,  5, 1, 2 ]);

    let vertexColors2 = new Float32Array([
        0.0, 0.0, 1.0, //front 0
        1.0, 0.0, 0.0, //right 1
        0.0, 0.0, 1.0, //back 2
        1.0, 0.0, 0.0, //left 3
        0.0, 1.0, 0.0, //top   4
        0.0, 1.0, 0.0, //bottom 5
    ]);

    //create buffers 
    let vertexBuffer2 = gl.createBuffer(); //create buffer object in webgl
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW); //put vertices data into buffer object 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertexColorBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors2, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer2 = gl.createBuffer(); 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices2, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Step 5 : prepare shaders 
    let vertexShader2 = null;
    let fragmentShader2 = null;
    let shaderProgram2 = null;
    
//--------CUBE------------

    let vertices3 = new Float32Array([
        -1.0, 1.0, 1.0, //front upper left 0
        1.0, 1.0, 1.0, //front upper right 1
        -1.0, -1.0, 1.0, //front lower left 2
        1.0, -1.0, 1.0, //front lower right 3
        -1.0, 1.0, -1.0, //back upper left 4
        1.0, 1.0, -1.0, //back upper right 5
        -1.0, -1.0, -1.0, //back lower left 6
        1.0, -1.0, -1.0   //back lower right 7
    ]);

    let indices3 = new Uint16Array([ 2, 3, 1,  2, 1, 0,  6, 2, 0,  6, 0, 4,  3, 7, 1,  1, 7, 5,  7, 6, 4,  7, 4, 5,  4, 0, 1,  4, 1, 5,  6, 7, 2,  2, 7, 3 ]);

    let vertexColors3 = new Float32Array([
        1.0, 0.0, 0.0, //front upper left 0
        0.0, 1.0, 0.0, //front upper right 1
        0.0, 0.0, 1.0, //front lower left 2
        1.0, 1.0, 0.0, //front lower right 3
        1.0, 0.0, 0.0, //back upper left 4
        0.0, 1.0, 0.0, //back upper right 5
        0.0, 0.0, 1.0, //back lower left 6
        1.0, 1.0, 0.0  //back lower right 7
    ]);

    //create buffers 
    let vertexBuffer3 = gl.createBuffer(); //create buffer object in webgl
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, vertices3, gl.STATIC_DRAW); //put vertices data into buffer object 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertexColorBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors3, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer3 = gl.createBuffer(); 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices3, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //Step 5 : prepare shaders 
    let vertexShader3 = null;
    let fragmentShader3 = null;
    let shaderProgram3 = null;
     
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
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices1.BYTES_PER_ELEMENT * 3, 0); 
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
            let color = gl.getAttribLocation(shaderProgram, 'aColor');
            gl.enableVertexAttribArray(color);
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors1.BYTES_PER_ELEMENT * 3, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?
        })
        .then(() => {
            return loadFileFromServer('shaders/vertex.vert')  
        })
        .then(source => {
            console.log('step 4 done');
            vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader2, source);
            gl.compileShader(vertexShader2);
            console.log(gl.getShaderInfoLog(vertexShader2)); // for debugging
            return loadFileFromServer('shaders/fragment.frag');
        })
        .then(fragmentShaderSource => {
            // handle the next shader/thing
            console.log('step 5 done');
            fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader2, fragmentShaderSource);
            gl.compileShader(fragmentShader2);
        })
        .then(() => {
            console.log('step 6 done');
            shaderProgram2 = gl.createProgram();
            gl.attachShader(shaderProgram2, vertexShader2);
            gl.attachShader(shaderProgram2, fragmentShader2);
            gl.linkProgram(shaderProgram2);
            gl.useProgram(shaderProgram2); //set webgl state to use this shader program

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
            let position = gl.getAttribLocation(shaderProgram2, 'aPosition');
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices2.BYTES_PER_ELEMENT * 3, 0); //vertices.BYTES = stride 
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer2);
            let color = gl.getAttribLocation(shaderProgram2, 'aColor');
            gl.enableVertexAttribArray(color);
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors2.BYTES_PER_ELEMENT * 3, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?
        })
        .then(() => {
            return loadFileFromServer('shaders/vertex.vert');  
        })
        .then(source => {
            console.log('step 7 done');
            vertexShader3 = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader3, source);
            gl.compileShader(vertexShader3);
            console.log(gl.getShaderInfoLog(vertexShader3)); // for debugging
            return loadFileFromServer('shaders/fragment.frag');
        })
        .then(fragmentShaderSource => {
            // handle the next shader/thing
            console.log('step 8 done');
            fragmentShader3 = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader3, fragmentShaderSource);
            gl.compileShader(fragmentShader3);
        })
        .then(() => {
            console.log('step 9 done');
            shaderProgram3 = gl.createProgram();
            gl.attachShader(shaderProgram3, vertexShader3);
            gl.attachShader(shaderProgram3, fragmentShader3);
            gl.linkProgram(shaderProgram3);
            gl.useProgram(shaderProgram3); //set webgl state to use this shader program

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer3);
            let position = gl.getAttribLocation(shaderProgram3, 'aPosition');
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices3.BYTES_PER_ELEMENT * 3, 0); //vertices.BYTES = stride 
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer3);
            let color = gl.getAttribLocation(shaderProgram3, 'aColor');
            gl.enableVertexAttribArray(color);
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors3.BYTES_PER_ELEMENT * 3, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null); //unbind?
        })
        .then(() => {
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
        // if(shaderProgram == null || shaderProgram == undefined){
        //     return;
        // }

        const translateRight =    [
            1, 0, 0, 5,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        const translateLeft =    [
            1, 0, 0, -5,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        let rotateYZ = [
            1, 0, 0, 0,
            0, Math.cos(r), Math.sin(r), 0,
            0, -Math.sin(r), Math.cos(r), 0,
            0, 0, 0, 1,
        ];
  
        let rotateXZ = [
            Math.cos(s), 0, Math.sin(s), 0,
            0, 1, 0, 0,
            -Math.sin(s), 0, Math.cos(s), 0,
            0, 0, 0, 1
        ]

        const modelTetra = multiplyMatrix4x4(translateRight, rotateXZ);

        const modelOcta = multiplyMatrix4x4(translateLeft, rotateXZ);

        //const modelCube = multiplyMatrix4x4(rotateYZ, rotateXZ);
        const modelCube = multiplyMatrix4x4(rotateYZ, rotateXZ);
       
        //tetra
        gl.useProgram(shaderProgram);
        //console.log(shaderProgram);
        let locationM = gl.getUniformLocation(shaderProgram, 'model');
        let locationV = gl.getUniformLocation(shaderProgram, 'view');
        let locationP = gl.getUniformLocation(shaderProgram, 'projection');
        gl.uniformMatrix4fv(locationM, false, transposeMatrix4x4(modelTetra)); //set to different model
        gl.uniformMatrix4fv(locationV, false, transposeMatrix4x4(view));
        gl.uniformMatrix4fv(locationP, false, transposeMatrix4x4(perspectiveProj));

        //octa
        gl.useProgram(shaderProgram2);
        let locationM2 = gl.getUniformLocation(shaderProgram2, 'model');
        let locationV2 = gl.getUniformLocation(shaderProgram2, 'view');
        let locationP2 = gl.getUniformLocation(shaderProgram2, 'projection');
        gl.uniformMatrix4fv(locationM2, false, transposeMatrix4x4(modelOcta));
        gl.uniformMatrix4fv(locationV2, false, transposeMatrix4x4(view));
        gl.uniformMatrix4fv(locationP2, false, transposeMatrix4x4(perspectiveProj));

        //cube
        gl.useProgram(shaderProgram3);
        let locationM3 = gl.getUniformLocation(shaderProgram3, 'model');
        let locationV3 = gl.getUniformLocation(shaderProgram3, 'view');
        let locationP3 = gl.getUniformLocation(shaderProgram3, 'projection');
        gl.uniformMatrix4fv(locationM3, false, transposeMatrix4x4(modelCube));
        gl.uniformMatrix4fv(locationV3, false, transposeMatrix4x4(view));
        gl.uniformMatrix4fv(locationP3, false, transposeMatrix4x4(perspectiveProj));

        r += 0.01;
        s += 0.01;
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        // if(shaderProgram == null){
        //     return;
        // }

        gl.clearColor(
            0.3921568627450980392156862745098,
            0.58431372549019607843137254901961,
            0.92941176470588235294117647058824,
            1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //draw tetrahedron
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);
        console.log(indices1.length);

        //draw octohedron
        gl.useProgram(shaderProgram2); 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
        gl.drawElements(gl.TRIANGLES, indices2.length, gl.UNSIGNED_SHORT, 0);   

        //draw cube
        gl.useProgram(shaderProgram3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer3);
        gl.drawElements(gl.TRIANGLES, indices3.length, gl.UNSIGNED_SHORT, 0);   
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
   

}());
