import { store } from '../../store.js';

// Mock data for the simulator
const mockTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'];

// Generate mock dates (trading days for 2024)
const generateDates = () => {
  const dates = [];
  const start = new Date('2024-01-02');
  const end = new Date('2024-12-31');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(parseInt(`${year}${month}${day}`, 10));
    }
  }
  return dates;
};

// Generate mock price data for a ticker on a date
const generatePriceData = (ticker, dateKey) => {
  // Use ticker and date to seed pseudo-random values
  const seed = (ticker.charCodeAt(0) * 1000 + dateKey) % 10000;
  const basePrice = {
    'AAPL': 185,
    'MSFT': 378,
    'GOOGL': 141,
    'AMZN': 178,
    'NVDA': 495,
    'META': 485,
    'TSLA': 248,
  }[ticker] || 100;

  const variance = (seed % 100) / 100 * 10 - 5; // -5 to +5
  const open = basePrice + variance;
  const dailyMove = (seed % 50) / 100 * 4 - 2; // -2% to +2%
  const high = open * (1 + Math.abs(dailyMove) / 100 + 0.01);
  const low = open * (1 - Math.abs(dailyMove) / 100 - 0.01);
  const close = open * (1 + dailyMove / 100);

  return {
    ticker,
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
    volume: Math.floor(1000000 + (seed % 5000000)),
  };
};

