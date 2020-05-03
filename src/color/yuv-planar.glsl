#version 100
precision mediump float;
varying vec2 tc;
uniform sampler2D y;
uniform sampler2D cb;
uniform sampler2D cr;
uniform sampler2D alpha;

void main() {
   gl_FragColor = vec4(
      mat3(
         // BT.709
         // 1.0,      1.0,     1.0,
         // 0.0,     -0.21482, 2.12798,
         // 1.28033, -0.38059, 0.0
         // JPEG-2000 sYCC
          1.0,           1.00003,   0.999823,
         -0.0000368213, -0.344125,  1.77204,
          1.40199,      -0.714128, -0.00000804142
      ) * vec3(
         texture2D(y, tc).r,
         texture2D(cb, tc).r - 0.5,
         texture2D(cr, tc).r - 0.5
      ),
      texture2D(alpha, tc).r
   );
}
