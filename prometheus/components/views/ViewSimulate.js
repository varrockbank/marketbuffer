import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.view-view-simulate-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-simulate-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-simulate-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-simulate-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
}

.view-view-simulate-item:hover {
  background: var(--bg-tertiary);
}

.view-view-simulate-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.view-view-simulate-item-icon {
  color: var(--text-secondary);
}

.view-view-simulate-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  color: var(--text-primary);
}

.view-view-simulate-item-status {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
}

.view-view-simulate-item-status.running {
  background: #3498db;
  color: #fff;
}

.view-view-simulate-item-status.completed {
  background: #2ecc71;
  color: #fff;
}

.view-view-simulate-item-status.failed {
  background: #e74c3c;
  color: #fff;
}

.view-view-simulate-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-simulate-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.view-view-simulate-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-view-simulate-header-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.view-view-simulate-header-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.view-view-simulate-header-actions {
  display: flex;
  gap: 8px;
}

.view-view-simulate-header-btn {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
}

.view-view-simulate-header-btn:hover {
  background: var(--bg-tertiary);
}

.view-view-simulate-header-btn.primary {
  background: #2ecc71;
  border-color: #2ecc71;
  color: #fff;
}

.view-view-simulate-header-btn.primary:hover {
  background: #27ae60;
}

.view-view-simulate-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.view-view-simulate-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.view-view-simulate-stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 16px;
}

.view-view-simulate-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.view-view-simulate-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.view-view-simulate-stat-value.positive {
  color: #2ecc71;
}

.view-view-simulate-stat-value.negative {
  color: #e74c3c;
}

.view-view-simulate-stat-change {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.view-view-simulate-section {
  margin-bottom: 24px;
}

.view-view-simulate-section-header {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-simulate-chart {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  height: 200px;
  display: flex;
  align-items: flex-end;
  padding: 16px;
  gap: 2px;
}

.view-view-simulate-chart-bar {
  flex: 1;
  min-height: 4px;
  border-radius: 2px 2px 0 0;
}

.view-view-simulate-chart-bar.positive {
  background: #2ecc71;
}

.view-view-simulate-chart-bar.negative {
  background: #e74c3c;
}

.view-view-simulate-trades-table {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.view-view-simulate-trades-header {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px 100px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-simulate-trades-row {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px 100px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-primary);
}

.view-view-simulate-trades-row:hover {
  background: var(--bg-tertiary);
}

.view-view-simulate-trade-type {
  font-weight: bold;
}

.view-view-simulate-trade-type.buy {
  color: #2ecc71;
}

.view-view-simulate-trade-type.sell {
  color: #e74c3c;
}

.view-view-simulate-trade-pnl.positive {
  color: #2ecc71;
}

.view-view-simulate-trade-pnl.negative {
  color: #e74c3c;
}
`;


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
        <div class="view-view-simulate-sidebar-content">
          <div class="view-view-simulate-sidebar-header">Backtests</div>
          <div
            v-for="test in backtests"
            :key="test.id"
            class="view-view-simulate-item"
            :class="{ active: selectedTest === test.id }"
            @click="selectTest(test)"
          >
            <span class="view-view-simulate-item-icon"><KitIcon icon="chart" :size="14" /></span>
            <span class="view-view-simulate-item-name">{{ test.name }}</span>
            <span class="view-view-simulate-item-status" :class="test.status">{{ statusLabel(test.status) }}</span>
          </div>

          <div class="view-view-simulate-sidebar-header">Strategies</div>
          <div
            v-for="strategy in strategies"
            :key="strategy.id"
            class="view-view-simulate-item"
            @click="selectStrategy(strategy)"
          >
            <span class="view-view-simulate-item-icon"><KitIcon icon="code" :size="14" /></span>
            <span class="view-view-simulate-item-name">{{ strategy.name }}</span>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="trash" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="view-view-simulate-main">
        <div class="view-view-simulate-header">
          <div class="view-view-simulate-header-left">
            <span class="view-view-simulate-header-title">{{ selectedName }}</span>
            <span class="view-view-simulate-header-meta">Jan 1, 2024 - Dec 1, 2024 | AAPL, MSFT, GOOGL</span>
          </div>
          <div class="view-view-simulate-header-actions">
            <button class="view-view-simulate-header-btn">Export</button>
            <button class="view-view-simulate-header-btn">Configure</button>
            <button class="view-view-simulate-header-btn primary">Run Again</button>
          </div>
        </div>
        <div class="view-view-simulate-content">
          <div class="view-view-simulate-stats">
            <div class="view-view-simulate-stat-card">
              <div class="view-view-simulate-stat-label">Total Return</div>
              <div class="view-view-simulate-stat-value positive">+24.5%</div>
              <div class="view-view-simulate-stat-change">vs SPY +18.2%</div>
            </div>
            <div class="view-view-simulate-stat-card">
              <div class="view-view-simulate-stat-label">Sharpe Ratio</div>
              <div class="view-view-simulate-stat-value">1.85</div>
              <div class="view-view-simulate-stat-change">Annualized</div>
            </div>
            <div class="view-view-simulate-stat-card">
              <div class="view-view-simulate-stat-label">Max Drawdown</div>
              <div class="view-view-simulate-stat-value negative">-8.3%</div>
              <div class="view-view-simulate-stat-change">Mar 15, 2024</div>
            </div>
            <div class="view-view-simulate-stat-card">
              <div class="view-view-simulate-stat-label">Win Rate</div>
              <div class="view-view-simulate-stat-value">62%</div>
              <div class="view-view-simulate-stat-change">186 / 300 trades</div>
            </div>
          </div>

          <div class="view-view-simulate-section">
            <div class="view-view-simulate-section-header">Equity Curve</div>
            <div class="view-view-simulate-chart">
              <div v-for="(bar, idx) in chartBars" :key="idx" class="view-view-simulate-chart-bar" :class="bar.positive ? 'positive' : 'negative'" :style="{ height: bar.height + '%' }"></div>
            </div>
          </div>

          <div class="view-view-simulate-section">
            <div class="view-view-simulate-section-header">Recent Trades</div>
            <div class="view-view-simulate-trades-table">
              <div class="view-view-simulate-trades-header">
                <div>Date</div>
                <div>Symbol</div>
                <div>Type</div>
                <div>Price</div>
                <div>P&L</div>
              </div>
              <div v-for="(trade, idx) in trades" :key="idx" class="view-view-simulate-trades-row">
                <div>{{ trade.date }}</div>
                <div>{{ trade.symbol }}</div>
                <div class="view-view-simulate-trade-type" :class="trade.type">{{ trade.type.toUpperCase() }}</div>
                <div>{{ trade.price }}</div>
                <div class="view-view-simulate-trade-pnl" :class="{ positive: trade.positive, negative: trade.positive === false }">{{ trade.pnl }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    useStyles('view-simulate-styles', styles);

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
