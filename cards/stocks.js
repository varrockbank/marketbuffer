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
      const rows = state.ohlcData.data.map(d => `
        <tr>
          <td>${d.period}</td>
          <td>${d.open.toFixed(2)}</td>
          <td>${d.high.toFixed(2)}</td>
          <td>${d.low.toFixed(2)}</td>
          <td>${d.close.toFixed(2)}</td>
          <td>${(d.volume / 1000000).toFixed(1)}M</td>
        </tr>
      `).join('');

      dataContent = `
        <div class="stock-table-container">
          <table class="stock-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
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

    .stock-table-container {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid var(--window-border);
    }

    .stock-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }

    .stock-table th,
    .stock-table td {
      padding: 4px 8px;
      text-align: right;
      border-bottom: 1px solid var(--hover-bg);
    }

    .stock-table th {
      background: var(--hover-bg);
      font-weight: bold;
      position: sticky;
      top: 0;
    }

    .stock-table td:first-child,
    .stock-table th:first-child {
      text-align: left;
    }

    .stock-table tbody tr:hover {
      background: var(--hover-bg);
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

  boot() {
    // Nothing on boot
  },
};
