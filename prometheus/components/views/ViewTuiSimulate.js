import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

const backtests = [
  { id: 'momentum-2024', name: 'Momentum 2024', status: 'completed' },
  { id: 'mean-reversion-q4', name: 'Mean Reversion Q4', status: 'running' },
  { id: 'pairs-spy-qqq', name: 'Pairs SPY/QQQ', status: 'completed' },
  { id: 'breakout-failed', name: 'Breakout Test', status: 'failed' },
];

const strategies = [
  { id: 'momentum', name: 'momentum.algo' },
  { id: 'mean-reversion', name: 'mean-reversion.algo' },
  { id: 'pairs-trading', name: 'pairs-trading.algo' },
];

const backtestData = {
  'momentum-2024': {
    period: 'Jan 1, 2024 - Dec 1, 2024',
    symbols: 'AAPL, MSFT, GOOGL',
    return: '+24.5%',
    sharpe: '1.85',
    maxDD: '-8.3%',
    winRate: '62%',
    trades: [
      { date: 'Dec 1', symbol: 'AAPL', type: 'SELL', price: '$191.24', pnl: '+$342.50' },
      { date: 'Nov 28', symbol: 'AAPL', type: 'BUY', price: '$187.81', pnl: '-' },
      { date: 'Nov 25', symbol: 'MSFT', type: 'SELL', price: '$378.91', pnl: '-$125.00' },
      { date: 'Nov 22', symbol: 'MSFT', type: 'BUY', price: '$380.16', pnl: '-' },
      { date: 'Nov 20', symbol: 'GOOGL', type: 'SELL', price: '$138.45', pnl: '+$567.80' },
    ],
  },
  'mean-reversion-q4': {
    period: 'Oct 1, 2024 - Dec 1, 2024',
    symbols: 'SPY, QQQ, IWM',
    return: '+8.2%',
    sharpe: '1.42',
    maxDD: '-4.1%',
    winRate: '58%',
    status: 'running',
    trades: [
      { date: 'Dec 1', symbol: 'SPY', type: 'BUY', price: '$479.50', pnl: '-' },
      { date: 'Nov 29', symbol: 'QQQ', type: 'SELL', price: '$412.30', pnl: '+$215.00' },
      { date: 'Nov 27', symbol: 'QQQ', type: 'BUY', price: '$410.15', pnl: '-' },
      { date: 'Nov 25', symbol: 'IWM', type: 'SELL', price: '$198.75', pnl: '+$87.50' },
    ],
  },
  'pairs-spy-qqq': {
    period: 'Jan 1, 2024 - Nov 30, 2024',
    symbols: 'SPY/QQQ pair',
    return: '+12.8%',
    sharpe: '2.15',
    maxDD: '-3.2%',
    winRate: '71%',
    trades: [
      { date: 'Nov 30', symbol: 'SPY/QQQ', type: 'CLOSE', price: 'Spread: 0.82', pnl: '+$425.00' },
      { date: 'Nov 28', symbol: 'SPY/QQQ', type: 'OPEN', price: 'Spread: 0.78', pnl: '-' },
      { date: 'Nov 20', symbol: 'SPY/QQQ', type: 'CLOSE', price: 'Spread: 0.85', pnl: '+$312.50' },
      { date: 'Nov 18', symbol: 'SPY/QQQ', type: 'OPEN', price: 'Spread: 0.81', pnl: '-' },
    ],
  },
  'breakout-failed': {
    period: 'Sep 1, 2024 - Oct 15, 2024',
    symbols: 'NVDA, AMD, SMCI',
    return: '-15.2%',
    sharpe: '-0.45',
    maxDD: '-22.1%',
    winRate: '35%',
    status: 'failed',
    trades: [
      { date: 'Oct 15', symbol: 'NVDA', type: 'STOP', price: '$425.00', pnl: '-$1,250.00' },
      { date: 'Oct 12', symbol: 'AMD', type: 'STOP', price: '$142.50', pnl: '-$875.00' },
      { date: 'Oct 10', symbol: 'SMCI', type: 'STOP', price: '$38.20', pnl: '-$2,100.00' },
    ],
  },
  // Strategies show code/config instead of trades
  momentum: {
    type: 'strategy',
    content: [
      'momentum.algo - 10-day momentum strategy',
      '',
      'Parameters:',
      '  lookback_period: 10',
      '  entry_threshold: 0.02',
      '  exit_threshold: -0.01',
      '  position_size: 0.25',
      '  max_positions: 4',
      '',
      'Symbols: AAPL, MSFT, GOOGL, AMZN, NVDA',
      '',
      'Logic:',
      '  Entry: 10d return > 2%',
      '  Exit: 10d return < -1% OR trailing stop 5%',
    ],
  },
  'mean-reversion': {
    type: 'strategy',
    content: [
      'mean-reversion.algo - RSI mean reversion',
      '',
      'Parameters:',
      '  rsi_period: 14',
      '  oversold: 30',
      '  overbought: 70',
      '  position_size: 0.20',
      '',
      'Symbols: SPY, QQQ, IWM',
      '',
      'Logic:',
      '  Entry: RSI < 30 (oversold)',
      '  Exit: RSI > 50 OR stop loss 3%',
    ],
  },
  'pairs-trading': {
    type: 'strategy',
    content: [
      'pairs-trading.algo - Statistical arbitrage',
      '',
      'Parameters:',
      '  zscore_entry: 2.0',
      '  zscore_exit: 0.5',
      '  lookback: 60',
      '  position_size: 0.50',
      '',
      'Pairs: SPY/QQQ, XLF/XLK, GLD/SLV',
      '',
      'Logic:',
      '  Entry: Z-score > 2 or < -2',
      '  Exit: Z-score crosses 0.5',
    ],
  },
};

