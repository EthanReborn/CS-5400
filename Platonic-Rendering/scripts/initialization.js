
let vertices = [];
let indices = [];

//vertex buffer 
let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//enable position and color attribute on shader class
let position = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 3, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
let color = gl.getAttribLocation(shaderProgram, 'aColor');
gl.enableVertexAttribArray(color);
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, vertexColors.BYTES_PER_ELEMENT * 3, 0);
//-----------------

gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

//index buffer 
let indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

//prepare vertex shader 
let vertexShaderSource = '...'; // string of the vertex shader code
let vertexShader = gl.createShader(gl.VERTEX_SHADER); //get vertex shader object from gl 
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
console.log(gl.getShaderInfoLog(vertexShader)); // for debugging

//prepare fragment shader
let fragmentShaderSource = '...'; // string of the fragment shader code
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

//create shader program
let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader); //attach vertex and fragment shader 
gl.attachShader(shaderProgram, fragmentShader);
//link and use
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

//shader connects array buffer before draw call 

//clear frame buffer 
gl.clearColor(
    0.3921568627450980392156862745098,
    0.58431372549019607843137254901961,
    0.92941176470588235294117647058824,
    1.0);
    gl.clearDepth(1.0);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//draw primitives -first bind to index buffer
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0);

