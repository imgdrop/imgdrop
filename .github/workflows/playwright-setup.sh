#!/bin/sh
set -e
apt-get update
apt-get install -y \
   libwoff1 \
   libopus0 \
   libwebpdemux2 \
   libgudev-1.0-0 \
   libhyphen0 \
   libegl1 \
   libgles2 \
   libasound2 \
   ffmpeg
