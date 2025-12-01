.PHONY: all server wasm clean parquet2json data.json

# Build the HTTP server
server:
	go build -o server .

# Build the parquet to JSON converter
parquet2json:
	go build -o parquet2json ./cmd/parquet2json

# Convert parquet data to JSON for WASM embedding
data.json: parquet2json
	./parquet2json ./data ./wasm/data.json

# Build the WASM module (requires data.json to exist)
wasm: data.json
	GOOS=js GOARCH=wasm go build -o ../server.wasm ./wasm

# Copy wasm_exec.js from Go installation
wasm-exec:
	cp "$$(go env GOROOT)/lib/wasm/wasm_exec.js" ../wasm_exec.js

# Build everything for static deployment
static: wasm wasm-exec
	@echo "Built server.wasm and wasm_exec.js in parent directory"

# Build all
all: server

clean:
	rm -f server parquet2json wasm/data.json ../server.wasm ../wasm_exec.js
