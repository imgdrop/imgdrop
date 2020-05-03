#version 100
precision mediump float;
varying vec2 tc;
uniform sampler2D gray;
uniform sampler2D alpha;

void main() {
   gl_FragColor = vec4(
      texture2D(gray, tc).rgb,
      texture2D(alpha, tc).r
   );
}
