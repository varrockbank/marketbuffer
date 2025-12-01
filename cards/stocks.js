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
  tickers: [],
  selectedTicker: '',
  selectedYear: 2024,
  selectedWindow: 'monthly',
  ohlcData: null,
  loading: false,
  loadingTickers: true,
  showLoadingSpinner: false, // Delayed spinner display
  error: null,

  content() {
    // Always use stocksCard to access state (openWindows contains shallow copies)
    const state = stocksCard;

    console.log('[Stock] content() called, state:', {
      error: state.error,
      loadingTickers: state.loadingTickers,
      showLoadingSpinner: state.showLoadingSpinner,
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

    if (state.showLoadingSpinner) {
      return `
        <div class="stock-content">
          <div class="stock-loading">
            <div class="stock-spinner"></div>
            <div>Loading tickers...</div>
          </div>
        </div>
      `;
    }

    const tickerOptions = state.loadingTickers
      ? '<option value="">Loading...</option>'
      : state.tickers.map(t =>
          `<option value="${t}" ${state.selectedTicker === t ? 'selected' : ''}>${t}</option>`
        ).join('');

    let dataContent = '';
    if (state.loading) {
      dataContent = `
        <div class="stock-loading">
          <div class="stock-spinner"></div>
          <div>Loading...</div>
        </div>
      `;
    } else if (state.ohlcData && state.ohlcData.data && state.ohlcData.data.length > 0) {
      const data = state.ohlcData.data;
      const chartWidth = 420;
      const chartHeight = 200;
      const padding = { top: 20, right: 50, bottom: 30, left: 10 };
      const innerWidth = chartWidth - padding.left - padding.right;
      const innerHeight = chartHeight - padding.top - padding.bottom;

      // Calculate price range
      const allPrices = data.flatMap(d => [d.high, d.low]);
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      const priceRange = maxPrice - minPrice;
      const pricePadding = priceRange * 0.1;
      const yMin = minPrice - pricePadding;
      const yMax = maxPrice + pricePadding;

      // Scale functions
      const xScale = (i) => padding.left + (i + 0.5) * (innerWidth / data.length);
      const yScale = (price) => padding.top + innerHeight - ((price - yMin) / (yMax - yMin)) * innerHeight;

      const candleWidth = Math.max(4, Math.min(20, (innerWidth / data.length) * 0.6));

      // Build candlesticks with hover areas
      const hoverWidth = innerWidth / data.length;
      const candles = data.map((d, i) => {
        const x = xScale(i);
        const isUp = d.close >= d.open;
        const color = isUp ? '#00c853' : '#ff1744';
        const bodyTop = yScale(Math.max(d.open, d.close));
        const bodyBottom = yScale(Math.min(d.open, d.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        // Encode OHLC data in data attributes for hover
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
      const xLabels = data.map((d, i) => {
        const x = xScale(i);
        return `<text x="${x}" y="${chartHeight - 8}" text-anchor="middle" class="stock-chart-label">${d.period}</text>`;
      }).join('');

      // Y-axis labels (price scale on right)
      const yTicks = 5;
      const yLabels = Array.from({ length: yTicks }, (_, i) => {
        const price = yMin + (yMax - yMin) * (i / (yTicks - 1));
        const y = yScale(price);
        return `
          <line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="var(--window-border)" stroke-width="0.5" stroke-dasharray="2,2"/>
          <text x="${chartWidth - padding.right + 5}" y="${y + 3}" class="stock-chart-label">${price.toFixed(0)}</text>
        `;
      }).join('');

      // Current price info
      const latest = data[data.length - 1];
      const first = data[0];
      const change = latest.close - first.open;
      const changePercent = ((change / first.open) * 100).toFixed(2);
      const changeColor = change >= 0 ? '#00c853' : '#ff1744';
      const changeSign = change >= 0 ? '+' : '';

      dataContent = `
        <div class="stock-chart-container">
          <div class="stock-chart-header">
            <span class="stock-chart-price">$${latest.close.toFixed(2)}</span>
            <span class="stock-chart-change" style="color: ${changeColor}">${changeSign}${change.toFixed(2)} (${changeSign}${changePercent}%)</span>
          </div>
          <div class="stock-chart-wrapper">
            <svg class="stock-chart" viewBox="0 0 ${chartWidth} ${chartHeight}">
              ${yLabels}
              ${candles}
              ${xLabels}
            </svg>
            <div class="stock-tooltip" style="display: none;"></div>
          </div>
        </div>
      `;
    } else if (state.selectedTicker) {
      dataContent = `<div class="stock-placeholder">No data available</div>`;
    } else {
      dataContent = `<div class="stock-placeholder">Select a ticker to view data</div>`;
    }

    return `
      <div class="stock-content">
        <div class="stock-controls">
          <div class="stock-control-group">
            <label class="stock-label">Ticker</label>
            <select class="stock-select" id="stock-ticker-select">
              <option value="">Select ticker...</option>
              ${tickerOptions}
            </select>
          </div>
          <div class="stock-control-group">
            <label class="stock-label">Year</label>
            <select class="stock-select" id="stock-year-select">
              <option value="2024" selected>2024</option>
              <option value="2023" disabled>2023</option>
              <option value="2022" disabled>2022</option>
              <option value="2021" disabled>2021</option>
              <option value="2020" disabled>2020</option>
              <option value="2019" disabled>2019</option>
              <option value="2018" disabled>2018</option>
              <option value="2017" disabled>2017</option>
              <option value="2016" disabled>2016</option>
              <option value="2015" disabled>2015</option>
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
        </div>
        ${dataContent}
      </div>
    `;
  },

  styles: `
    .stock-content {
      padding: 12px;
      background: var(--window-bg);
      min-height: 200px;
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
      gap: 12px;
      margin-bottom: 8px;
      padding: 0 4px;
    }

    .stock-chart-price {
      font-size: 18px;
      font-weight: bold;
    }

    .stock-chart-change {
      font-size: 12px;
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
  `,

  async fetchTickers() {
    this.loadingTickers = true;
    try {
      const response = await fetch('/api/tickers');
      if (!response.ok) throw new Error('Failed to fetch tickers');
      const data = await response.json();
      this.tickers = data.tickers || [];
      this.error = null;
    } catch (e) {
      this.error = 'Cannot connect to server';
      this.tickers = [];
    } finally {
      this.loadingTickers = false;
      console.log('[Stock] fetchTickers done, loadingTickers:', this.loadingTickers);
    }
  },

  async fetchOHLC() {
    if (!this.selectedTicker) return;

    this.loading = true;
    console.log('[Stock] fetchOHLC start, loading:', this.loading);
    this.rerender();

    try {
      const response = await fetch(`/api/ohlc?ticker=${this.selectedTicker}&year=${this.selectedYear}&window=${this.selectedWindow}`);
      if (!response.ok) throw new Error('Failed to fetch OHLC data');
      this.ohlcData = await response.json();
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
    stocksCard.tickers = [];
    stocksCard.selectedTicker = '';
    stocksCard.selectedYear = 2024;
    stocksCard.selectedWindow = 'monthly';
    stocksCard.ohlcData = null;
    stocksCard.loading = false;
    stocksCard.loadingTickers = true;
    stocksCard.showLoadingSpinner = false;
    stocksCard.error = null;

    // Show spinner after 1 second delay (only if still loading)
    const spinnerTimeout = setTimeout(() => {
      if (stocksCard.loadingTickers) {
        stocksCard.showLoadingSpinner = true;
        stocksCard.rerender();
      }
    }, 1000);

    // Fetch tickers asynchronously and rerender when done
    stocksCard.fetchTickers().then(() => {
      clearTimeout(spinnerTimeout);
      stocksCard.showLoadingSpinner = false;
      stocksCard.rerender();
    });
  },

  destroy() {
    // Cleanup
  },

  async handleChange(e) {
    console.log('[Stock] handleChange called, target:', e.target.id, 'value:', e.target.value);
    if (e.target.id === 'stock-ticker-select') {
      this.selectedTicker = e.target.value;
      console.log('[Stock] selectedTicker set to:', this.selectedTicker);
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
    // Nothing on boot
  },
};
