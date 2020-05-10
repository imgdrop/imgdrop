// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

#version 100
precision mediump float;
varying vec2 tc;
uniform sampler2D rgba;

void main() {
   gl_FragColor = texture2D(rgba, tc);
}
