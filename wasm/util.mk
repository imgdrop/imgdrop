CFLAGS = -Oz -flto
LDFLAGS = \
	--pre-js ../pre.js\
	-lworkerfs.js \
	-Oz --closure 1 \
	-flto --llvm-lto 3 \
	-s MODULARIZE \
	-s ALLOW_MEMORY_GROWTH \
	-s ENVIRONMENT=worker
