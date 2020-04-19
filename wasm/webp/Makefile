SRC_MAKE = src/Makefile
SRC_CD = cd src &&

all: $(SRC_MAKE)
	$(SRC_CD) $(MAKE)
	emcc -o index.js src/src/.libs/libwebp.a main.c --pre-js pre.js \
		-Oz \
		-s EXPORTED_RUNTIME_METHODS=[cwrap] \
		-s MODULARIZE \
		-s ENVIRONMENT=web

$(SRC_MAKE):
	$(SRC_CD) ./autogen.sh
	$(SRC_CD) emconfigure ./configure \
		--disable-shared \
		--disable-libwebpdemux \
		--disable-sdl \
		CFLAGS=-Oz
	$(SRC_CD) rm a.out*

clean:
	$(SRC_CD) git clean -fdX
	rm index.js

.PHONY: all clean
