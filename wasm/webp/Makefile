SRC_MAKE = src/Makefile
SRC_CD = cd src &&

all: $(SRC_MAKE)
	$(SRC_CD) $(MAKE)
	emcc -o webp.js src/src/.libs/libwebp.a webp.c \
		-Oz \
		-s EXPORTED_FUNCTIONS=[_malloc] \
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
	rm webp.js webp.wasm

.PHONY: all clean
