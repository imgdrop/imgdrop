#version 100
attribute vec2 v;
varying vec2 tc;

void main() {
   tc = v;
   gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}
