#version 100
precision mediump float;
varying vec2 tc;
uniform sampler2D rgba;

void main() {
   gl_FragColor = texture2D(rgba, tc);
}
