SRC_OBJS = \
	bin/src/libraw_cxx.o \
	bin/src/libraw_c_api.o \
	bin/src/libraw_datastream.o \
	bin/internal/dcraw_common.o \
	bin/internal/dcraw_fileio.o \
	bin/internal/demosaic_packs.o

all: $(SRC_OBJS)
	emcc -o bin/raw.o -c raw.c -MMD -MP -Oz
	em++ -o raw.js $(SRC_OBJS) bin/raw.o \
		-Oz \
		-s EXPORTED_FUNCTIONS=[_malloc] \
		-s MODULARIZE \
		-s ENVIRONMENT=web

-include $(SRC_OBJS:.o=.d)
bin/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	em++ -o $@ -c $< -MMD -MP -Isrc -Oz

clean:
	rm -r bin raw.js raw.wasm

.PHONY: all clean
