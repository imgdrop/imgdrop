#version 100
attribute vec2 pos;
varying vec2 texcoord;

void main() {
   texcoord = pos;
   gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
