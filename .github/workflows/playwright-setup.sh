#!/bin/sh
set -e
apt-get update
apt-get install -y \
   libwoff1 \
   libopus0 \
   libwebp6 \
   libwebpdemux2 \
   libenchant1c2a \
   libgudev-1.0-0 \
   libsecret-1-0 \
   libhyphen0 \
   libgdk-pixbuf2.0-0 \
   libegl1 \
   libnotify4 \
   libxslt1.1 \
   libevent-2.1-6 \
   libgles2 \
   libvpx5 \
   libnss3 \
   libxss1 \
   libasound2 \
   libdbus-glib-1-2 \
   libxt6 \
   ffmpeg
