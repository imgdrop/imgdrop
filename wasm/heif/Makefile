include ../util.mk

PWD = $(shell pwd)
H265_MAKE = libde265/Makefile
H265_CD = cd libde265 &&
H265_BIN = libde265/libde265/.libs/libde265.a
HEIF_MAKE = libheif/Makefile
HEIF_CD = cd libheif &&

all: $(H265_MAKE) $(HEIF_MAKE)
	$(H265_CD) $(MAKE)
	$(HEIF_CD) $(MAKE)

$(H265_MAKE):
	$(H265_CD) ./autogen.sh
	$(H265_CD) emconfigure ./configure \
		CFLAGS='$(CFLAGS)' \
		CXXFLAGS='$(CFLAGS)' \
		--disable-shared \
		--disable-encoder \
		--disable-sse \
		--disable-dec265
	$(H265_CD) rm a.out*

$(HEIF_MAKE):
	$(HEIF_CD) ./autogen.sh
	$(HEIF_CD) emconfigure ./configure \
		CFLAGS='$(CFLAGS)' \
		CXXFLAGS='$(CXXFLAGS)' \
		libde265_CFLAGS='-I$(PWD)/libde265' \
		libde265_LIBS='$(PWD)/$(H265_BIN)' \
		--disable-shared \
		--disable-go \
		--disable-examples \
		--disable-multithreading
	$(HEIF_CD) rm a.out*

clean:
	$(H265_CD) $(GIT_CLEAN)
	$(HEIF_CD) $(GIT_CLEAN)
	rm heif.js heif.wasm

ci: all
	$(GIT_DEINIT) libde265
	$(GIT_DEINIT) libheif

.PHONY: all clean ci
