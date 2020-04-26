CFLAGS = -Oz -DIMGDROP_FILENAME='/wfs/input'
LDFLAGS = \
	-lworkerfs.js \
	-Oz --closure 1 \
	-s ENVIRONMENT=worker \
	-s EXPORTED_RUNTIME_METHODS=[FS] \
	-s ALLOW_MEMORY_GROWTH
