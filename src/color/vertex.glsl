// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

#version 100
attribute vec2 v;
varying vec2 tc;

void main() {
   tc = v;
   gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}
