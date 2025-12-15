import { store } from '../../store.js';
import { useStyles } from '../../lib/useStyles.js';

// Keep only CSS that cannot be done with Tailwind (keyframes, pseudo-elements, complex selectors)
const styles = `
/* Slide animations for details panel */
.sim-details {
  animation: sim-slide-out 0.5s ease forwards;
}
@keyframes sim-slide-out {
  from { width: 0; }
  to { width: 280px; }
}
.sim-details-no-anim {
  animation: none;
  width: 280px;
}
.sim-details-closing {
  animation: sim-slide-in 0.5s ease forwards;
}
@keyframes sim-slide-in {
  from { width: 280px; }
  to { width: 0; }
}

/* Trade row expand/collapse marker */
.sim-trade-header::-webkit-details-marker {
  display: none;
}
.sim-trade-header::before {
  content: '>';
  font-size: 8px;
  width: 10px;
  flex-shrink: 0;
}
.sim-trade-row[open] .sim-trade-header::before {
  content: 'v';
}

/* Timeline segment hover */
.sim-timeline-segment:hover {
  height: 90px;
}
`;

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
    <div class="flex overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div class="p-3 text-[11px] w-[380px] shrink-0 overflow-y-auto bg-[var(--bg-primary)]">
        <div class="mb-2">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-bold">{{ formatDate(state.currentDate) }}</span>
            <span :class="deltaClass">{{ deltaText }}</span>
          </div>
          <div class="mt-2 mb-1 font-bold">Your position:</div>
          <div class="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5">
            <div class="contents">
              <span class="text-[var(--text-primary)] opacity-70 mr-1">Cash:</span>
              <span class="text-right">{{ formatMoney(state.cash) }}</span>
            </div>
            <div class="contents">
              <span class="text-[var(--text-primary)] opacity-70 mr-1">Ticker:</span>
              <span class="text-right">{{ state.ticker || '-' }}</span>
            </div>
            <div class="contents">
              <span class="text-[var(--text-primary)] opacity-70 mr-1">Shares:</span>
              <span class="text-right">{{ hasPosition ? state.shares.toFixed(1) : '-' }}</span>
            </div>
            <div class="contents">
              <span class="text-[var(--text-primary)] opacity-70 mr-1">Equity Value:</span>
              <span class="text-right">{{ hasPosition ? formatMoney(equityValue) : '-' }}</span>
            </div>
            <div class="contents border-t border-[var(--border-color)] font-bold">
              <span class="text-[var(--text-primary)] opacity-70 mr-1 pt-1">Total Value:</span>
              <span class="text-right pt-1">{{ formatMoney(totalValue) }}</span>
            </div>
          </div>
        </div>

        <hr class="border-none border-t border-[var(--border-color)] my-2">

        <div>
          <div class="flex items-center gap-2 mb-2">
            <label class="text-[var(--text-primary)] opacity-70 mr-1">Quote:</label>
            <select class="flex-1 text-[11px] p-1 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded" v-model="state.selectedTicker" @change="fetchTickerData">
              <option value="">Select...</option>
              <option v-for="t in tickers" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="py-2">
            <div class="flex justify-between py-0.5 text-[var(--text-primary)]"><span class="opacity-70">Open:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.open) : '-' }}</span></div>
            <div class="flex justify-between py-0.5 text-[var(--text-primary)]"><span class="opacity-70">High:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.high) : '-' }}</span></div>
            <div class="flex justify-between py-0.5 text-[var(--text-primary)]"><span class="opacity-70">Low:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.low) : '-' }}</span></div>
            <div class="flex justify-between py-0.5 text-[var(--text-primary)]"><span class="opacity-70">Close:</span> <span>{{ state.tickerData ? formatMoney(state.tickerData.close) : '-' }}</span></div>
            <div class="flex justify-between py-0.5 text-[var(--text-primary)] border-t border-[var(--border-color)] mt-1 pt-1 font-bold"><span>Midpoint:</span> <span>{{ state.tickerData ? formatMoney(getMidpoint(state.tickerData)) : '-' }}</span></div>
          </div>
        </div>

        <div v-if="isEndOfData" class="text-center text-[var(--text-primary)] opacity-70 p-2">End of simulation data</div>
        <div v-else class="flex gap-2">
          <button v-if="hasPosition" class="flex-1 text-[11px] px-3 py-1.5 border border-[#e0153c] bg-[#ff1744] text-white cursor-pointer rounded hover:bg-[#e6143d] disabled:opacity-50 disabled:cursor-not-allowed" @click="close" :disabled="!state.tickerData">Sell <kbd class="text-[9px] px-1 ml-1.5 bg-black/20 rounded opacity-80">(Space)</kbd></button>
          <button v-else class="flex-1 text-[11px] px-3 py-1.5 border border-[#00a844] bg-[#00c853] text-white cursor-pointer rounded hover:bg-[#00b848] disabled:opacity-50 disabled:cursor-not-allowed" @click="buy" :disabled="!state.tickerData">Buy <kbd class="text-[9px] px-1 ml-1.5 bg-black/20 rounded opacity-80">(Space)</kbd></button>
          <button class="flex-1 text-[11px] px-3 py-1.5 border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]" @click="skip">Next Day <kbd class="text-[9px] px-1 ml-1.5 bg-black/20 rounded opacity-80">(Enter)</kbd></button>
        </div>

        <div v-if="!isEndOfData" class="w-full mt-3">
          <div class="mb-1.5 font-bold text-[10px] text-[var(--text-primary)] opacity-70">Skip to next 30 trading days:</div>
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="d in nextDates"
              :key="d"
              class="text-[10px] px-0.5 py-1 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] cursor-pointer rounded-sm hover:bg-[var(--bg-tertiary)]"
              @click="jumpToDate(d)"
            >{{ formatDateShort(d) }}</button>
          </div>
        </div>

        <div class="flex justify-between items-center mt-3 pt-2 border-t border-[var(--border-color)]">
          <button class="text-[10px] px-1.5 py-0.5 border-none bg-transparent text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-tertiary)] hover:rounded-sm disabled:opacity-50 disabled:cursor-not-allowed" @click="replay">Start Over</button>
          <button class="text-[10px] px-1.5 py-0.5 border-none bg-transparent text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-tertiary)] hover:rounded-sm disabled:opacity-50 disabled:cursor-not-allowed" @click="toggleDetails">{{ state.showDetails ? '<< Hide' : 'Details >>' }}</button>
        </div>
      </div>

      <div v-if="state.showDetails || state.detailsClosing" class="sim-details flex flex-col border-l border-[var(--border-color)] shrink-0 w-0 overflow-hidden" :class="{ 'sim-details-no-anim': state.detailsAnimated, 'sim-details-closing': state.detailsClosing }">
        <div class="shrink-0 border-b border-[var(--border-color)] h-[150px] bg-[var(--bg-secondary)] w-[280px] min-w-[280px] flex flex-col p-2.5">
          <div class="font-bold text-[11px] mb-1 shrink-0">P&L History</div>
          <div class="flex-1 overflow-x-auto flex items-end pt-2.5">
            <div v-if="state.dailyTotalValues.length > 0" class="flex items-end gap-0.5 h-full">
              <div
                v-for="(seg, i) in timelineSegments"
                :key="i"
                class="sim-timeline-segment w-2 h-20 relative shrink-0 cursor-pointer transition-[height] duration-100"
                :class="{'bg-[#00c853]': seg.color === 'up', 'bg-[#ff1744]': seg.color === 'down', 'bg-[#666]': seg.color === 'neutral'}"
                @mouseenter="showTimelineInfo(seg)"
                @mouseleave="hideTimelineInfo"
              >
                <span v-if="seg.isToday" class="absolute bottom-full left-1/2 -translate-x-1/2 text-[10px] text-[var(--text-primary)]">v</span>
              </div>
            </div>
            <div v-else class="text-[var(--text-primary)] opacity-60 text-[11px] flex items-center justify-center w-full h-full">Start trading to see history</div>
          </div>
          <div class="h-5 text-[10px] pt-1 whitespace-nowrap shrink-0 flex justify-between items-center">
            <span class="text-[var(--text-primary)] flex-1 text-left">{{ timelineInfo.date }}</span>
            <span class="text-[var(--text-primary)] font-bold flex-1 text-center">{{ timelineInfo.ticker }}</span>
            <span class="flex-1 text-right" :class="{'text-[#00c853]': timelineInfo.pnlClass === 'up', 'text-[#ff1744]': timelineInfo.pnlClass === 'down'}">{{ timelineInfo.pnl }}</span>
          </div>
        </div>
        <div class="flex-1 min-h-0 p-2 flex flex-col bg-[var(--bg-secondary)] w-[280px] min-w-[280px]">
          <div class="flex justify-between items-center mb-1">
            <span class="font-bold text-[11px]">Position History</span>
          </div>
          <div class="flex-1 min-h-0 overflow-y-auto">
            <div>
              <div v-if="state.trades.length === 0" class="text-[var(--text-primary)] opacity-60 text-[11px] text-center p-5">No trades yet</div>
              <details v-for="(trade, idx) in reversedTrades" :key="idx" class="sim-trade-row border-b border-[var(--border-color)] last:border-b-0">
                <summary class="sim-trade-header flex items-center gap-2 px-1 py-1.5 cursor-pointer text-[10px] list-none text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                  <span class="text-[var(--text-primary)] opacity-70">{{ formatLedgerDate(trade.openDate) }}{{ trade.closeDate ? ' to ' + formatLedgerDate(trade.closeDate) : '' }}</span>
                  <span class="font-bold text-[var(--text-primary)]">{{ trade.ticker }}</span>
                  <span class="ml-auto text-[9px] text-[var(--text-primary)] opacity-70" :class="{ 'text-[#00c853] !opacity-100': !trade.closeDate }">{{ trade.closeDate ? 'Closed' : 'Open' }}</span>
                </summary>
                <div class="px-2 pb-2 pl-[22px] text-[10px] text-[var(--text-primary)]">
                  <div class="flex justify-between py-0.5">
                    <span class="text-[var(--text-primary)] opacity-70">Shares:</span>
                    <span>{{ trade.shares.toFixed(1) }}</span>
                  </div>
                  <div class="flex justify-between py-0.5">
                    <span class="text-[var(--text-primary)] opacity-70">Open Price:</span>
                    <span>{{ formatMoney(trade.openPrice) }}</span>
                  </div>
                  <div class="flex justify-between py-0.5">
                    <span class="text-[var(--text-primary)] opacity-70">{{ trade.closeDate ? 'Close Price:' : 'Current Price:' }}</span>
                    <span>{{ trade.closeDate ? formatMoney(trade.closePrice) : (getCurrentPrice(trade) ? formatMoney(getCurrentPrice(trade)) : '-') }}</span>
                  </div>
                  <div class="flex justify-between py-0.5 border-t border-[var(--border-color)] mt-1 pt-1 font-bold">
                    <span class="text-[var(--text-primary)] opacity-70">P&L:</span>
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
    useStyles('app-simulator', styles);

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
      if (deltaPercent.value === null) return 'text-transparent';
      return deltaPercent.value >= 0 ? 'text-[#00c853]' : 'text-[#ff1744]';
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
        return trade.pnl >= 0 ? 'text-[#00c853]' : 'text-[#ff1744]';
      }
      const currentPrice = getCurrentPrice(trade);
      if (currentPrice !== null) {
        const unrealizedPnl = (currentPrice * trade.shares) - trade.openValue;
        return unrealizedPnl >= 0 ? 'text-[#00c853]' : 'text-[#ff1744]';
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
