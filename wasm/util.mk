CFLAGS = -Oz
LDFLAGS = \
	--pre-js ../pre.js -lworkerfs.js \
	-Oz --closure 1 \
	-DNDEBUG \
	-s MODULARIZE \
	-s ALLOW_MEMORY_GROWTH \
	-s ENVIRONMENT=worker

GIT_CLEAN = git clean -fdX
GIT_DEINIT = git submodule deinit -f
