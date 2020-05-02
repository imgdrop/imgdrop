#version 100
precision mediump float;
varying vec2 tc;
uniform sampler2D red;
uniform sampler2D green;
uniform sampler2D blue;
uniform sampler2D alpha;

void main() {
   gl_FragColor = vec4(
      texture2D(red, tc).r,
      texture2D(green, tc).r,
      texture2D(blue, tc).r,
      texture2D(alpha, tc).r
   );
}
