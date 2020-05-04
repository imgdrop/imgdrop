include ../util.mk

RAW_MAKE = build/Makefile
RAW_CD = cd build &&

all: $(RAW_MAKE)
	$(RAW_CD) $(MAKE)
	emcc -o raw.js build/lib/.libs/libraw.a raw.c $(LDFLAGS) \
		-s FORCE_FILESYSTEM

$(RAW_MAKE):
	cp -r libraw build
	$(RAW_CD) autoreconf -fi
	$(RAW_CD) emconfigure ./configure \
		CFLAGS='$(CFLAGS)' \
		--disable-shared \
		--disable-examples

clean:
	rm -r build raw.js raw.wasm

ci: all
	git submodule deinit libraw
	rm -r build

.PHONY: all clean ci