export const AppSimulator = {
  template: `
    <div class="simulator-content">
      <div class="sim-main">
        <div class="sim-status">
          <div class="sim-header-row">
            <span class="sim-date">{{ formatDate(state.currentDate) }}</span>
            <span :class="deltaClass">{{ deltaText }}</span>
          </div>
          <div class="sim-portfolio-label">Your position:</div>
          <div class="sim-portfolio-grid">
            <div class="sim-portfolio-row">
              <span class="sim-label">Cash:</span>
              <span>{{ formatMoney(state.cash) }}</span>
            </div>
            <div class="sim-portfolio-row">
              <span class="sim-label">Ticker:</span>
              <span>{{ state.ticker || '-' }}</span>
            </div>
            <div class="sim-portfolio-row">
              <span class="sim-label">Shares:</span>
              <span>{{ hasPosition ? state.shares.toFixed(1) : '-' }}</span>
            </div>
            <div class="sim-portfolio-row">
              <span class="sim-label">Equity Value:</span>
              <span>{{ hasPosition ? formatMoney(equityValue) : '-' }}</span>
            </div>
            <div class="sim-portfolio-row sim-total">
              <span class="sim-label">Total Value:</span>
              <span>{{ formatMoney(totalValue) }}</span>
            </div>
          </div>
        </div>

        <hr class="sim-divider">

        <div class="sim-inquiry">
          <div class="sim-inquiry-header">
            <label class="sim-label">Quote:</label>
            <select class="sim-select" v-model="state.selectedTicker" @change="fetchTickerData">
              <option value="">Select...</option>
              <option v-for="t in tickers" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="sim-ohlc">
            <div class="sim-ohlc-row"><span>Open:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.open) : '-' }}</span></div>
            <div class="sim-ohlc-row"><span>High:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.high) : '-' }}</span></div>
            <div class="sim-ohlc-row"><span>Low:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.low) : '-' }}</span></div>
            <div class="sim-ohlc-row"><span>Close:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.close) : '-' }}</span></div>
            <div class="sim-ohlc-row sim-midpoint"><span>Midpoint:</span> <span>{{ state.tickerData ? formatMoney(getMidpoint(state.tickerData)) : '-' }}</span></div>
          </div>
        </div>

        <div v-if="isEndOfData" class="sim-end">End of simulation data</div>
        <div v-else class="sim-action-buttons">
          <button v-if="hasPosition" class="sim-btn sim-btn-sell" @click="close" :disabled="!state.tickerData">Sell <kbd>(Space)</kbd></button>
          <button v-else class="sim-btn sim-btn-buy" @click="buy" :disabled="!state.tickerData">Buy <kbd>(Space)</kbd></button>
          <button class="sim-btn sim-btn-secondary" @click="skip">Next Day <kbd>(Enter)</kbd></button>
        </div>

        <div v-if="!isEndOfData" class="sim-fastforward">
          <div class="sim-fastforward-header">Skip to next 30 trading days:</div>
          <div class="sim-fastforward-list">
            <button
              v-for="d in nextDates"
              :key="d"
              class="sim-ff-date"
              @click="jumpToDate(d)"
            >{{ formatDateShort(d) }}</button>
          </div>
        </div>

        <div class="sim-footer">
          <button class="sim-btn-link" @click="replay">Start Over</button>
          <button class="sim-btn-link" @click="toggleDetails">{{ state.showDetails ? '<< Hide' : 'Details >>' }}</button>
        </div>
      </div>

      <div v-if="state.showDetails || state.detailsClosing" class="sim-details" :class="{ 'sim-details-no-anim': state.detailsAnimated, 'sim-details-closing': state.detailsClosing }">
        <div class="sim-details-top">
          <div class="sim-timeline-header">P&L History</div>
          <div class="sim-timeline">
            <div v-if="state.dailyTotalValues.length > 0" class="sim-timeline-segments">
              <div
                v-for="(seg, i) in timelineSegments"
                :key="i"
                class="sim-timeline-segment"
                :class="'sim-timeline-' + seg.color"
                @mouseenter="showTimelineInfo(seg)"
                @mouseleave="hideTimelineInfo"
              >
                <span v-if="seg.isToday" class="sim-timeline-arrow">v</span>
              </div>
            </div>
            <div v-else class="sim-timeline-empty">Start trading to see history</div>
          </div>
          <div class="sim-timeline-info">
            <span class="sim-timeline-info-date">{{ timelineInfo.date }}</span>
            <span class="sim-timeline-info-ticker">{{ timelineInfo.ticker }}</span>
            <span class="sim-timeline-info-pnl" :class="timelineInfo.pnlClass">{{ timelineInfo.pnl }}</span>
          </div>
        </div>
        <div class="sim-details-bottom">
          <div class="sim-ledger-header-row">
            <span class="sim-ledger-header">Position History</span>
          </div>
          <div class="sim-ledger-scroll">
            <div class="sim-ledger">
              <div v-if="state.trades.length === 0" class="sim-ledger-empty">No trades yet</div>
              <details v-for="(trade, idx) in reversedTrades" :key="idx" class="sim-trade-row">
                <summary class="sim-trade-header">
                  <span class="sim-trade-date">{{ formatLedgerDate(trade.openDate) }}{{ trade.closeDate ? ' to ' + formatLedgerDate(trade.closeDate) : '' }}</span>
                  <span class="sim-trade-ticker">{{ trade.ticker }}</span>
                  <span class="sim-trade-status" :class="{ 'sim-trade-open': !trade.closeDate }">{{ trade.closeDate ? 'Closed' : 'Open' }}</span>
                </summary>
                <div class="sim-trade-details">
                  <div class="sim-trade-detail-row">
                    <span>Shares:</span>
                    <span>{{ trade.shares.toFixed(1) }}</span>
                  </div>
                  <div class="sim-trade-detail-row">
                    <span>Open Price:</span>
                    <span>{{ formatMoney(trade.openPrice) }}</span>
                  </div>
                  <div class="sim-trade-detail-row">
                    <span>{{ trade.closeDate ? 'Close Price:' : 'Current Price:' }}</span>
                    <span>{{ trade.closeDate ? formatMoney(trade.closePrice) : (getCurrentPrice(trade) ? formatMoney(getCurrentPrice(trade)) : '-') }}</span>
                  </div>
                  <div class="sim-trade-detail-row sim-trade-pnl">
                    <span>P&L:</span>
                    <span :class="getPnlClass(trade)">{{ getPnlText(trade) }}</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const dates = generateDates();
    const tickers = mockTickers;

    const state = Vue.reactive({
      ticker: null,
      shares: 0,
      cash: 1000,
      currentDate: dates[0],
      previousDate: null,
      selectedTicker: 'AAPL',
      tickerData: null,
      previousTickerData: null,
      trades: [],
      dailyTotalValues: [],
      showDetails: false,
      detailsAnimated: false,
      detailsClosing: false,
    });

    const timelineInfo = Vue.reactive({
      date: '',
      ticker: '',
      pnl: '',
      pnlClass: '',
    });

    // Computed properties
    const hasPosition = Vue.computed(() => state.ticker !== null);
    const isEndOfData = Vue.computed(() => dates.length > 0 && state.currentDate === dates[dates.length - 1]);

    const equityValue = Vue.computed(() => {
      if (hasPosition.value && state.tickerData) {
        return state.shares * getMidpoint(state.tickerData);
      }
      return 0;
    });

    const totalValue = Vue.computed(() => state.cash + equityValue.value);

    const deltaPercent = Vue.computed(() => {
      if (hasPosition.value && state.tickerData && state.previousTickerData) {
        const currentMid = getMidpoint(state.tickerData);
        const previousMid = getMidpoint(state.previousTickerData);
        return ((currentMid - previousMid) / previousMid) * 100;
      }
      return null;
    });

    const deltaClass = Vue.computed(() => {
      if (deltaPercent.value === null) return 'sim-delta-none';
      return deltaPercent.value >= 0 ? 'sim-delta-up' : 'sim-delta-down';
    });

    const deltaText = Vue.computed(() => {
      if (deltaPercent.value === null) return '';
      return (deltaPercent.value >= 0 ? '+' : '') + deltaPercent.value.toFixed(2) + '%';
    });

    const nextDates = Vue.computed(() => {
      const currentIndex = dates.indexOf(state.currentDate);
      const endIndex = Math.min(currentIndex + 31, dates.length);
      return dates.slice(currentIndex + 1, endIndex);
    });

    const reversedTrades = Vue.computed(() => [...state.trades].reverse());

    const timelineSegments = Vue.computed(() => {
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

        const prevValue = i > 0 ? values[i - 1].value : entry.value;
        const change = entry.value - prevValue;
        const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0;
        const pnlText = (change >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';

        segments.push({
          date: entry.date,
          isToday,
          color,
          ticker: entry.ticker || '-',
          pnlText,
          pnlClass: change >= 0 ? 'up' : 'down',
        });
      }

      return segments;
    });

    // Methods
    const getMidpoint = (data) => (data.high + data.low) / 2;

    const formatMoney = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const formatDate = (dateKey) => {
      if (!dateKey) return 'Loading...';
      const str = String(dateKey);
      const year = str.slice(0, 4);
      const month = parseInt(str.slice(4, 6), 10);
      const day = parseInt(str.slice(6, 8), 10);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return `The day is ${year} ${monthNames[month - 1]} ${day}`;
    };

    const formatDateShort = (dateKey) => {
      const str = String(dateKey);
      const month = parseInt(str.slice(4, 6), 10);
      const day = parseInt(str.slice(6, 8), 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[month - 1]} ${day}`;
    };

    const formatLedgerDate = (dateKey) => {
      const str = String(dateKey);
      return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
    };

    const fetchTickerData = () => {
      if (!state.selectedTicker || !state.currentDate) {
        state.tickerData = null;
        return;
      }
      state.tickerData = generatePriceData(state.selectedTicker, state.currentDate);
      recordDailyValue();
    };

    const fetchPreviousTickerData = () => {
      if (!state.ticker || !state.previousDate) {
        state.previousTickerData = null;
        return;
      }
      state.previousTickerData = generatePriceData(state.ticker, state.previousDate);
    };

    const recordDailyValue = () => {
      const eqValue = state.ticker && state.tickerData ? state.shares * getMidpoint(state.tickerData) : 0;
      const total = state.cash + eqValue;

      const existingIdx = state.dailyTotalValues.findIndex(d => d.date === state.currentDate);
      if (existingIdx === -1) {
        state.dailyTotalValues.push({ date: state.currentDate, value: total, ticker: state.ticker || '' });
      } else {
        state.dailyTotalValues[existingIdx].value = total;
        state.dailyTotalValues[existingIdx].ticker = state.ticker || '';
      }
    };

    const getNextDate = () => {
      const currentIndex = dates.indexOf(state.currentDate);
      if (currentIndex < dates.length - 1) {
        return dates[currentIndex + 1];
      }
      return null;
    };

    const getPreviousDate = () => {
      const currentIndex = dates.indexOf(state.currentDate);
      if (currentIndex > 0) {
        return dates[currentIndex - 1];
      }
      return null;
    };

    const advanceDate = () => {
      const nextDate = getNextDate();
      if (nextDate) {
        state.previousDate = state.currentDate;
        state.currentDate = nextDate;
        if (state.ticker) {
          state.selectedTicker = state.ticker;
          fetchPreviousTickerData();
        }
        if (state.selectedTicker) {
          fetchTickerData();
        } else {
          state.tickerData = null;
        }
      }
    };

    const buy = () => {
      if (!state.tickerData || state.ticker) return;

      const price = getMidpoint(state.tickerData);
      const maxShares = Math.floor((state.cash / price) * 10) / 10;
      const cost = maxShares * price;

      state.ticker = state.selectedTicker;
      state.shares = maxShares;
      state.cash = state.cash - cost;
      state.previousTickerData = null;

      state.trades.push({
        ticker: state.ticker,
        shares: maxShares,
        openDate: state.currentDate,
        openPrice: price,
        openValue: cost,
      });

      advanceDate();
    };

    const close = () => {
      if (!state.ticker || !state.tickerData) return;

      const price = getMidpoint(state.tickerData);
      const proceeds = state.shares * price;

      const tradeIdx = state.trades.findIndex(t => t.ticker === state.ticker && !t.closeDate);
      if (tradeIdx !== -1) {
        const openTrade = state.trades[tradeIdx];
        openTrade.closeDate = state.currentDate;
        openTrade.closePrice = price;
        openTrade.closeValue = proceeds;
        openTrade.pnl = proceeds - openTrade.openValue;
      }

      state.cash = state.cash + proceeds;
      state.ticker = null;
      state.shares = 0;
      state.previousTickerData = null;

      advanceDate();
    };

    const skip = () => {
      advanceDate();
    };

    const jumpToDate = (dateKey) => {
      state.currentDate = dateKey;
      state.previousDate = getPreviousDate();
      if (state.ticker) {
        state.selectedTicker = state.ticker;
        fetchPreviousTickerData();
      }
      if (state.selectedTicker) {
        fetchTickerData();
      } else {
        state.tickerData = null;
      }
    };

    const replay = () => {
      state.ticker = null;
      state.shares = 0;
      state.cash = 1000;
      state.selectedTicker = 'AAPL';
      state.tickerData = null;
      state.previousTickerData = null;
      state.previousDate = null;
      state.trades = [];
      state.dailyTotalValues = [];
      state.currentDate = dates[0];
      fetchTickerData();
    };

    const toggleDetails = () => {
      if (state.showDetails) {
        // Closing - animate first, then hide
        state.detailsClosing = true;
        setTimeout(() => {
          state.showDetails = false;
          state.detailsAnimated = false;
          state.detailsClosing = false;
        }, 500);
      } else {
        // Opening
        state.showDetails = true;
        setTimeout(() => {
          state.detailsAnimated = true;
        }, 500);
      }
    };

    const getCurrentPrice = (trade) => {
      if (trade.closeDate) return null;
      if (state.ticker === trade.ticker && state.tickerData) {
        return getMidpoint(state.tickerData);
      }
      return null;
    };

    const getPnlClass = (trade) => {
      if (trade.closeDate) {
        return trade.pnl >= 0 ? 'sim-delta-up' : 'sim-delta-down';
      }
      const currentPrice = getCurrentPrice(trade);
      if (currentPrice !== null) {
        const unrealizedPnl = (currentPrice * trade.shares) - trade.openValue;
        return unrealizedPnl >= 0 ? 'sim-delta-up' : 'sim-delta-down';
      }
      return '';
    };

    const getPnlText = (trade) => {
      if (trade.closeDate) {
        const pnlPercent = (trade.pnl / trade.openValue) * 100;
        return (trade.pnl >= 0 ? '+' : '') + formatMoney(trade.pnl) + ' (' + (pnlPercent >= 0 ? '+' : '') + pnlPercent.toFixed(2) + '%)';
      }
      const currentPrice = getCurrentPrice(trade);
      if (currentPrice !== null) {
        const unrealizedPnl = (currentPrice * trade.shares) - trade.openValue;
        const pnlPercent = (unrealizedPnl / trade.openValue) * 100;
        return (unrealizedPnl >= 0 ? '+' : '') + formatMoney(unrealizedPnl) + ' (' + (pnlPercent >= 0 ? '+' : '') + pnlPercent.toFixed(2) + '%)';
      }
      return '-';
    };

    const showTimelineInfo = (seg) => {
      const str = String(seg.date);
      timelineInfo.date = str.slice(0, 4) + '/' + str.slice(4, 6) + '/' + str.slice(6, 8);
      timelineInfo.ticker = seg.ticker;
      timelineInfo.pnl = seg.pnlText;
      timelineInfo.pnlClass = seg.pnlClass;
    };

    const hideTimelineInfo = () => {
      // Show current day info
      const currentSeg = timelineSegments.value.find(s => s.isToday);
      if (currentSeg) {
        showTimelineInfo(currentSeg);
      } else {
        timelineInfo.date = '';
        timelineInfo.ticker = '';
        timelineInfo.pnl = '';
        timelineInfo.pnlClass = '';
      }
    };

    // Keyboard shortcuts
    const handleKeydown = (e) => {
      if (store.activeWindow !== 'simulator') return;
      if (isEndOfData.value) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (hasPosition.value) {
          close();
        } else if (state.tickerData) {
          buy();
        }
      } else if (e.code === 'Enter') {
        e.preventDefault();
        skip();
      }
    };

    // Initialize
    Vue.onMounted(() => {
      fetchTickerData();
      window.addEventListener('keydown', handleKeydown);
    });

    Vue.onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      store,
      state,
      tickers,
      timelineInfo,
      hasPosition,
      isEndOfData,
      equityValue,
      totalValue,
      deltaClass,
      deltaText,
      nextDates,
      reversedTrades,
      timelineSegments,
      getMidpoint,
      formatMoney,
      formatDate,
      formatDateShort,
      formatLedgerDate,
      fetchTickerData,
      buy,
      close,
      skip,
      jumpToDate,
      replay,
      toggleDetails,
      getCurrentPrice,
      getPnlClass,
      getPnlText,
      showTimelineInfo,
      hideTimelineInfo,
    };
  },
};
