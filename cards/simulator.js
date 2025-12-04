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
  previousDate: null,  // Previous trading date (for delta calculation)
  dates: [],           // All available trading dates
  tickers: [],         // All available tickers
  selectedTicker: '',  // Ticker selected for inquiry
  tickerData: null,    // OHLC data for selected ticker on current date
  previousTickerData: null, // OHLC data for position ticker on previous date
  loading: false,
  showFastForward: false, // Show fast forward date picker
  showDetails: false,  // Show details panel
  detailsAnimated: false, // Track if details pane has been animated
  detailsClosing: false, // Track if details pane is closing
  detailsOpening: false, // Track if details pane is opening
  trades: [],          // Array of {ticker, shares, openDate, openPrice, closeDate?, closePrice?, pnl?}
  expandedTrades: {},  // Track which trades are expanded by index
  dailyTotalValues: [], // Track daily total values: [{date, value}]

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

  // Get previous trading date (1 trading day before current)
  getPreviousDate() {
    const currentIndex = this.dates.indexOf(this.currentDate);
    if (currentIndex > 0) {
      return this.dates[currentIndex - 1];
    }
    return null;
  },

  // Fetch previous day's ticker data for position
  async fetchPreviousTickerData() {
    if (!this.ticker || !this.previousDate) {
      this.previousTickerData = null;
      return;
    }

    try {
      await ServerService.initWasm();
      const result = JSON.parse(window.getTickerForDate(this.ticker, this.previousDate));
      if (result.error) {
        this.previousTickerData = null;
      } else {
        this.previousTickerData = {
          ticker: result.ticker,
          open: result.open,
          high: result.high,
          low: result.low,
          close: result.close,
          volume: result.volume,
        };
      }
    } catch (e) {
      this.previousTickerData = null;
    }
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
  async jumpToDate(dateKey) {
    const oldDate = this.currentDate;
    const oldIdx = this.dates.indexOf(oldDate);
    const newIdx = this.dates.indexOf(dateKey);

    // Record values for all days in between if we have a position
    if (this.ticker && oldIdx >= 0 && newIdx > oldIdx) {
      await ServerService.initWasm();
      for (let i = oldIdx + 1; i <= newIdx; i++) {
        const date = this.dates[i];
        const result = JSON.parse(window.getTickerForDate(this.ticker, date));
        if (!result.error) {
          const midpoint = (result.high + result.low) / 2;
          const equityValue = this.shares * midpoint;
          const totalValue = this.cash + equityValue;
          this.dailyTotalValues.push({ date, value: totalValue, ticker: this.ticker });
        }
      }
    }

    this.currentDate = dateKey;
    this.previousDate = this.getPreviousDate();
    this.showFastForward = false;
    if (this.ticker) {
      this.selectedTicker = this.ticker;
      await this.fetchPreviousTickerData();
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

    // Record daily total value
    this.recordDailyValue();

    this.loading = false;
    this.rerender();
  },

  // Record current total value for the day
  recordDailyValue() {
    const equityValue = this.ticker && this.tickerData ? this.shares * this.getMidpoint(this.tickerData) : 0;
    const totalValue = this.cash + equityValue;

    // Only record if we don't already have an entry for this date
    const existingIdx = this.dailyTotalValues.findIndex(d => d.date === this.currentDate);
    if (existingIdx === -1) {
      this.dailyTotalValues.push({ date: this.currentDate, value: totalValue, ticker: this.ticker || '' });
    } else {
      this.dailyTotalValues[existingIdx].value = totalValue;
      this.dailyTotalValues[existingIdx].ticker = this.ticker || '';
    }
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
    this.previousTickerData = null; // Reset - will be set on next advanceDate

    // Record trade
    this.trades.push({
      ticker: this.ticker,
      shares: maxShares,
      openDate: this.currentDate,
      openPrice: price,
      openValue: cost,
    });

    this.advanceDate();
  },

  // Close position
  close() {
    if (!this.ticker || !this.tickerData) return;

    const price = this.getMidpoint(this.tickerData);
    const proceeds = this.shares * price;

    // Find the open trade and update it
    const openTrade = [...this.trades].reverse().find(t => t.ticker === this.ticker && !t.closeDate);
    if (openTrade) {
      openTrade.closeDate = this.currentDate;
      openTrade.closePrice = price;
      openTrade.closeValue = proceeds;
      openTrade.pnl = proceeds - openTrade.openValue;
    }

    this.cash = this.cash + proceeds;
    this.ticker = null;
    this.shares = 0;
    this.previousTickerData = null;

    this.advanceDate();
  },

  // Skip day
  skip() {
    this.advanceDate();
  },

  // Replay - reset simulation to beginning
  replay() {
    this.ticker = null;
    this.shares = 0;
    this.cash = 1000;
    this.selectedTicker = '';
    this.tickerData = null;
    this.previousTickerData = null;
    this.previousDate = null;
    this.trades = [];
    this.expandedTrades = {};
    this.dailyTotalValues = [];
    this.showDetails = false;
    this.detailsAnimated = false;
    this.detailsClosing = false;
    this.detailsOpening = false;
    if (this.dates.length > 0) {
      this.currentDate = this.dates[0];
    }
    this.rerender();
  },

  // Toggle details panel
  toggleDetails() {
    if (this.showDetails) {
      // Animate closing
      this.detailsClosing = true;
      this.rerender();
      setTimeout(() => {
        this.showDetails = false;
        this.detailsAnimated = false;
        this.detailsClosing = false;
        localStorage.setItem('sim-details-expanded', 'false');
        this.rerender();
      }, 1000);
    } else {
      // Animate opening
      this.showDetails = true;
      this.detailsOpening = true;
      this.rerender();
      setTimeout(() => {
        this.detailsOpening = false;
        this.detailsAnimated = true;
        localStorage.setItem('sim-details-expanded', 'true');
        this.rerender();
      }, 1000);
    }
  },

  // Toggle trade expansion
  toggleTrade(index) {
    this.expandedTrades[index] = !this.expandedTrades[index];
    this.rerender();
  },

  // Show share modal
  showShareModal() {
    alert('Please login');
  },

  // Advance to next trading date
  async advanceDate() {
    const nextDate = this.getNextDate();
    if (nextDate) {
      this.previousDate = this.currentDate;
      this.currentDate = nextDate;
      // If we have a position, show that ticker's data and fetch previous day data
      if (this.ticker) {
        this.selectedTicker = this.ticker;
        await this.fetchPreviousTickerData();
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

    // Calculate delta (change from previous trading day)
    let deltaPercent = null;
    if (hasPosition && state.tickerData && state.previousTickerData) {
      const currentMid = this.getMidpoint(state.tickerData);
      const previousMid = this.getMidpoint(state.previousTickerData);
      deltaPercent = ((currentMid - previousMid) / previousMid) * 100;
    }

    // Format number with commas
    const formatMoney = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Format ledger date
    const formatLedgerDate = (dateKey) => {
      const str = String(dateKey);
      const year = str.slice(0, 4);
      const month = str.slice(4, 6);
      const day = str.slice(6, 8);
      return `${year}-${month}-${day}`;
    };

    return `
      <div class="sim-wrapper ${state.showDetails ? 'sim-expanded' : ''}">
      <div class="sim-content">
        <div class="sim-status">
          <div class="sim-header-row">
            <span class="sim-date">${state.currentDate ? this.formatDate(state.currentDate) : 'Loading...'}</span>
            <span class="${deltaPercent !== null ? (deltaPercent >= 0 ? 'sim-delta-up' : 'sim-delta-down') : 'sim-delta-none'}">${deltaPercent !== null ? (deltaPercent >= 0 ? '+' : '') + deltaPercent.toFixed(2) + '%' : ''}</span>
          </div>
          <div class="sim-portfolio-label">Your position:</div>
          <div class="sim-portfolio-grid">
            <div class="sim-portfolio-row">
              <span class="sim-label">Cash:</span>
              <span>${formatMoney(state.cash)}</span>
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
              <span>${hasPosition ? formatMoney(equityValue) : '-'}</span>
            </div>
            <div class="sim-portfolio-row sim-total">
              <span class="sim-label">Total Value:</span>
              <span>${formatMoney(totalValue)}</span>
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
            <div class="sim-ohlc-row"><span>Open:</span> <span>${state.tickerData ? formatMoney(state.tickerData.open) : '-'}</span></div>
            <div class="sim-ohlc-row"><span>High:</span> <span>${state.tickerData ? formatMoney(state.tickerData.high) : '-'}</span></div>
            <div class="sim-ohlc-row"><span>Low:</span> <span>${state.tickerData ? formatMoney(state.tickerData.low) : '-'}</span></div>
            <div class="sim-ohlc-row"><span>Close:</span> <span>${state.tickerData ? formatMoney(state.tickerData.close) : '-'}</span></div>
            <div class="sim-ohlc-row sim-midpoint"><span>Midpoint:</span> <span>${state.tickerData ? formatMoney(this.getMidpoint(state.tickerData)) : '-'}</span></div>
          </div>
        </div>

        ${isEndOfData ? `
          <div class="sim-end">End of simulation data</div>
        ` : `
          <div class="sim-action-buttons">
            ${hasPosition ? `
              <button class="sim-btn sim-btn-sell" id="sim-close-btn" ${!state.tickerData ? 'disabled' : ''}>Sell [↵]</button>
            ` : `
              <button class="sim-btn sim-btn-buy" id="sim-buy-btn" ${!state.tickerData ? 'disabled' : ''}>Buy [↵]</button>
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

        <div class="sim-footer">
          <button class="sim-btn-link" id="sim-replay-btn">↻ Start Over</button>
          <button class="sim-btn-link" id="sim-details-btn">${state.showDetails && !state.detailsOpening ? '<< Hide' : 'Details >>'}</button>
        </div>
      </div>
      ${state.showDetails ? `
        <div class="sim-details ${state.detailsClosing ? 'sim-details-closing' : (state.detailsAnimated ? 'sim-details-no-anim' : '')}">
          <div class="sim-details-top">
            <div class="sim-timeline-header">P&L History</div>
            <div class="sim-timeline">
              ${(() => {
                // Build segments from daily total values
                const segments = [];
                const values = state.dailyTotalValues;

                for (let i = 0; i < values.length; i++) {
                  const entry = values[i];
                  const isToday = entry.date === state.currentDate;
                  let color = 'neutral';

                  if (i > 0) {
                    const prevValue = values[i - 1].value;
                    const currValue = entry.value;
                    if (currValue > prevValue) {
                      color = 'up';
                    } else if (currValue < prevValue) {
                      color = 'down';
                    }
                  }

                  segments.push({ date: entry.date, isToday, color });
                }

                return segments.length > 0 ? `
                  <div class="sim-timeline-segments" onmouseover="simulatorCard.handleMouseOver(event)" onmouseout="simulatorCard.handleMouseOut(event)">
                    ${segments.map((seg, i) => {
                      const entry = values[i];
                      const prevValue = i > 0 ? values[i - 1].value : entry.value;
                      const change = entry.value - prevValue;
                      const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0;
                      const dateStr = String(entry.date);
                      const formattedDate = dateStr.slice(0, 4) + '/' + dateStr.slice(4, 6) + '/' + dateStr.slice(6, 8);
                      const pnlText = (change >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';
                      const infoClass = change >= 0 ? 'up' : 'down';
                      const ticker = entry.ticker || '-';
                      return `
                        <div class="sim-timeline-segment sim-timeline-${seg.color}" data-info-date="${formattedDate}" data-info-ticker="${ticker}" data-info-pnl="${pnlText}" data-info-class="${infoClass}">
                          ${seg.isToday ? '<span class="sim-timeline-arrow">▼</span>' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : '<div class="sim-timeline-empty">Start trading to see history</div>';
              })()}
            </div>
            ${(() => {
              const values = state.dailyTotalValues;
              if (values.length === 0) return '<div class="sim-timeline-info" id="sim-timeline-info"></div>';
              const todayIdx = values.findIndex(v => v.date === state.currentDate);
              if (todayIdx === -1) return '<div class="sim-timeline-info" id="sim-timeline-info"></div>';
              const entry = values[todayIdx];
              const prevValue = todayIdx > 0 ? values[todayIdx - 1].value : entry.value;
              const change = entry.value - prevValue;
              const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0;
              const dateStr = String(entry.date);
              const formattedDate = dateStr.slice(0, 4) + '/' + dateStr.slice(4, 6) + '/' + dateStr.slice(6, 8);
              const pnlText = (change >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';
              const infoClass = change >= 0 ? 'up' : 'down';
              const ticker = entry.ticker || '-';
              return `
                <div class="sim-timeline-info" id="sim-timeline-info">
                  <span class="sim-timeline-info-date">${formattedDate}</span>
                  <span class="sim-timeline-info-ticker">${ticker}</span>
                  <span class="sim-timeline-info-pnl ${infoClass}">${pnlText}</span>
                </div>
              `;
            })()}
          </div>
          <div class="sim-details-bottom">
            <div class="sim-ledger-header-row">
              <span class="sim-ledger-header">Position History</span>
              <button class="sim-share-btn" id="sim-share-btn">↗ Share</button>
            </div>
            <div class="sim-ledger-scroll">
              <div class="sim-ledger">
                ${state.trades.length === 0 ? `
                  <div class="sim-ledger-empty">No trades yet</div>
                ` : `
                  ${[...state.trades].reverse().map((trade, reverseIdx) => {
                  const idx = state.trades.length - 1 - reverseIdx;
                  const isExpanded = state.expandedTrades[idx];
                  const isClosed = !!trade.closeDate;
                  const currentPrice = !isClosed && state.ticker === trade.ticker && state.tickerData ? this.getMidpoint(state.tickerData) : null;
                  const currentValue = currentPrice ? trade.shares * currentPrice : null;
                  const unrealizedPnl = currentValue ? currentValue - trade.openValue : null;
                  const pnlPercent = isClosed ? ((trade.pnl / trade.openValue) * 100) : (unrealizedPnl ? ((unrealizedPnl / trade.openValue) * 100) : null);

                  return `
                    <div class="sim-trade-row">
                      <div class="sim-trade-header" data-trade-idx="${idx}">
                        <span class="sim-trade-toggle">${isExpanded ? '▼' : '▶'}</span>
                        <span class="sim-trade-date">${formatLedgerDate(trade.openDate)}</span>
                        <span class="sim-trade-ticker">${trade.ticker}</span>
                        <span class="sim-trade-status ${isClosed ? '' : 'sim-trade-open'}">${isClosed ? 'Closed' : 'Open'}</span>
                      </div>
                      ${isExpanded ? `
                        <div class="sim-trade-details">
                          <div class="sim-trade-detail-row">
                            <span>Shares:</span>
                            <span>${trade.shares.toFixed(1)}</span>
                          </div>
                          <div class="sim-trade-detail-row">
                            <span>Open Price:</span>
                            <span>${formatMoney(trade.openPrice)}</span>
                          </div>
                          <div class="sim-trade-detail-row">
                            <span>${isClosed ? 'Close Price:' : 'Current Price:'}</span>
                            <span>${isClosed ? formatMoney(trade.closePrice) : (currentPrice ? formatMoney(currentPrice) : '-')}</span>
                          </div>
                          <div class="sim-trade-detail-row">
                            <span>Open Value:</span>
                            <span>${formatMoney(trade.openValue)}</span>
                          </div>
                          <div class="sim-trade-detail-row">
                            <span>${isClosed ? 'Close Value:' : 'Current Value:'}</span>
                            <span>${isClosed ? formatMoney(trade.closeValue) : (currentValue ? formatMoney(currentValue) : '-')}</span>
                          </div>
                          <div class="sim-trade-detail-row sim-trade-pnl">
                            <span>P&L:</span>
                            <span class="${(isClosed ? trade.pnl : unrealizedPnl) !== null ? ((isClosed ? trade.pnl : unrealizedPnl) >= 0 ? 'sim-delta-up' : 'sim-delta-down') : ''}">${
                              isClosed
                                ? (trade.pnl >= 0 ? '+' : '') + formatMoney(trade.pnl) + ' (' + (pnlPercent >= 0 ? '+' : '') + pnlPercent.toFixed(2) + '%)'
                                : (unrealizedPnl !== null
                                    ? (unrealizedPnl >= 0 ? '+' : '') + formatMoney(unrealizedPnl) + ' (' + (pnlPercent >= 0 ? '+' : '') + pnlPercent.toFixed(2) + '%)'
                                    : '-')
                            }</span>
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `;
                  }).join('')}
                `}
              </div>
            </div>
          </div>
        </div>
      ` : ''}
      </div>
    `;
  },

  styles: `
    .sim-wrapper {
      display: flex;
      align-items: flex-start;
    }

    .sim-content {
      padding: 12px;
      font-size: 11px;
      width: 396px;
      flex-shrink: 0;
    }

    .sim-details {
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--window-border);
      border-top: 1px solid var(--window-border);
      border-right: 1px solid var(--window-border);
      border-bottom: 1px solid var(--window-border);
      flex-shrink: 0;
      width: 0;
      overflow: hidden;
      animation: sim-slide-out 1s ease forwards;
      height: var(--sim-content-height, auto);
    }

    @keyframes sim-slide-out {
      from {
        width: 0;
      }
      to {
        width: 300px;
      }
    }

    .sim-details-no-anim {
      animation: none;
      width: 300px;
    }

    .sim-details-closing {
      animation: sim-slide-in 1s ease forwards;
    }

    @keyframes sim-slide-in {
      from {
        width: 300px;
      }
      to {
        width: 0;
      }
    }

    .sim-details-top {
      flex: 0 0 auto;
      border-bottom: 1px solid var(--window-border);
      height: 170px;
      background: #fff;
      width: 300px;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      padding: 10px;
    }

    .sim-timeline-header {
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 4px;
      flex-shrink: 0;
    }

    .sim-timeline-info {
      height: 20px;
      font-size: 10px;
      padding: 4px 0 0 0;
      white-space: nowrap;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sim-timeline-info-date {
      color: var(--text-color);
      flex: 1;
      text-align: left;
    }

    .sim-timeline-info-ticker {
      color: var(--text-color);
      font-weight: bold;
      flex: 1;
      text-align: center;
    }

    .sim-timeline-info-pnl {
      flex: 1;
      text-align: right;
    }

    .sim-timeline-info-pnl.up {
      color: #00c853;
    }

    .sim-timeline-info-pnl.down {
      color: #ff1744;
    }

    .sim-timeline {
      flex: 1;
      overflow-x: auto;
      display: flex;
      align-items: flex-end;
      padding-top: 10px;
    }

    .sim-timeline-segments {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 100%;
    }

    .sim-timeline-segment {
      width: 10px;
      height: 100px;
      position: relative;
      flex-shrink: 0;
      cursor: pointer;
      transition: height 0.1s ease;
    }

    .sim-timeline-segment:hover {
      height: 110px;
    }

    .sim-timeline-hover-arrow {
      display: none;
    }

    .sim-timeline-up {
      background: #00c853;
    }

    .sim-timeline-down {
      background: #ff1744;
    }

    .sim-timeline-neutral {
      background: #999;
    }

    .sim-timeline-arrow {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 0;
      font-size: 12px;
      color: var(--text-color);
    }

    .sim-timeline-empty {
      color: #666;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .sim-details-bottom {
      flex: 1;
      min-height: 0;
      padding: 8px;
      display: flex;
      flex-direction: column;
      background: #fff;
      width: 300px;
      min-width: 300px;
    }

    .sim-ledger-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }

    .sim-ledger-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .sim-ledger-header {
      font-weight: bold;
      font-size: 11px;
    }

    .sim-share-btn {
      font-family: inherit;
      font-size: 11px;
      padding: 6px 12px;
      border: 2px solid #0066d6;
      background: #007aff;
      color: white;
      cursor: pointer;
    }

    .sim-share-btn:hover {
      background: #0066d6;
    }

    .sim-ledger-empty {
      color: #666;
      font-size: 11px;
      text-align: center;
      padding: 20px;
    }

    .sim-ledger-table {
      width: 100%;
      font-size: 10px;
      border-collapse: collapse;
    }

    .sim-ledger-table th,
    .sim-ledger-table td {
      padding: 4px 6px;
      text-align: left;
      border-bottom: 1px solid var(--window-border);
    }

    .sim-ledger-table th {
      font-weight: bold;
      background: var(--input-bg);
    }

    .sim-trade-row {
      border-bottom: 1px solid var(--window-border);
    }

    .sim-trade-row:last-child {
      border-bottom: none;
    }

    .sim-trade-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      cursor: pointer;
      font-size: 10px;
    }

    .sim-trade-header:hover {
      background: var(--hover-bg);
    }

    .sim-trade-toggle {
      font-size: 8px;
      width: 10px;
    }

    .sim-trade-date {
      color: #666;
    }

    .sim-trade-ticker {
      font-weight: bold;
    }

    .sim-trade-status {
      margin-left: auto;
      font-size: 9px;
      color: #666;
    }

    .sim-trade-open {
      color: #00c853;
    }

    .sim-trade-details {
      padding: 4px 8px 8px 22px;
      font-size: 10px;
    }

    .sim-trade-detail-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
    }

    .sim-trade-detail-row span:first-child {
      color: #666;
    }

    .sim-trade-pnl {
      border-top: 1px solid var(--window-border);
      margin-top: 4px;
      padding-top: 4px;
      font-weight: bold;
    }

    .sim-status {
      margin-bottom: 8px;
    }

    .sim-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .sim-date {
      font-size: 14px;
      font-weight: bold;
    }

    .sim-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid var(--window-border);
    }

    .sim-btn-link {
      font-family: inherit;
      font-size: 10px;
      padding: 2px 6px;
      border: none;
      background: transparent;
      color: var(--text-color);
      cursor: pointer;
    }

    .sim-btn-link:hover {
      background: var(--hover-bg);
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

    .sim-delta-up {
      color: #00c853;
    }

    .sim-delta-down {
      color: #ff1744;
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
      const wrapperEl = windowEl.querySelector('.sim-wrapper');
      if (wrapperEl) {
        wrapperEl.outerHTML = simulatorCard.content();

        // Set CSS variable for details height to match content
        if (this.showDetails) {
          const newWrapper = windowEl.querySelector('.sim-wrapper');
          const newContentEl = newWrapper ? newWrapper.querySelector('.sim-content') : null;
          if (newWrapper && newContentEl) {
            newWrapper.style.setProperty('--sim-content-height', newContentEl.offsetHeight + 'px');
          }
        }

        // Scroll timeline to the end (show today)
        const timeline = windowEl.querySelector('.sim-timeline');
        if (timeline) {
          timeline.scrollLeft = timeline.scrollWidth;
        }
      }
    }
  },

  async init(system) {
    simulatorCard.ticker = null;
    simulatorCard.shares = 0;
    simulatorCard.cash = 1000;
    simulatorCard.selectedTicker = '';
    simulatorCard.tickerData = null;
    simulatorCard.previousTickerData = null;
    simulatorCard.previousDate = null;
    simulatorCard.loading = false;
    simulatorCard.showFastForward = false;
    simulatorCard.showDetails = localStorage.getItem('sim-details-expanded') === 'true';
    simulatorCard.detailsAnimated = simulatorCard.showDetails;
    simulatorCard.detailsClosing = false;
    simulatorCard.detailsOpening = false;
    simulatorCard.trades = [];
    simulatorCard.expandedTrades = {};
    simulatorCard.dailyTotalValues = [];
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

    // Default to first ticker if none selected
    if (!simulatorCard.selectedTicker && simulatorCard.tickers.length > 0) {
      simulatorCard.selectedTicker = simulatorCard.tickers[0];
      simulatorCard.fetchTickerData(simulatorCard.selectedTicker);
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
    if (e.target.id === 'sim-replay-btn') {
      e.preventDefault();
      this.replay();
      return;
    }
    if (e.target.id === 'sim-details-btn') {
      e.preventDefault();
      this.toggleDetails();
      return;
    }
    if (e.target.id === 'sim-share-btn') {
      e.preventDefault();
      this.showShareModal();
      return;
    }
    if (e.target.classList.contains('sim-ff-date')) {
      e.preventDefault();
      const dateKey = parseInt(e.target.dataset.date, 10);
      this.jumpToDate(dateKey);
      return;
    }
    // Handle trade row expansion
    const tradeHeader = e.target.closest('.sim-trade-header');
    if (tradeHeader) {
      e.preventDefault();
      const idx = parseInt(tradeHeader.dataset.tradeIdx, 10);
      this.toggleTrade(idx);
      return;
    }
  },

  handleMouseOver(e) {
    const segment = e.target.closest('.sim-timeline-segment');
    if (segment) {
      const date = segment.dataset.infoDate;
      const ticker = segment.dataset.infoTicker;
      const pnl = segment.dataset.infoPnl;
      const infoClass = segment.dataset.infoClass;
      const infoEl = document.getElementById('sim-timeline-info');
      if (infoEl && date) {
        infoEl.innerHTML = '<span class="sim-timeline-info-date">' + date + '</span> <span class="sim-timeline-info-ticker">' + ticker + '</span> <span class="sim-timeline-info-pnl ' + infoClass + '">' + pnl + '</span>';
      }
    }
  },

  handleMouseOut(e) {
    const segment = e.target.closest('.sim-timeline-segment');
    if (segment) {
      const infoEl = document.getElementById('sim-timeline-info');
      if (infoEl) {
        infoEl.innerHTML = '';
      }
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
    if (e.key === 'Enter') {
      e.preventDefault();
      const hasPosition = this.ticker !== null;
      const btn = document.getElementById(hasPosition ? 'sim-close-btn' : 'sim-buy-btn');
      if (btn && !btn.disabled) {
        btn.classList.add('sim-btn-blink');
        setTimeout(() => {
          if (hasPosition) {
            this.close();
          } else {
            this.buy();
          }
        }, 100);
      }
    }
  },

  boot() {},
};
