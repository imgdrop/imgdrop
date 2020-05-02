include ../util.mk

JP2_MAKE = build/Makefile

all: $(JP2_MAKE)
	$(MAKE) -C build
	emcc -o jp2.js build/bin/libopenjp2.a jp2.c $(LDFLAGS) \
		-s FORCE_FILESYSTEM

$(JP2_MAKE):
	emcmake cmake -B build -S openjpeg -LAH \
		-DBUILD_CODEC=OFF \
		-DBUILD_PKGCONFIG_FILES=OFF \
		-DBUILD_SHARED_LIBS=OFF \
		-DCMAKE_BUILD_TYPE=Release \
		-DCMAKE_C_FLAGS_RELEASE='$(CFLAGS)' \
		-DOPJ_USE_THREAD=OFF \
		-DHAVE_OPJ_BIG_ENDIAN=ON

clean:
	rm -r build jp2.js jp2.wasm

.PHONY: all clean
