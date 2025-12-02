// Alpaca Market Data Provider
// Fetches real-time/delayed intraday stock data from Alpaca API
// Free tier: 200 requests/min, 15-min delayed data, up to 10,000 bars per request

const AlpacaProvider = {
  // API configuration
  baseUrl: 'https://data.alpaca.markets/v2',

  // API credentials - users need to set these
  // Get free API keys at: https://app.alpaca.markets/signup
  apiKey: null,
  apiSecret: null,

  // Configure API credentials
  configure(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  },

  // Check if configured
  isConfigured() {
    return this.apiKey && this.apiSecret;
  },

  // Get authorization headers
  getHeaders() {
    return {
      'APCA-API-KEY-ID': this.apiKey,
      'APCA-API-SECRET-KEY': this.apiSecret,
    };
  },

  // Format date to RFC3339 format for Alpaca API
  formatDate(date) {
    return date.toISOString();
  },

  // Get today's market open time (9:30 AM ET)
  getTodayMarketOpen() {
    const now = new Date();
    // Create date in ET timezone
    const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    etDate.setHours(9, 30, 0, 0);

    // Convert back to UTC for API
    const etOffset = this.getETOffset(now);
    const utcDate = new Date(etDate.getTime() + etOffset * 60 * 60 * 1000);
    return utcDate;
  },

  // Get today's market close time (4:00 PM ET)
  getTodayMarketClose() {
    const now = new Date();
    const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    etDate.setHours(16, 0, 0, 0);

    const etOffset = this.getETOffset(now);
    const utcDate = new Date(etDate.getTime() + etOffset * 60 * 60 * 1000);
    return utcDate;
  },

  // Get ET offset from UTC (handles DST)
  getETOffset(date) {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    const isDST = date.getTimezoneOffset() < stdOffset;
    return isDST ? 4 : 5; // EDT = UTC-4, EST = UTC-5
  },

  // Fetch intraday bars for a symbol
  // timeframe: '1Min', '5Min', '15Min', '1Hour', '1Day'
  async getBars(symbol, timeframe = '1Min', start = null, end = null, limit = 1000) {
    if (!this.isConfigured()) {
      throw new Error('Alpaca API not configured. Call AlpacaProvider.configure(apiKey, apiSecret) first.');
    }

    // Default to today's trading session
    if (!start) {
      start = this.getTodayMarketOpen();
    }
    if (!end) {
      end = new Date(); // Now
    }

    const params = new URLSearchParams({
      timeframe: timeframe,
      start: this.formatDate(start),
      end: this.formatDate(end),
      limit: limit.toString(),
      adjustment: 'split', // Adjust for stock splits
      feed: 'iex', // Use IEX feed for free tier
    });

    const url = `${this.baseUrl}/stocks/${symbol}/bars?${params}`;

    console.log('[AlpacaProvider] Fetching:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AlpacaProvider] API Error:', response.status, errorText);
        throw new Error(`Alpaca API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[AlpacaProvider] Got data:', data);

      // Transform Alpaca format to our OHLC format
      return this.transformBars(data.bars || [], symbol);
    } catch (error) {
      console.error('[AlpacaProvider] Fetch error:', error);
      throw error;
    }
  },

  // Transform Alpaca bars to our standard OHLC format
  // Alpaca format: { t, o, h, l, c, v, n, vw }
  // Our format: { period, open, high, low, close, volume }
  transformBars(bars, symbol) {
    return {
      ticker: symbol,
      data: bars.map(bar => {
        const date = new Date(bar.t);
        // Format time as HH:MM for intraday
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return {
          period: `${hours}:${minutes}`,
          timestamp: bar.t,
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
          volume: bar.v,
          vwap: bar.vw, // Volume-weighted average price
          tradeCount: bar.n,
        };
      }),
    };
  },

  // Get today's 1-minute bars for a symbol
  async getTodayBars(symbol) {
    return this.getBars(symbol, '1Min', null, null, 1000);
  },

  // Get latest bar for a symbol
  async getLatestBar(symbol) {
    if (!this.isConfigured()) {
      throw new Error('Alpaca API not configured.');
    }

    const url = `${this.baseUrl}/stocks/${symbol}/bars/latest?feed=iex`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Alpaca API error: ${response.status}`);
      }

      const data = await response.json();
      return data.bar;
    } catch (error) {
      console.error('[AlpacaProvider] Latest bar error:', error);
      throw error;
    }
  },

  // Check if market is currently open
  isMarketOpen() {
    const now = new Date();
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = etNow.getDay();
    const hours = etNow.getHours();
    const minutes = etNow.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // Market is open Mon-Fri, 9:30 AM - 4:00 PM ET
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 16 * 60; // 4:00 PM

    const isWeekday = day >= 1 && day <= 5;
    const isDuringHours = timeInMinutes >= marketOpen && timeInMinutes < marketClose;

    return isWeekday && isDuringHours;
  },

  // Get market status message
  getMarketStatus() {
    if (this.isMarketOpen()) {
      return '☀️ Market Open';
    }

    const now = new Date();
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = etNow.getDay();
    const hours = etNow.getHours();
    const minutes = etNow.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const marketOpen = 9 * 60 + 30;
    const marketClose = 16 * 60;

    if (day === 0 || day === 6) {
      return '🌙 Market Closed (Weekend)';
    } else if (timeInMinutes < marketOpen) {
      return '🌙 Market Closed (Pre-market)';
    } else if (timeInMinutes >= marketClose) {
      return '🌙 Market Closed (After-hours)';
    }
    return '🌙 Market Closed';
  },
};
