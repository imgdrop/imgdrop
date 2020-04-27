include ../util.mk

WEBP_MAKE = libwebp/Makefile
WEBP_CD = cd libwebp &&

all: $(WEBP_MAKE)
	$(WEBP_CD) $(MAKE)
	emcc -o webp.js libwebp/src/.libs/libwebp.a webp.c $(LDFLAGS)

$(WEBP_MAKE):
	$(WEBP_CD) ./autogen.sh
	$(WEBP_CD) emconfigure ./configure \
		CFLAGS='$(CFLAGS)' \
		--disable-shared \
		--disable-threading \
		--disable-sdl \
		--disable-libwebpdemux
	$(WEBP_CD) rm a.out*

clean:
	$(WEBP_CD) git clean -fdX
	rm webp.js webp.wasm
