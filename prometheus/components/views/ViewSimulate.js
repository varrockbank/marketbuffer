import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';

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
  { date: 'Dec 1', symbol: 'AAPL', type: 'sell', price: '$191.24', pnl: '+$342.50', positive: true },
  { date: 'Nov 28', symbol: 'AAPL', type: 'buy', price: '$187.81', pnl: '-' },
  { date: 'Nov 25', symbol: 'MSFT', type: 'sell', price: '$378.91', pnl: '-$125.00', positive: false },
  { date: 'Nov 22', symbol: 'MSFT', type: 'buy', price: '$380.16', pnl: '-' },
  { date: 'Nov 20', symbol: 'GOOGL', type: 'sell', price: '$138.45', pnl: '+$567.80', positive: true },
];

export const ViewSimulate = {
  components: { KitViewLayout, KitSidebarFooter, KitButton, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Backtests</div>
          <div
            v-for="test in backtests"
            :key="test.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedTest === test.id }"
            @click="selectTest(test)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon icon="chart" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ test.name }}</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded-lg font-bold text-white" :class="{'bg-[#2ecc71]': test.status === 'completed', 'bg-[#3498db]': test.status === 'running', 'bg-[#e74c3c]': test.status === 'failed'}">{{ statusLabel(test.status) }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Strategies</div>
          <div
            v-for="strategy in strategies"
            :key="strategy.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            @click="selectStrategy(strategy)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon icon="code" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ strategy.name }}</span>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="trash" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <span class="font-bold text-base text-[var(--text-primary)]">{{ selectedName }}</span>
            <span class="text-[11px] text-[var(--text-secondary)]">Jan 1, 2024 - Dec 1, 2024 | AAPL, MSFT, GOOGL</span>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Export</button>
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Configure</button>
            <button class="px-3 py-1.5 bg-[#2ecc71] border border-[#2ecc71] text-white text-[11px] cursor-pointer rounded hover:bg-[#27ae60]">Run Again</button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Total Return</div>
              <div class="text-2xl font-bold text-[#2ecc71]">+24.5%</div>
              <div class="text-[11px] text-[var(--text-secondary)] mt-1">vs SPY +18.2%</div>
            </div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Sharpe Ratio</div>
              <div class="text-2xl font-bold text-[var(--text-primary)]">1.85</div>
              <div class="text-[11px] text-[var(--text-secondary)] mt-1">Annualized</div>
            </div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Max Drawdown</div>
              <div class="text-2xl font-bold text-[#e74c3c]">-8.3%</div>
              <div class="text-[11px] text-[var(--text-secondary)] mt-1">Mar 15, 2024</div>
            </div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Win Rate</div>
              <div class="text-2xl font-bold text-[var(--text-primary)]">62%</div>
              <div class="text-[11px] text-[var(--text-secondary)] mt-1">186 / 300 trades</div>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-bold text-[13px] mb-3 text-[var(--text-secondary)] uppercase tracking-wide">Equity Curve</div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded h-[200px] flex items-end p-4 gap-0.5">
              <div v-for="(bar, idx) in chartBars" :key="idx" class="flex-1 min-h-1 rounded-t-sm" :class="bar.positive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'" :style="{ height: bar.height + '%' }"></div>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-bold text-[13px] mb-3 text-[var(--text-secondary)] uppercase tracking-wide">Recent Trades</div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded overflow-hidden">
              <div class="grid grid-cols-[100px_1fr_100px_100px_100px] px-4 py-3 bg-[var(--bg-tertiary)] text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">
                <div>Date</div>
                <div>Symbol</div>
                <div>Type</div>
                <div>Price</div>
                <div>P&L</div>
              </div>
              <div v-for="(trade, idx) in trades" :key="idx" class="grid grid-cols-[100px_1fr_100px_100px_100px] px-4 py-3 border-t border-[var(--border-color)] text-xs text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                <div>{{ trade.date }}</div>
                <div>{{ trade.symbol }}</div>
                <div class="font-bold" :class="trade.type === 'buy' ? 'text-[#2ecc71]' : 'text-[#e74c3c]'">{{ trade.type.toUpperCase() }}</div>
                <div>{{ trade.price }}</div>
                <div :class="{ 'text-[#2ecc71]': trade.positive, 'text-[#e74c3c]': trade.positive === false }">{{ trade.pnl }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    const selectedTest = Vue.ref('momentum-2024');
    const selectedName = Vue.ref('Momentum 2024');

    const chartBars = Vue.ref([]);
    const heights = [20, 25, 30, 15, 35, 40, 45, 30, 25, 50, 55, 60, 65, 55, 70, 75, 80, 85, 75, 90];
    const positives = [true, true, true, false, true, true, true, false, false, true, true, true, true, false, true, true, true, true, false, true];
    for (let i = 0; i < heights.length; i++) {
      chartBars.value.push({ height: heights[i], positive: positives[i] });
    }

    const statusLabel = (status) => {
      return status === 'completed' ? 'Done' : status === 'running' ? 'Running' : 'Failed';
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
      chartBars,
      statusLabel,
      selectTest,
      selectStrategy,
    };
  },
};
