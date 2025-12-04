// Server Service - Abstraction layer for API calls
// Switches between HTTP server and WASM based on USE_WASM flag

const ServerService = {
  // Set to true to use WASM, false to use HTTP server
  USE_WASM: true,

  // WASM module ready state
  wasmReady: false,

  async init() {
    if (this.USE_WASM) {
      await this.initWasm();
    }
  },

  async initWasm() {
    if (this.wasmReady) return;

    try {
      const go = new Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch('server.wasm'),
        go.importObject,
      );
      // Start the Go runtime (don't await - it blocks forever)
      go.run(result.instance);

      // Wait for functions to be registered
      await new Promise((resolve) => {
        const check = () => {
          if (typeof window.getTickers === 'function' && typeof window.getOHLC === 'function' && typeof window.getDaily === 'function') {
            resolve();
          } else {
            setTimeout(check, 10);
          }
        };
        check();
      });

      this.wasmReady = true;
      console.log('[ServerService] WASM module loaded');
    } catch (e) {
      console.error('[ServerService] Failed to load WASM:', e);
      throw e;
    }
  },

  async getTickers() {
    if (this.USE_WASM) {
      await this.initWasm();
      // WASM exposes getTickers() globally
      const result = window.getTickers();
      return JSON.parse(result);
    } else {
      const response = await fetch('/api/tickers');
      if (!response.ok) throw new Error('Failed to fetch tickers');
      return response.json();
    }
  },

  async getOHLC(ticker, year, windowParam) {
    if (this.USE_WASM) {
      await this.initWasm();
      // WASM exposes getOHLC(ticker, year, window) globally
      console.log('[ServerService] getOHLC called, window.getOHLC:', typeof window.getOHLC);
      const result = window.getOHLC(ticker, year, windowParam);
      return JSON.parse(result);
    } else {
      const response = await fetch(`/api/ohlc?ticker=${ticker}&year=${year}&window=${windowParam}`);
      if (!response.ok) throw new Error('Failed to fetch OHLC data');
      return response.json();
    }
  },

  async getDaily(ticker, year, month) {
    if (this.USE_WASM) {
      await this.initWasm();
      const result = window.getDaily(ticker, year, month);
      return JSON.parse(result);
    } else {
      const response = await fetch(`/api/daily?ticker=${ticker}&year=${year}&month=${month}`);
      if (!response.ok) throw new Error('Failed to fetch daily data');
      return response.json();
    }
  },
};
