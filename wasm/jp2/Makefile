include ../util.mk

JP2_MAKE = build/Makefile

all: $(JP2_MAKE)
	$(MAKE) -C build
	emcc -o jp2.js build/bin/libopenjp2.a jp2.c $(LDFLAGS) \
		-Ibuild/src/lib/openjp2

$(JP2_MAKE):
	emcmake cmake -B build -S openjpeg \
		-DBUILD_CODEC=OFF \
		-DBUILD_PKGCONFIG_FILES=OFF \
		-DBUILD_SHARED_LIBS=OFF \
		-DCMAKE_BUILD_TYPE=Release \
		-DCMAKE_C_FLAGS_RELEASE='$(CFLAGS)' \
		-DOPJ_USE_THREAD=OFF \
		-DHAVE_OPJ_BIG_ENDIAN=ON

clean:
	rm -r build jp2.js jp2.wasm

ci: all
	git submodule deinit openjpeg
	rm -r build

.PHONY: all clean ci
