// Stock Simulator Card - Paper trading simulator
const simulatorCard = {
  id: 'simulator',
  title: 'Stock Simulator',
  draggable: true,
  closeable: true,
  zIndex: 106,
  top: 120,
  left: 150,
  width: 400,
  contextMenu: [
    { label: 'Close', action: 'close' },
  ],

  // State
  ticker: null,        // Current position ticker (null = no position)
  shares: 0,           // Number of shares owned
  cash: 1000,          // Cash balance
  currentDate: null,   // Current simulation date (YYYYMMDD)
  dates: [],           // All available trading dates
  tickers: [],         // All available tickers
  selectedTicker: '',  // Ticker selected for inquiry
  tickerData: null,    // OHLC data for selected ticker on current date
  loading: false,
  showFastForward: false, // Show fast forward date picker

  // Calculate midpoint price
  getMidpoint(data) {
    return (data.high + data.low) / 2;
  },

  // Format date from YYYYMMDD to readable string
  formatDate(dateKey) {
    const str = String(dateKey);
    const year = str.slice(0, 4);
    const month = parseInt(str.slice(4, 6), 10);
    const day = parseInt(str.slice(6, 8), 10);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    return `The day is ${year} ${monthNames[month - 1]} ${day}`;
  },

  // Get next trading date
  getNextDate() {
    const currentIndex = this.dates.indexOf(this.currentDate);
    if (currentIndex < this.dates.length - 1) {
      return this.dates[currentIndex + 1];
    }
    return null;
  },

  // Get next N trading dates
  getNextDates(n) {
    const currentIndex = this.dates.indexOf(this.currentDate);
    const endIndex = Math.min(currentIndex + n + 1, this.dates.length);
    return this.dates.slice(currentIndex + 1, endIndex);
  },

  // Format date short (for fast forward list)
  formatDateShort(dateKey) {
    const str = String(dateKey);
    const month = parseInt(str.slice(4, 6), 10);
    const day = parseInt(str.slice(6, 8), 10);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${day}`;
  },

  // Jump to specific date
  jumpToDate(dateKey) {
    this.currentDate = dateKey;
    this.showFastForward = false;
    if (this.ticker) {
      this.selectedTicker = this.ticker;
    }
    if (this.selectedTicker) {
      this.fetchTickerData(this.selectedTicker);
    } else {
      this.tickerData = null;
      this.rerender();
    }
  },

  // Load all trading dates from WASM
  async loadDates() {
    await ServerService.initWasm();
    const result = JSON.parse(window.getDates());
    this.dates = result.dates || [];
  },

  // Fetch ticker data for current date
  async fetchTickerData(ticker) {
    if (!ticker || !this.currentDate) {
      this.tickerData = null;
      return;
    }

    this.loading = true;
    this.rerender();

    try {
      await ServerService.initWasm();
      const result = JSON.parse(window.getTickerForDate(ticker, this.currentDate));
      if (result.error) {
        this.tickerData = null;
      } else {
        this.tickerData = {
          ticker: result.ticker,
          open: result.open,
          high: result.high,
          low: result.low,
          close: result.close,
          volume: result.volume,
        };
      }
    } catch (e) {
      this.tickerData = null;
    }

    this.loading = false;
    this.rerender();
  },

  // Buy shares
  buy() {
    if (!this.tickerData || this.ticker) return;

    const price = this.getMidpoint(this.tickerData);
    const maxShares = Math.floor((this.cash / price) * 10) / 10; // 1/10 fractional
    const cost = maxShares * price;

    this.ticker = this.selectedTicker;
    this.shares = maxShares;
    this.cash = this.cash - cost;

    this.advanceDate();
  },

  // Close position
  close() {
    if (!this.ticker || !this.tickerData) return;

    const price = this.getMidpoint(this.tickerData);
    const proceeds = this.shares * price;

    this.cash = this.cash + proceeds;
    this.ticker = null;
    this.shares = 0;

    this.advanceDate();
  },

  // Skip day
  skip() {
    this.advanceDate();
  },

  // Advance to next trading date
  advanceDate() {
    const nextDate = this.getNextDate();
    if (nextDate) {
      this.currentDate = nextDate;
      // If we have a position, show that ticker's data
      if (this.ticker) {
        this.selectedTicker = this.ticker;
      }
      // Fetch data for selected ticker (position or inquiry)
      if (this.selectedTicker) {
        this.fetchTickerData(this.selectedTicker);
      } else {
        this.tickerData = null;
        this.rerender();
      }
    } else {
      // End of simulation
      this.rerender();
    }
  },

  content() {
    const state = this;
    const hasPosition = state.ticker !== null;
    const isEndOfData = state.dates.length > 0 && state.currentDate === state.dates[state.dates.length - 1];

    // Calculate values
    const equityValue = hasPosition && state.tickerData ? state.shares * this.getMidpoint(state.tickerData) : 0;
    const totalValue = state.cash + equityValue;

    return `
      <div class="sim-content">
        <div class="sim-status">
          <div class="sim-date">${state.currentDate ? this.formatDate(state.currentDate) : 'Loading...'}</div>
          <div class="sim-portfolio-label">Your position:</div>
          <div class="sim-portfolio-grid">
            <div class="sim-portfolio-row">
              <span class="sim-label">Cash:</span>
              <span>$${state.cash.toFixed(2)}</span>
            </div>
            <div class="sim-portfolio-row">
              <span class="sim-label">Ticker:</span>
              <span>${state.ticker || '-'}</span>
            </div>
            <div class="sim-portfolio-row">
              <span class="sim-label">Shares:</span>
              <span>${hasPosition ? state.shares.toFixed(1) : '-'}</span>
            </div>
            <div class="sim-portfolio-row">
              <span class="sim-label">Equity Value:</span>
              <span>${hasPosition ? '$' + equityValue.toFixed(2) : '-'}</span>
            </div>
            <div class="sim-portfolio-row sim-total">
              <span class="sim-label">Total Value:</span>
              <span>$${totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <hr class="sim-divider">

        <div class="sim-inquiry">
          <div class="sim-inquiry-header">
            <label class="sim-label">Quote:</label>
            <select class="sim-select" id="sim-ticker-select">
              <option value="">Select...</option>
              ${state.tickers.map(t => `<option value="${t}" ${state.selectedTicker === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>

          <div class="sim-ohlc">
            <div class="sim-ohlc-row"><span>Open:</span> <span>${state.tickerData ? '$' + state.tickerData.open.toFixed(2) : '-'}</span></div>
            <div class="sim-ohlc-row"><span>High:</span> <span>${state.tickerData ? '$' + state.tickerData.high.toFixed(2) : '-'}</span></div>
            <div class="sim-ohlc-row"><span>Low:</span> <span>${state.tickerData ? '$' + state.tickerData.low.toFixed(2) : '-'}</span></div>
            <div class="sim-ohlc-row"><span>Close:</span> <span>${state.tickerData ? '$' + state.tickerData.close.toFixed(2) : '-'}</span></div>
            <div class="sim-ohlc-row sim-midpoint"><span>Midpoint:</span> <span>${state.tickerData ? '$' + this.getMidpoint(state.tickerData).toFixed(2) : '-'}</span></div>
          </div>
        </div>

        ${isEndOfData ? `
          <div class="sim-end">End of simulation data</div>
        ` : `
          <div class="sim-action-buttons">
            ${hasPosition ? `
              <button class="sim-btn sim-btn-sell" id="sim-close-btn" ${!state.tickerData ? 'disabled' : ''}>Sell</button>
            ` : `
              <button class="sim-btn sim-btn-buy" id="sim-buy-btn" ${!state.tickerData ? 'disabled' : ''}>Buy</button>
            `}
            <button class="sim-btn sim-btn-secondary" id="sim-next-btn">Next Day [→]</button>
          </div>

          <div class="sim-fastforward">
            <div class="sim-fastforward-header">Skip to next 30 trading days:</div>
            <div class="sim-fastforward-list">
              ${this.getNextDates(30).map(d => `
                <button class="sim-ff-date" data-date="${d}">${this.formatDateShort(d)}</button>
              `).join('')}
            </div>
          </div>
        `}
      </div>
    `;
  },

  styles: `
    .sim-content {
      padding: 12px;
      font-size: 11px;
    }

    .sim-status {
      margin-bottom: 8px;
    }

    .sim-date {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .sim-portfolio-label {
      margin-top: 8px;
      margin-bottom: 4px;
      font-weight: bold;
    }

    .sim-portfolio-grid {
      display: grid;
      grid-template-columns: auto auto;
      gap: 2px 12px;
    }

    .sim-portfolio-row {
      display: contents;
    }

    .sim-portfolio-row span:last-child {
      text-align: right;
    }

    .sim-total {
      border-top: 1px solid var(--window-border);
      font-weight: bold;
    }

    .sim-total span {
      padding-top: 4px;
    }

    .sim-label {
      color: #666;
      margin-right: 4px;
    }

    .sim-divider {
      border: none;
      border-top: 1px solid var(--window-border);
      margin: 8px 0;
    }

    .sim-inquiry-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .sim-select {
      flex: 1;
      font-family: inherit;
      font-size: 11px;
      padding: 4px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
    }

    .sim-ohlc {
      padding: 8px 0;
    }

    .sim-ohlc-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
    }

    .sim-midpoint {
      border-top: 1px solid var(--window-border);
      margin-top: 4px;
      padding-top: 4px;
      font-weight: bold;
    }

    .sim-loading, .sim-no-data {
      padding: 12px;
      text-align: center;
      color: #666;
    }

    .sim-actions {
      display: flex;
      gap: 8px;
    }

    .sim-btn {
      flex: 1;
      font-family: inherit;
      font-size: 11px;
      padding: 6px 12px;
      border: 2px solid var(--window-border);
      background: var(--window-bg);
      color: var(--text-color);
      cursor: pointer;
    }

    .sim-btn:hover:not(:disabled) {
      background: var(--hover-bg);
    }

    .sim-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sim-btn-secondary {
      background: var(--input-bg);
    }

    .sim-btn-buy {
      background: #00c853;
      color: white;
      border-color: #00a844;
    }

    .sim-btn-buy:hover:not(:disabled) {
      background: #00b848;
    }

    .sim-btn-sell {
      background: #ff1744;
      color: white;
      border-color: #e0153c;
    }

    .sim-btn-sell:hover:not(:disabled) {
      background: #e6143d;
    }

    .sim-end {
      text-align: center;
      color: #666;
      padding: 8px;
    }

    .sim-action-buttons {
      display: flex;
      gap: 8px;
    }

    .sim-fastforward {
      width: 100%;
      margin-top: 12px;
    }

    .sim-fastforward-header {
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 10px;
      color: #666;
    }

    .sim-fastforward-list {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 4px;
    }

    .sim-ff-date {
      font-family: inherit;
      font-size: 10px;
      padding: 4px 2px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      cursor: pointer;
    }

    .sim-ff-date:hover {
      background: var(--hover-bg);
    }

    .sim-btn-blink {
      background: var(--text-color) !important;
      color: var(--window-bg) !important;
    }
  `,

  rerender() {
    const windowEl = document.querySelector(`[data-window-id="${this.id}"]`);
    if (windowEl) {
      const contentEl = windowEl.querySelector('.sim-content');
      if (contentEl) {
        contentEl.outerHTML = simulatorCard.content();
      }
    }
  },

  async init(system) {
    simulatorCard.ticker = null;
    simulatorCard.shares = 0;
    simulatorCard.cash = 1000;
    simulatorCard.selectedTicker = '';
    simulatorCard.tickerData = null;
    simulatorCard.loading = false;
    simulatorCard.showFastForward = false;
    simulatorCard.dates = [];
    simulatorCard.tickers = [];

    // Load tickers
    try {
      const data = await ServerService.getTickers();
      simulatorCard.tickers = data.tickers || [];
    } catch (e) {
      simulatorCard.tickers = [];
    }

    // Load all dates and find start
    await simulatorCard.loadDates();
    if (simulatorCard.dates.length > 0) {
      simulatorCard.currentDate = simulatorCard.dates[0];
    }

    // Add keyboard listener
    simulatorCard._keyHandler = (e) => {
      // Only handle if simulator window is open
      const windowEl = document.querySelector(`[data-window-id="simulator"]`);
      if (windowEl) {
        simulatorCard.handleKeyDown(e);
      }
    };
    document.addEventListener('keydown', simulatorCard._keyHandler);

    simulatorCard.rerender();
  },

  destroy() {
    if (simulatorCard._keyHandler) {
      document.removeEventListener('keydown', simulatorCard._keyHandler);
      simulatorCard._keyHandler = null;
    }
  },

  async handleChange(e) {
    if (e.target.id === 'sim-ticker-select') {
      this.selectedTicker = e.target.value;
      if (this.selectedTicker) {
        await this.fetchTickerData(this.selectedTicker);
      } else {
        this.tickerData = null;
        this.rerender();
      }
    }
  },

  handleClick(e) {
    if (e.target.id === 'sim-buy-btn') {
      e.preventDefault();
      this.buy();
      return;
    }
    if (e.target.id === 'sim-close-btn') {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.target.id === 'sim-next-btn') {
      e.preventDefault();
      this.advanceDate();
      return;
    }
    if (e.target.classList.contains('sim-ff-date')) {
      e.preventDefault();
      const dateKey = parseInt(e.target.dataset.date, 10);
      this.jumpToDate(dateKey);
      return;
    }
  },

  handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // Blink the button then advance
      const btn = document.getElementById('sim-next-btn');
      if (btn) {
        btn.classList.add('sim-btn-blink');
        setTimeout(() => {
          this.advanceDate();
        }, 100);
      } else {
        this.advanceDate();
      }
    }
  },

  boot() {},
};