export const ViewTuiSimulate = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedName">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedTest"
          @select="onSelect"
        />
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <KitTUIVbufContent :lines="contentLines" />
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    const allItems = [...backtests, ...strategies];

    // Get selected item from route or default to 'momentum-2024'
    const selectedTest = Vue.computed(() => route.params.item || 'momentum-2024');

    const currentItem = Vue.computed(() => {
      return allItems.find(i => i.id === selectedTest.value) || backtests[0];
    });

    const selectedName = Vue.computed(() => currentItem.value?.name || 'Momentum 2024');

    const statusLabel = (status) => {
      return status === 'completed' ? 'OK' : status === 'running' ? 'RUN' : 'ERR';
    };

    const menuSections = Vue.computed(() => [
      { header: 'Backtests', items: backtests.map(t => ({ id: t.id, label: t.name, suffix: `[${statusLabel(t.status)}]` })) },
      { header: 'Strategies', items: strategies.map(s => ({ id: s.id, label: s.name })) },
    ]);

    const onSelect = (id) => {
      router.push(`/simulate/${id}`);
    };

    const contentLines = Vue.computed(() => {
      const lines = [];
      const data = backtestData[selectedTest.value];

      if (!data) {
        lines.push('Select a backtest or strategy to view details');
        return lines;
      }

      // Strategy view
      if (data.type === 'strategy') {
        data.content.forEach(line => lines.push(line));
        lines.push('');
        lines.push('[Edit] [Run Backtest] [Deploy]');
        return lines;
      }

      // Backtest view
      lines.push(`${data.period} | ${data.symbols}`);
      lines.push(`Return: ${data.return} | Sharpe: ${data.sharpe} | MaxDD: ${data.maxDD} | WinRate: ${data.winRate}`);
      lines.push('');
      lines.push('[Export] [Configure] [Run Again]');
      lines.push('');
      lines.push('== Recent Trades ==');
      lines.push('Date     | Symbol   | Type  | Price          | P&L');
      lines.push('-'.repeat(55));

      if (data.trades) {
        data.trades.forEach(trade => {
          lines.push(`${trade.date.padEnd(8)} | ${trade.symbol.padEnd(8)} | ${trade.type.padEnd(5)} | ${trade.price.padEnd(14)} | ${trade.pnl}`);
        });
      }

      return lines;
    });

    return {
      store,
      backtests,
      strategies,
      selectedTest,
      selectedName,
      contentLines,
      menuSections,
      onSelect,
    };
  },
};
