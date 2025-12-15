import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

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

const trades = [
  { date: 'Dec 1', symbol: 'AAPL', type: 'SELL', price: '$191.24', pnl: '+$342.50' },
  { date: 'Nov 28', symbol: 'AAPL', type: 'BUY', price: '$187.81', pnl: '-' },
  { date: 'Nov 25', symbol: 'MSFT', type: 'SELL', price: '$378.91', pnl: '-$125.00' },
  { date: 'Nov 22', symbol: 'MSFT', type: 'BUY', price: '$380.16', pnl: '-' },
  { date: 'Nov 20', symbol: 'GOOGL', type: 'SELL', price: '$138.45', pnl: '+$567.80' },
];

export const ViewTuiSimulate = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedName">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">Backtests</div>
          <div
            v-for="test in backtests"
            :key="test.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedTest === test.id ? 'active' : ''"
            @click="selectTest(test)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedTest === test.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ test.name }}</span>
            <span class="ml-1">[{{ statusLabel(test.status) }}]</span>
          </div>

          <div class="kit-tui-header">Strategies</div>
          <div
            v-for="strategy in strategies"
            :key="strategy.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            @click="selectStrategy(strategy)"
          >
            <span class="inline-block" style="width: 2ch;"></span>
            <span class="truncate">{{ strategy.name }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-1">Jan 1, 2024 - Dec 1, 2024 | AAPL, MSFT, GOOGL</div>
        <div class="mb-2">
          Return: +24.5% | Sharpe: 1.85 | MaxDD: -8.3% | WinRate: 62%
        </div>
        <div class="mb-1">[Export] [Configure] [Run Again]</div>
        <div class="flex-1 overflow-auto mt-2">
          <div class="font-bold">== Recent Trades ==</div>
          <div>Date     | Symbol | Type | Price    | P&L</div>
          <div>{{ '-'.repeat(50) }}</div>
          <div v-for="(trade, idx) in trades" :key="idx">
            {{ trade.date.padEnd(8) }} | {{ trade.symbol.padEnd(6) }} | {{ trade.type.padEnd(4) }} | {{ trade.price.padEnd(8) }} | {{ trade.pnl }}
          </div>
        </div>
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const selectedTest = Vue.ref('momentum-2024');
    const selectedName = Vue.ref('Momentum 2024');

    const statusLabel = (status) => {
      return status === 'completed' ? 'OK' : status === 'running' ? 'RUN' : 'ERR';
    };

    const selectTest = (test) => {
      selectedTest.value = test.id;
      selectedName.value = test.name;
    };

    const selectStrategy = (strategy) => {
      selectedName.value = strategy.name;
    };

    return {
      store,
      backtests,
      strategies,
      trades,
      selectedTest,
      selectedName,
      statusLabel,
      selectTest,
      selectStrategy,
    };
  },
};
