// Stocks App Card - Self-contained application module
const stocksCard = {
  id: 'stocks',
  title: 'Stocks',
  draggable: true,
  closeable: true,
  zIndex: 105,
  top: 100,
  left: 100,
  width: 450,
  contextMenu: [
    { label: 'Close', action: 'close' },
  ],

  // State
  tickers: [], // Available tickers for historical data
  loadingTickers: false,
  selectedTicker: '', // Historical ticker
  liveTicker: '', // Live ticker (persists when switching tabs)
  selectedYear: 2024,
  selectedWindow: 'monthly',
  viewMode: 'historical', // 'historical' or 'today'
  ohlcData: null,
  intradayData: null,
  loading: false,
  error: null,
  alpacaConfigured: false, // Whether Alpaca API is configured
  scrollPosition: 0, // Track scroll position for dynamic scaling
  candleSize: '1m', // '1m', '5m', '15m', '30m', '60m' for candle aggregation
  zoomLevel: 1, // Zoom multiplier for viewport (0.5 = zoomed out, 2 = zoomed in)

  // Helper to get stock "path" for pinning (e.g., "AAPL.stock")
  getStockPath(ticker) {
    return `${ticker}.stock`;
  },

  // Check if a stock is being watched (pinned)
  isWatching(ticker) {
    if (typeof OS === 'undefined') return false;
    return OS.isPinned(this.getStockPath(ticker));
  },

  // Toggle watch status for a stock
  toggleWatch(ticker) {
    if (typeof OS !== 'undefined') {
      OS.togglePinFile(this.getStockPath(ticker));
      this.rerender();
    }
  },

  // Aggregate 1-minute data into N-minute buckets
  aggregateToMinutes(data, intervalMinutes) {
    if (!data || data.length === 0) return [];
    const buckets = [];
    let currentBucket = null;

    for (const bar of data) {
      // Parse time to get the bucket
      const timeParts = bar.period.split(':');
      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1]);
      const totalMinutes = hour * 60 + minute;
      const bucketStart = Math.floor(totalMinutes / intervalMinutes) * intervalMinutes;
      const bucketHour = Math.floor(bucketStart / 60);
      const bucketMinute = bucketStart % 60;
      const bucketKey = `${bucketHour}:${bucketMinute.toString().padStart(2, '0')}`;

      if (!currentBucket || currentBucket.period !== bucketKey) {
        // Start a new bucket
        if (currentBucket) buckets.push(currentBucket);
        currentBucket = {
          period: bucketKey,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume,
        };
      } else {
        // Update current bucket
        currentBucket.high = Math.max(currentBucket.high, bar.high);
        currentBucket.low = Math.min(currentBucket.low, bar.low);
        currentBucket.close = bar.close;
        currentBucket.volume += bar.volume;
      }
    }
    if (currentBucket) buckets.push(currentBucket);
    return buckets;
  },

  // Helper to render chart for given data
  renderChart(data, ticker, isIntraday) {
    const state = stocksCard;
    const viewportWidth = 420;
    const chartHeight = 200;
    const padding = { top: 20, right: 50, bottom: 30, left: 10 };

    // For intraday, apply zoom level relative to candle size
    // Larger candle sizes get proportionally more base spacing
    const candleSizeMultiplier = { '1m': 1, '5m': 1.5, '15m': 2, '30m': 2.5, '60m': 3 };
    const baseSpacing = 12 * (candleSizeMultiplier[state.candleSize] || 1);
    const zoomMultiplier = state.zoomLevel || 1;
    const minCandleSpacing = isIntraday ? baseSpacing * zoomMultiplier : 0;
    const calculatedWidth = isIntraday
      ? Math.max(viewportWidth, data.length * minCandleSpacing + padding.left + padding.right)
      : viewportWidth;
    const chartWidth = calculatedWidth;
    const needsScroll = chartWidth > viewportWidth;

    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    const candleSpacing = innerWidth / data.length;

    // Calculate visible data range based on scroll position
    let visibleStartIndex = 0;
    let visibleEndIndex = data.length - 1;
    if (needsScroll) {
      const scrollPos = state.scrollPosition || 0;
      visibleStartIndex = Math.max(0, Math.floor((scrollPos - padding.left) / candleSpacing));
      visibleEndIndex = Math.min(data.length - 1, Math.ceil((scrollPos + viewportWidth - padding.left) / candleSpacing));
    }

    // Calculate price range based on visible data only
    const visibleData = data.slice(visibleStartIndex, visibleEndIndex + 1);
    const visiblePrices = visibleData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...visiblePrices);
    const maxPrice = Math.max(...visiblePrices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1 || 1;
    const yMin = minPrice - pricePadding;
    const yMax = maxPrice + pricePadding;

    // Scale functions
    const xScale = (i) => padding.left + (i + 0.5) * candleSpacing;
    const yScale = (price) => padding.top + innerHeight - ((price - yMin) / (yMax - yMin)) * innerHeight;

    const candleWidth = Math.max(4, Math.min(20, candleSpacing * 0.6));

    // Build candlesticks with hover areas
    const hoverWidth = innerWidth / data.length;
    const candles = data.map((d, i) => {
      const x = xScale(i);
      const isUp = d.close >= d.open;
      const color = isUp ? '#00c853' : '#ff1744';
      const bodyTop = yScale(Math.max(d.open, d.close));
      const bodyBottom = yScale(Math.min(d.open, d.close));
      const bodyHeight = Math.max(1, bodyBottom - bodyTop);

      const dataAttrs = `data-period="${d.period}" data-open="${d.open.toFixed(2)}" data-high="${d.high.toFixed(2)}" data-low="${d.low.toFixed(2)}" data-close="${d.close.toFixed(2)}" data-volume="${(d.volume / 1000000).toFixed(1)}"`;

      return `
        <g class="stock-candle" ${dataAttrs}>
          <rect x="${x - hoverWidth/2}" y="${padding.top}" width="${hoverWidth}" height="${innerHeight}" fill="transparent" class="stock-candle-hover"/>
          <line x1="${x}" y1="${yScale(d.high)}" x2="${x}" y2="${yScale(d.low)}" stroke="${color}" stroke-width="1"/>
          <rect x="${x - candleWidth/2}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" stroke="${color}"/>
        </g>
      `;
    }).join('');

    // X-axis labels
    const labelInterval = isIntraday ? 10 : 1;
    const xLabels = data.map((d, i) => {
      if (isIntraday && i % labelInterval !== 0) return '';
      const x = xScale(i);
      return `<text x="${x}" y="${chartHeight - 8}" text-anchor="middle" class="stock-chart-label">${d.period}</text>`;
    }).join('');

    // Y-axis grid lines and price labels
    const yTicks = 5;
    const yGridLines = Array.from({ length: yTicks }, (_, i) => {
      const price = yMin + (yMax - yMin) * (i / (yTicks - 1));
      const y = yScale(price);
      return `<line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="var(--window-border)" stroke-width="0.5" stroke-dasharray="2,2"/>`;
    }).join('');

    const formatPrice = (price) => {
      if (priceRange < 1) return price.toFixed(2);
      if (priceRange < 10) return price.toFixed(1);
      return price.toFixed(0);
    };

    const priceLabels = Array.from({ length: yTicks }, (_, i) => {
      const price = yMin + (yMax - yMin) * (i / (yTicks - 1));
      const topOffset = padding.top + (innerHeight * (1 - i / (yTicks - 1)));
      return `<div class="stock-price-label" style="top: ${topOffset}px;">${formatPrice(price)}</div>`;
    }).join('');

    const yLabels = Array.from({ length: yTicks }, (_, i) => {
      const price = yMin + (yMax - yMin) * (i / (yTicks - 1));
      const y = yScale(price);
      return `
        <line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="var(--window-border)" stroke-width="0.5" stroke-dasharray="2,2"/>
        <text x="${chartWidth - padding.right + 5}" y="${y + 3}" class="stock-chart-label">${formatPrice(price)}</text>
      `;
    }).join('');

    // Current price info
    const latest = data[data.length - 1];
    const first = data[0];
    const change = latest.close - first.open;
    const changePercent = ((change / first.open) * 100).toFixed(2);
    const changeColor = change >= 0 ? '#00c853' : '#ff1744';
    const changeSign = change >= 0 ? '+' : '';

    // Data source message
    let dataSource;
    if (isIntraday) {
      const marketStatus = typeof AlpacaProvider !== 'undefined' ? AlpacaProvider.getMarketStatus() : '';
      dataSource = `Intraday data from Alpaca (15m delay, ET) ${marketStatus}`;
    } else {
      dataSource = ServerService.USE_WASM
        ? 'Historical data from WASM-wrapped Go HTTP server'
        : 'Historical data from HTTP Server';
    }

    return `
      <div class="stock-chart-container">
        <div class="stock-chart-header">
          <span class="stock-chart-ticker">${ticker}</span>
          <span class="stock-chart-price">$${latest.close.toFixed(2)}</span>
          <span class="stock-chart-change" style="color: ${changeColor}">${changeSign}${change.toFixed(2)} (${changeSign}${changePercent}%)</span>
        </div>
        ${isIntraday ? (() => {
          const scrollPos = state.scrollPosition || 0;
          const maxScroll = Math.max(0, chartWidth - viewportWidth);
          const canScrollLeft = scrollPos > 0;
          const canScrollRight = scrollPos < maxScroll;
          return `
          <div class="stock-chart-scroll-container">
            <button class="stock-scroll-btn stock-scroll-left ${!canScrollLeft ? 'hidden' : ''}" id="stock-scroll-left">◀</button>
            <div class="stock-chart-scroll-area">
              <div class="stock-chart-viewport">
                <div class="stock-chart-wrapper">
                  <svg class="stock-chart" viewBox="0 0 ${chartWidth} ${chartHeight}" style="width: ${chartWidth}px;">
                    ${yGridLines}
                    ${candles}
                    ${xLabels}
                  </svg>
                  <div class="stock-tooltip" style="display: none;"></div>
                </div>
              </div>
              <div class="stock-price-overlay">
                ${priceLabels}
              </div>
            </div>
            <button class="stock-scroll-btn stock-scroll-right ${!canScrollRight ? 'hidden' : ''}" id="stock-scroll-right">▶</button>
          </div>
        `;
        })() : `
          <div class="stock-chart-wrapper">
            <svg class="stock-chart" viewBox="0 0 ${chartWidth} ${chartHeight}">
              ${yLabels}
              ${candles}
              ${xLabels}
            </svg>
            <div class="stock-tooltip" style="display: none;"></div>
          </div>
        `}
        ${isIntraday ? `
          <div class="stock-chart-controls">
            <div class="stock-candle-controls">
              <span class="stock-control-label">Candle:</span>
              <button class="stock-candle-btn ${state.candleSize === '1m' ? 'active' : ''}" data-candle="1m">1m</button>
              <button class="stock-candle-btn ${state.candleSize === '5m' ? 'active' : ''}" data-candle="5m">5m</button>
              <button class="stock-candle-btn ${state.candleSize === '15m' ? 'active' : ''}" data-candle="15m">15m</button>
              <button class="stock-candle-btn ${state.candleSize === '30m' ? 'active' : ''}" data-candle="30m">30m</button>
              <button class="stock-candle-btn ${state.candleSize === '60m' ? 'active' : ''}" data-candle="60m">1h</button>
            </div>
            <div class="stock-zoom-control">
              <span class="stock-control-label">Zoom:</span>
              <button class="stock-zoom-btn" id="stock-zoom-out">−</button>
              <button class="stock-zoom-btn" id="stock-zoom-in">+</button>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="stock-data-source">${dataSource}</div>
    `;
  },

  content() {
    const state = stocksCard;

    console.log('[Stock] content() called, state:', {
      error: state.error,
      loadingTickers: state.loadingTickers,
      loading: state.loading,
      ohlcData: state.ohlcData,
      selectedTicker: state.selectedTicker,
    });

    if (state.error) {
      return `
        <div class="stock-content">
          <div class="stock-error">${state.error}</div>
        </div>
      `;
    }

    const alpacaAvailable = typeof AlpacaProvider !== 'undefined' && AlpacaProvider.isConfigured();

    // Build historical panel content
    let historicalContent = '';
    if (state.loading && state.viewMode === 'historical') {
      historicalContent = `
        <div class="stock-loading">
          <div class="stock-spinner"></div>
          <div>Loading...</div>
        </div>
      `;
    } else if (state.ohlcData && state.ohlcData.data && state.ohlcData.data.length > 0) {
      historicalContent = this.renderChart(state.ohlcData.data, state.selectedTicker, false);
    } else if (state.selectedTicker) {
      historicalContent = `<div class="stock-placeholder">No data available</div>`;
    } else {
      historicalContent = `<div class="stock-placeholder">Select a ticker to view data</div>`;
    }

    // Build live panel content
    let liveContent = '';
    if (!alpacaAvailable) {
      liveContent = `
        <div class="stock-api-setup">
          <div class="stock-api-setup-title">Configure Alpaca API</div>
          <div class="stock-api-setup-desc">Live intraday data requires an Alpaca API key (free)</div>
          <div class="stock-api-setup-field">
            <label for="alpaca-api-key">API Key ID</label>
            <input type="text" id="alpaca-api-key" placeholder="PK...">
          </div>
          <div class="stock-api-setup-field">
            <label for="alpaca-api-secret">API Secret Key</label>
            <input type="password" id="alpaca-api-secret" placeholder="Your secret key">
          </div>
          <div class="stock-api-setup-actions">
            <a href="https://app.alpaca.markets/signup" target="_blank" class="stock-api-setup-link">Get free API keys</a>
            <button class="stock-api-setup-btn" id="stock-save-alpaca">Save</button>
          </div>
        </div>
      `;
    } else if (state.loading && state.viewMode === 'today') {
      liveContent = `
        <div class="stock-loading">
          <div class="stock-spinner"></div>
          <div>Loading...</div>
        </div>
      `;
    } else if (state.intradayData && state.intradayData.data && state.intradayData.data.length > 0) {
      // Apply candle size aggregation
      let data = state.intradayData.data;
      if (state.candleSize !== '1m') {
        const intervalMap = { '5m': 5, '15m': 15, '30m': 30, '60m': 60 };
        const interval = intervalMap[state.candleSize];
        if (interval) data = stocksCard.aggregateToMinutes(state.intradayData.data, interval);
      }
      liveContent = this.renderChart(data, state.liveTicker, true);
    } else if (state.liveTicker) {
      liveContent = `<div class="stock-placeholder">No data available</div>`;
    } else {
      liveContent = `<div class="stock-placeholder">Specify a ticker to view data</div>`;
    }

    return `
      <div class="stock-content">
        <div class="stock-tabs">
          <button class="stock-tab ${state.viewMode === 'historical' ? 'active' : ''}" data-tab="historical">Historical</button>
          <button class="stock-tab ${state.viewMode === 'today' ? 'active' : ''}" data-tab="today">Live</button>
        </div>
        <div class="stock-panel-historical ${state.viewMode !== 'historical' ? 'hidden' : ''}">
          <div class="stock-controls">
            <div class="stock-control-group">
              <label class="stock-label">Ticker</label>
              <select class="stock-select" id="stock-ticker-select">
                <option value="">Select ticker...</option>
                ${state.loadingTickers ? '<option value="">Loading...</option>' :
                  state.tickers.map(t => `<option value="${t}" ${state.selectedTicker === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="stock-control-group">
              <label class="stock-label">Year</label>
              <select class="stock-select" id="stock-year-select">
                <option value="2024" selected>2024</option>
                <option value="2023" disabled>2023</option>
                <option value="2022" disabled>2022</option>
              </select>
            </div>
            <div class="stock-control-group">
              <label class="stock-label">Period</label>
              <select class="stock-select" id="stock-window-select">
                <option value="monthly" ${state.selectedWindow === 'monthly' ? 'selected' : ''}>Monthly</option>
                <option value="weekly" disabled>Weekly</option>
                <option value="daily" disabled>Daily</option>
              </select>
            </div>
            ${state.selectedTicker ? `
              <button class="stock-watch-btn ${stocksCard.isWatching(state.selectedTicker) ? 'watching' : ''}" id="stock-watch-btn" data-panel="historical">
                ${stocksCard.isWatching(state.selectedTicker) ? '★ Unwatch' : '☆ Watch'}
              </button>
            ` : ''}
          </div>
          ${historicalContent}
        </div>
        <div class="stock-panel-live ${state.viewMode !== 'today' ? 'hidden' : ''}">
          ${alpacaAvailable ? `
            <div class="stock-controls">
              <div class="stock-control-group">
                <label class="stock-label">Ticker</label>
                <div class="stock-ticker-row">
                  <input type="text" class="stock-input" id="stock-ticker-input" placeholder="AAPL" value="${state.liveTicker}" maxlength="5">
                  <button class="stock-go-btn" id="stock-ticker-go">Go</button>
                </div>
              </div>
              ${state.liveTicker ? `
                <button class="stock-watch-btn ${stocksCard.isWatching(state.liveTicker) ? 'watching' : ''}" id="stock-watch-btn" data-panel="live">
                  ${stocksCard.isWatching(state.liveTicker) ? '★ Unwatch' : '☆ Watch'}
                </button>
              ` : ''}
            </div>
          ` : ''}
          ${liveContent}
        </div>
      </div>
    `;
  },

  styles: `
    .stock-content {
      padding: 12px;
      background: var(--window-bg);
      min-height: 200px;
    }

    .stock-panel-historical.hidden,
    .stock-panel-live.hidden {
      display: none;
    }

    .stock-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--window-border);
    }

    .stock-tab {
      padding: 6px 16px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      border-bottom: none;
      background: var(--sidebar-bg);
      color: var(--text-color);
      cursor: pointer;
      margin-bottom: -1px;
    }

    .stock-tab:first-child {
      border-radius: 3px 0 0 0;
    }

    .stock-tab:last-child {
      border-radius: 0 3px 0 0;
    }

    .stock-tab.active {
      background: var(--window-bg);
      border-bottom: 1px solid var(--window-bg);
    }

    .stock-tab:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .stock-tab:not(:disabled):hover {
      background: var(--hover-bg);
    }

    .stock-tab.active:hover {
      background: var(--window-bg);
    }

    .stock-controls {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .stock-control-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stock-label {
      font-size: 10px;
      font-weight: bold;
    }

    .stock-select {
      padding: 4px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      min-width: 120px;
    }

    .stock-ticker-row {
      display: flex;
      gap: 0;
    }

    .stock-input {
      padding: 4px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      width: 60px;
      text-transform: uppercase;
    }

    .stock-go-btn {
      padding: 4px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      border-left: none;
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
    }

    .stock-go-btn:hover {
      background: var(--hover-bg);
    }

    .stock-select option:disabled {
      color: #999;
    }

    .stock-error {
      color: #c00;
      text-align: center;
      padding: 40px 20px;
      font-size: 12px;
    }

    .stock-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 12px;
      font-size: 11px;
    }

    .stock-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--window-border);
      border-top-color: transparent;
      border-radius: 50%;
      animation: stock-spin 0.8s linear infinite;
    }

    @keyframes stock-spin {
      to { transform: rotate(360deg); }
    }

    .stock-placeholder {
      text-align: center;
      padding: 40px 20px;
      color: #666;
      font-size: 11px;
    }

    .stock-chart-container {
      border: 1px solid var(--window-border);
      background: var(--window-bg);
      padding: 8px;
    }

    .stock-chart-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 8px;
      padding: 0 4px;
    }

    .stock-chart-ticker {
      font-size: 14px;
      font-weight: bold;
      color: #888;
    }

    .stock-chart-price {
      font-size: 18px;
      font-weight: bold;
    }

    .stock-chart-change {
      font-size: 12px;
    }

    .stock-chart-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--window-border);
    }

    .stock-control-label {
      font-size: 9px;
      color: #888;
      margin-right: 6px;
    }

    .stock-candle-controls {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .stock-zoom-control {
      display: flex;
      align-items: center;
    }

    .stock-candle-btn {
      padding: 2px 6px;
      font-family: inherit;
      font-size: 9px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
    }

    .stock-candle-btn:first-child {
      border-radius: 3px 0 0 3px;
    }

    .stock-candle-btn:last-child {
      border-radius: 0 3px 3px 0;
    }

    .stock-candle-btn.active {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .stock-candle-btn:not(.active):hover {
      background: var(--hover-bg);
    }

    .stock-zoom-btn {
      padding: 2px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
    }

    .stock-zoom-btn:first-of-type {
      border-radius: 3px 0 0 3px;
    }

    .stock-zoom-btn:last-of-type {
      border-radius: 0 3px 3px 0;
      border-left: none;
    }

    .stock-zoom-btn:hover {
      background: var(--hover-bg);
    }

    .stock-chart-scroll-container {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stock-chart-scroll-area {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .stock-chart-viewport {
      width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      scrollbar-width: none;
    }

    .stock-chart-viewport::-webkit-scrollbar {
      display: none;
    }

    .stock-price-overlay {
      position: absolute;
      top: 0;
      right: 0;
      width: 45px;
      height: 100%;
      background: linear-gradient(to right, transparent, var(--window-bg) 30%);
      pointer-events: none;
    }

    .stock-price-label {
      position: absolute;
      right: 5px;
      font-size: 9px;
      color: var(--text-color);
      transform: translateY(-50%);
    }

    .stock-scroll-btn {
      width: 24px;
      height: 40px;
      padding: 0;
      font-family: inherit;
      font-size: 10px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
      flex-shrink: 0;
    }

    .stock-scroll-btn:hover {
      background: var(--hover-bg);
    }

    .stock-scroll-btn:active {
      background: var(--window-border);
    }

    .stock-scroll-btn.hidden {
      visibility: hidden;
    }

    .stock-chart {
      width: 100%;
      height: auto;
      display: block;
    }

    .stock-chart-label {
      font-size: 9px;
      fill: var(--text-color);
      font-family: inherit;
    }

    .stock-chart-wrapper {
      position: relative;
    }

    .stock-candle-hover {
      cursor: crosshair;
    }

    .stock-candle:hover .stock-candle-hover {
      fill: rgba(128, 128, 128, 0.1);
    }

    .stock-tooltip {
      position: absolute;
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      padding: 8px;
      font-size: 10px;
      pointer-events: none;
      z-index: 10;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      white-space: nowrap;
    }

    .stock-tooltip-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    .stock-tooltip-label {
      color: #888;
    }

    .stock-tooltip-value {
      font-weight: bold;
    }

    .stock-data-source {
      font-size: 9px;
      color: #888;
      text-align: right;
      margin-top: 8px;
    }

    .stock-watch-btn {
      padding: 4px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
      margin-left: auto;
      align-self: flex-end;
    }

    .stock-watch-btn:hover {
      background: #00c853;
      color: #fff;
      border-color: #00c853;
    }

    .stock-watch-btn.watching {
      background: #00c853;
      color: #fff;
      border-color: #00c853;
    }

    .stock-watch-btn.watching:hover {
      background: #ff1744;
      border-color: #ff1744;
    }

    .stock-api-setup {
      padding: 20px;
      text-align: center;
    }

    .stock-api-setup-title {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 6px;
    }

    .stock-api-setup-desc {
      font-size: 10px;
      color: #888;
      margin-bottom: 16px;
    }

    .stock-api-setup-field {
      margin-bottom: 10px;
      text-align: left;
      max-width: 250px;
      margin-left: auto;
      margin-right: auto;
    }

    .stock-api-setup-field label {
      display: block;
      font-size: 10px;
      margin-bottom: 4px;
    }

    .stock-api-setup-field input {
      width: 100%;
      padding: 6px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      box-sizing: border-box;
    }

    .stock-api-setup-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }

    .stock-api-setup-link {
      font-size: 10px;
      color: #888;
    }

    .stock-api-setup-btn {
      padding: 6px 16px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--text-color);
      color: var(--window-bg);
      cursor: pointer;
    }

    .stock-api-setup-btn:hover {
      opacity: 0.9;
    }

    .stock-api-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .stock-api-modal-content {
      background: var(--window-bg);
      border: 2px solid var(--window-border);
      padding: 16px;
      min-width: 320px;
      box-shadow: 4px 4px 0 var(--window-border);
    }

    .stock-api-modal-title {
      font-weight: bold;
      margin-bottom: 12px;
      font-size: 12px;
    }

    .stock-api-modal-field {
      margin-bottom: 10px;
    }

    .stock-api-modal-field label {
      display: block;
      font-size: 10px;
      margin-bottom: 4px;
    }

    .stock-api-modal-field input {
      width: 100%;
      padding: 4px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      box-sizing: border-box;
    }

    .stock-api-modal-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }

    .stock-api-modal-buttons button {
      padding: 4px 12px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
    }

    .stock-api-modal-buttons button:hover {
      background: var(--hover-bg);
    }

    .stock-api-modal-buttons button.primary {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .stock-api-modal-hint {
      font-size: 9px;
      color: #888;
      margin-top: 8px;
    }

    .stock-api-modal-hint a {
      color: inherit;
    }
  `,

  async fetchTickers() {
    this.loadingTickers = true;
    try {
      const data = await ServerService.getTickers();
      this.tickers = data.tickers || [];
      this.error = null;
    } catch (e) {
      this.error = 'Cannot connect to server';
      this.tickers = [];
    } finally {
      this.loadingTickers = false;
    }
  },

  async fetchOHLC() {
    if (!this.selectedTicker) return;

    this.loading = true;
    console.log('[Stock] fetchOHLC start, loading:', this.loading);
    this.rerender();

    try {
      this.ohlcData = await ServerService.getOHLC(
        this.selectedTicker,
        this.selectedYear,
        this.selectedWindow,
      );
      console.log('[Stock] fetchOHLC got data:', this.ohlcData);
      this.error = null;
    } catch (e) {
      console.log('[Stock] fetchOHLC error:', e);
      this.error = 'Cannot connect to server';
      this.ohlcData = null;
    }
    this.loading = false;
    console.log('[Stock] fetchOHLC done, loading:', this.loading, 'ohlcData:', this.ohlcData);
    this.rerender();
  },

  async fetchIntraday() {
    if (!this.liveTicker) return;
    if (typeof AlpacaProvider === 'undefined' || !AlpacaProvider.isConfigured()) {
      this.error = 'Alpaca API not configured';
      this.rerender();
      return;
    }

    this.loading = true;
    console.log('[Stock] fetchIntraday start');
    this.rerender();

    try {
      this.intradayData = await AlpacaProvider.getTodayBars(this.liveTicker);
      console.log('[Stock] fetchIntraday got data:', this.intradayData);
      this.error = null;
    } catch (e) {
      console.log('[Stock] fetchIntraday error:', e);
      this.error = `Failed to fetch intraday data: ${e.message}`;
      this.intradayData = null;
    }
    this.loading = false;
    this.rerender();
  },

  // Fetch data based on current view mode
  async fetchData() {
    if (this.viewMode === 'today') {
      await this.fetchIntraday();
    } else {
      await this.fetchOHLC();
    }
  },

  rerender() {
    const windowEl = document.querySelector(`[data-window-id="${this.id}"]`);
    console.log('[Stock] rerender windowEl:', windowEl);
    if (windowEl) {
      const contentEl = windowEl.querySelector('.stock-content');
      console.log('[Stock] rerender contentEl:', contentEl);
      if (contentEl) {
        // Use stocksCard directly to ensure we're using the same object that holds the state
        contentEl.outerHTML = stocksCard.content();
        console.log('[Stock] rerender done');
      }
    }
  },

  init(system) {
    console.log('[Stock] init() called');
    // Use stocksCard directly since openWindows contains shallow copies
    stocksCard.selectedTicker = '';
    stocksCard.selectedYear = 2024;
    stocksCard.selectedWindow = 'monthly';
    stocksCard.viewMode = 'historical';
    stocksCard.ohlcData = null;
    stocksCard.intradayData = null;
    stocksCard.loading = false;
    stocksCard.error = null;
    stocksCard.alpacaConfigured = typeof AlpacaProvider !== 'undefined' && AlpacaProvider.isConfigured();
    stocksCard.scrollPosition = 0;
    stocksCard.candleSize = '1m';
    stocksCard.zoomLevel = 1;
    stocksCard.tickers = [];
    stocksCard.loadingTickers = false;

    // Fetch available tickers for historical data
    stocksCard.fetchTickers().then(() => {
      stocksCard.rerender();
    });
  },

  destroy() {
    // Cleanup
  },

  async handleChange(e) {
    console.log('[Stock] handleChange called, target:', e.target.id, 'value:', e.target.value);
    // Historical ticker dropdown
    if (e.target.id === 'stock-ticker-select') {
      this.selectedTicker = e.target.value;
      this.scrollPosition = 0;
      if (this.selectedTicker) {
        await this.fetchOHLC();
      } else {
        this.ohlcData = null;
        this.rerender();
      }
    }
    if (e.target.id === 'stock-window-select') {
      this.selectedWindow = e.target.value;
      if (this.selectedTicker) {
        await this.fetchOHLC();
      }
    }
  },

  async handleKeyDown(e) {
    if (e.target.id === 'stock-ticker-input' && e.key === 'Enter') {
      e.preventDefault();
      await this.loadTicker(e.target.value);
    }
  },

  async loadTicker(value) {
    const ticker = value.toUpperCase().trim();
    const isNewTicker = ticker !== this.liveTicker;
    this.liveTicker = ticker;
    if (isNewTicker) {
      this.scrollPosition = 0;
      this.candleSize = '1m';
      this.zoomLevel = 1;
    }
    console.log('[Stock] liveTicker set to:', this.liveTicker);
    if (this.liveTicker) {
      await this.fetchIntraday();
    } else {
      this.intradayData = null;
      this.rerender();
    }
  },

  handleClick(e) {
    // Handle tab clicks
    if (e.target.classList.contains('stock-tab')) {
      e.preventDefault();
      const tab = e.target.dataset.tab;
      if (tab && tab !== this.viewMode) {
        this.viewMode = tab;
        this.scrollPosition = 0;
        // Toggle visibility via CSS classes - no rerender needed
        const windowEl = document.querySelector(`[data-window-id="${this.id}"]`);
        if (windowEl) {
          const historicalPanel = windowEl.querySelector('.stock-panel-historical');
          const livePanel = windowEl.querySelector('.stock-panel-live');
          const historicalTab = windowEl.querySelector('[data-tab="historical"]');
          const liveTab = windowEl.querySelector('[data-tab="today"]');
          if (tab === 'today') {
            historicalPanel?.classList.add('hidden');
            livePanel?.classList.remove('hidden');
            historicalTab?.classList.remove('active');
            liveTab?.classList.add('active');
          } else {
            livePanel?.classList.add('hidden');
            historicalPanel?.classList.remove('hidden');
            liveTab?.classList.remove('active');
            historicalTab?.classList.add('active');
          }
        }
      }
      return;
    }
    // Handle inline API save button
    if (e.target.id === 'stock-save-alpaca') {
      e.preventDefault();
      const windowEl = document.querySelector(`[data-window-id="${this.id}"]`);
      const apiKey = windowEl.querySelector('#alpaca-api-key')?.value.trim();
      const apiSecret = windowEl.querySelector('#alpaca-api-secret')?.value.trim();
      if (apiKey && apiSecret && typeof AlpacaProvider !== 'undefined') {
        AlpacaProvider.configure(apiKey, apiSecret);
        localStorage.setItem('alpaca_api_key', apiKey);
        localStorage.setItem('alpaca_api_secret', apiSecret);
        this.alpacaConfigured = true;
        // After configuring API, fetch data if we have a live ticker, otherwise just rerender
        if (this.liveTicker) {
          this.fetchIntraday();
        } else {
          this.rerender();
        }
      }
      return;
    }
    // Handle Go button click
    if (e.target.id === 'stock-ticker-go') {
      e.preventDefault();
      const windowEl = document.querySelector(`[data-window-id="${this.id}"]`);
      const input = windowEl.querySelector('#stock-ticker-input');
      if (input) {
        this.loadTicker(input.value);
      }
      return;
    }
    // Handle candle size buttons
    if (e.target.classList.contains('stock-candle-btn')) {
      e.preventDefault();
      const newSize = e.target.dataset.candle;
      if (newSize && this.candleSize !== newSize) {
        this.candleSize = newSize;
        this.scrollPosition = 0; // Reset scroll when changing candle size
        this.rerender();
      }
      return;
    }
    // Handle zoom buttons
    if (e.target.id === 'stock-zoom-in' || e.target.id === 'stock-zoom-out') {
      e.preventDefault();
      const zoomFactor = 1.25;
      const minZoom = 0.25;
      const maxZoom = 4;
      if (e.target.id === 'stock-zoom-in') {
        this.zoomLevel = Math.min(maxZoom, this.zoomLevel * zoomFactor);
      } else {
        this.zoomLevel = Math.max(minZoom, this.zoomLevel / zoomFactor);
      }
      this.rerender();
      return;
    }
    // Handle scroll buttons
    if (e.target.id === 'stock-scroll-left' || e.target.id === 'stock-scroll-right') {
      e.preventDefault();
      const windowEl = document.querySelector(`[data-window-id="${this.id}"]`);
      const viewport = windowEl.querySelector('.stock-chart-viewport');
      if (viewport) {
        const scrollAmount = 100;
        const direction = e.target.id === 'stock-scroll-left' ? -1 : 1;
        viewport.scrollLeft += scrollAmount * direction;
        // Update scroll position and rerender for dynamic scaling
        this.scrollPosition = viewport.scrollLeft;
        this.rerender();
        // Restore scroll position after rerender
        requestAnimationFrame(() => {
          const newViewport = document.querySelector(`[data-window-id="${this.id}"] .stock-chart-viewport`);
          if (newViewport) newViewport.scrollLeft = this.scrollPosition;
        });
      }
      return;
    }
    if (e.target.id === 'stock-watch-btn') {
      e.preventDefault();
      const ticker = this.viewMode === 'today' ? this.liveTicker : this.selectedTicker;
      if (ticker) {
        this.toggleWatch(ticker);
      }
    }
  },

  showApiConfigModal(onSuccess) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'stock-api-modal';
    modal.innerHTML = `
      <div class="stock-api-modal-content">
        <div class="stock-api-modal-title">Configure Alpaca API</div>
        <div class="stock-api-modal-field">
          <label for="alpaca-api-key">API Key ID</label>
          <input type="text" id="alpaca-api-key" placeholder="PK...">
        </div>
        <div class="stock-api-modal-field">
          <label for="alpaca-api-secret">API Secret Key</label>
          <input type="password" id="alpaca-api-secret" placeholder="Your secret key">
        </div>
        <div class="stock-api-modal-hint">
          Get free API keys at <a href="https://app.alpaca.markets/signup" target="_blank">alpaca.markets</a>
        </div>
        <div class="stock-api-modal-buttons">
          <button id="alpaca-cancel">Cancel</button>
          <button id="alpaca-save" class="primary">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Load existing values if configured
    if (typeof AlpacaProvider !== 'undefined' && AlpacaProvider.apiKey) {
      modal.querySelector('#alpaca-api-key').value = AlpacaProvider.apiKey;
      modal.querySelector('#alpaca-api-secret').value = AlpacaProvider.apiSecret || '';
    }

    // Handle save
    modal.querySelector('#alpaca-save').addEventListener('click', () => {
      const apiKey = modal.querySelector('#alpaca-api-key').value.trim();
      const apiSecret = modal.querySelector('#alpaca-api-secret').value.trim();

      if (apiKey && apiSecret) {
        if (typeof AlpacaProvider !== 'undefined') {
          AlpacaProvider.configure(apiKey, apiSecret);
          // Save to localStorage for persistence
          localStorage.setItem('alpaca_api_key', apiKey);
          localStorage.setItem('alpaca_api_secret', apiSecret);
          this.alpacaConfigured = true;
        }
        document.body.removeChild(modal);
        if (onSuccess) {
          onSuccess();
        } else {
          this.rerender();
        }
      } else {
        document.body.removeChild(modal);
        this.rerender();
      }
    });

    // Handle cancel
    modal.querySelector('#alpaca-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  },

  // Called when opening a .stock "file" from pinned list
  async openFile(path) {
    // Extract ticker from path (e.g., "AAPL.stock" -> "AAPL")
    const ticker = path.replace('.stock', '');
    console.log('[Stock] openFile called with ticker:', ticker);

    // Open the stocks window
    if (typeof OS !== 'undefined') {
      OS.openWindow('stocks');
    }

    // Ensure tickers are loaded before checking
    if (stocksCard.tickers.length === 0 && !stocksCard.loadingTickers) {
      await stocksCard.fetchTickers();
    }

    // Check if ticker is available in historical data
    if (stocksCard.tickers.includes(ticker)) {
      // Use historical tab
      stocksCard.viewMode = 'historical';
      stocksCard.selectedTicker = ticker;
      stocksCard.scrollPosition = 0;
      await stocksCard.fetchOHLC();
    } else {
      // Use live tab - set the ticker even if Alpaca isn't configured
      // The UI will show the API setup form within the live tab
      stocksCard.viewMode = 'today';
      stocksCard.liveTicker = ticker;
      stocksCard.scrollPosition = 0;
      const alpacaAvailable = typeof AlpacaProvider !== 'undefined' && AlpacaProvider.isConfigured();
      if (alpacaAvailable) {
        await stocksCard.fetchIntraday();
      } else {
        stocksCard.rerender();
      }
    }
  },

  handleMouseOver(e) {
    const candle = e.target.closest('.stock-candle');
    if (!candle) return;

    const wrapper = e.target.closest('.stock-chart-wrapper');
    const tooltip = wrapper?.querySelector('.stock-tooltip');
    if (!tooltip) return;

    const period = candle.dataset.period;
    const open = candle.dataset.open;
    const high = candle.dataset.high;
    const low = candle.dataset.low;
    const close = candle.dataset.close;
    const volume = candle.dataset.volume;

    tooltip.innerHTML = `
      <div class="stock-tooltip-row"><span class="stock-tooltip-label">${period}</span></div>
      <div class="stock-tooltip-row"><span class="stock-tooltip-label">O</span><span class="stock-tooltip-value">${open}</span></div>
      <div class="stock-tooltip-row"><span class="stock-tooltip-label">H</span><span class="stock-tooltip-value">${high}</span></div>
      <div class="stock-tooltip-row"><span class="stock-tooltip-label">L</span><span class="stock-tooltip-value">${low}</span></div>
      <div class="stock-tooltip-row"><span class="stock-tooltip-label">C</span><span class="stock-tooltip-value">${close}</span></div>
      <div class="stock-tooltip-row"><span class="stock-tooltip-label">Vol</span><span class="stock-tooltip-value">${volume}M</span></div>
    `;
    tooltip.style.display = 'block';
  },

  handleMouseMove(e) {
    const wrapper = e.target.closest('.stock-chart-wrapper');
    const tooltip = wrapper?.querySelector('.stock-tooltip');
    if (!tooltip || tooltip.style.display === 'none') return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position tooltip, keep it within bounds
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = x + 10;
    let top = y - 10;

    if (left + tooltipRect.width > rect.width) {
      left = x - tooltipRect.width - 10;
    }
    if (top < 0) {
      top = y + 20;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  },

  handleMouseOut(e) {
    const wrapper = e.target.closest('.stock-chart-wrapper');
    const tooltip = wrapper?.querySelector('.stock-tooltip');
    if (!tooltip) return;

    // Only hide if we're leaving the chart area entirely
    const related = e.relatedTarget;
    if (related && wrapper.contains(related)) return;

    tooltip.style.display = 'none';
  },

  boot() {
    // Load saved Alpaca API credentials
    const savedApiKey = localStorage.getItem('alpaca_api_key');
    const savedApiSecret = localStorage.getItem('alpaca_api_secret');
    if (savedApiKey && savedApiSecret && typeof AlpacaProvider !== 'undefined') {
      AlpacaProvider.configure(savedApiKey, savedApiSecret);
      console.log('[Stock] Loaded Alpaca API credentials from localStorage');
    }
  },
};
