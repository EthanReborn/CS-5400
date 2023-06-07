#version 300 es

in vec4 aPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 model; 
uniform mat4 view; 
uniform mat4 projection; 

void main()
{
    gl_Position = projection * view * model * aPosition;
    vColor = aColor;
}