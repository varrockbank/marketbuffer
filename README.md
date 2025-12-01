This project is a financial terminal for quantitative finance.

The goal is for a command center to R&D and monitor algo trades. 
Ideally, the interface is no-interface where an AI agent does everything.
In the interim, the interface is like a desktop environment with various applications.

# Architecture

The application is structured as a desktopment environment with various apps 
that can be launched. Apps are implemented as self-contained JavaScript modules
with access to some core "operating system" APIs. This surface is in flux and not thought
about extensively yet.

# Stock Server

There is a server written in Go which serves data about stocks.
Currently, this is limited to OLHC.

The data is Parquet files generated from the ELT pipeline implemented at:
https://github.com/varrockbank/equityzukan

## Setup

### Stock Server Data

The server expects parquet data in `server/data/`. You must populate this yourself:

```bash
cd server
ln -s /path/to/your/equity_table_extended data
```

Or copy your parquet files directly into `server/data/`.

### Running the Server (Development)

```bash
cd server
go build -o server
./server
```

The server runs on http://localhost:8080 by default.

### Building for Static Deployment (WASM)

For static hosting without a backend server, build the WASM module:

```bash
cd server
make static
```

This generates:
- `server.wasm` - WebAssembly module with embedded stock data
- `wasm_exec.js` - Go WASM runtime

Then set `USE_WASM: true` in `server-service.js` to use the WASM module instead of HTTP endpoints.
