import { store } from '../../store.js';
import { DesignViewLayout } from '../design/DesignViewLayout.js';
import { DesignNavFooter } from '../design/DesignNavFooter.js';
import { DesignButton } from '../design/DesignButton.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-agents-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-agents-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-agents-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-agents-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
}

.view-view-agents-item:hover {
  background: var(--bg-tertiary);
}

.view-view-agents-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.view-view-agents-item-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  font-weight: bold;
}

.view-view-agents-item-icon.running {
  background: #2ecc71;
  color: #fff;
}

.view-view-agents-item-icon.idle {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.view-view-agents-item-icon.error {
  background: #e74c3c;
  color: #fff;
}

.view-view-agents-item-icon.task {
  background: #3498db;
  color: #fff;
}

.view-view-agents-item-icon.task.pending {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.view-view-agents-item-info {
  flex: 1;
  min-width: 0;
}

.view-view-agents-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.view-view-agents-item-status {
  font-size: 10px;
  color: var(--text-secondary);
}

.view-view-agents-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-agents-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.view-view-agents-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-view-agents-header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2ecc71;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.view-view-agents-header-avatar.error {
  background: #e74c3c;
}

.view-view-agents-header-avatar.task {
  background: #3498db;
}

.view-view-agents-header-info {
  display: flex;
  flex-direction: column;
}

.view-view-agents-header-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.view-view-agents-header-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.view-view-agents-header-actions {
  display: flex;
  gap: 8px;
}

.view-view-agents-header-btn {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
}

.view-view-agents-header-btn:hover {
  background: var(--bg-tertiary);
}

.view-view-agents-header-btn.primary {
  background: #2ecc71;
  border-color: #2ecc71;
  color: #fff;
}

.view-view-agents-header-btn.primary:hover {
  background: #27ae60;
}

.view-view-agents-header-btn.danger {
  background: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
}

.view-view-agents-header-btn.danger:hover {
  background: #c0392b;
}

.view-view-agents-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.view-view-agents-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.view-view-agents-stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 16px;
}

.view-view-agents-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.view-view-agents-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.view-view-agents-stat-value.positive {
  color: #2ecc71;
}

.view-view-agents-stat-value.negative {
  color: #e74c3c;
}

.view-view-agents-section {
  margin-bottom: 24px;
}

.view-view-agents-section-header {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-agents-positions {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.view-view-agents-positions-header {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px 100px;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-agents-positions-row {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px 100px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-primary);
}

.view-view-agents-positions-row:hover {
  background: var(--bg-tertiary);
}

.view-view-agents-position-pnl.positive {
  color: #2ecc71;
}

.view-view-agents-position-pnl.negative {
  color: #e74c3c;
}

.view-view-agents-log {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.view-view-agents-log-entry {
  display: flex;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
  font-size: 11px;
}

.view-view-agents-log-entry:last-child {
  border-bottom: none;
}

.view-view-agents-log-time {
  color: var(--text-secondary);
  font-family: monospace;
  flex-shrink: 0;
}

.view-view-agents-log-type {
  width: 60px;
  flex-shrink: 0;
  font-weight: bold;
}

.view-view-agents-log-type.info {
  color: #3498db;
}

.view-view-agents-log-type.trade {
  color: #2ecc71;
}

.view-view-agents-log-type.error {
  color: #e74c3c;
}

.view-view-agents-log-type.signal {
  color: #f39c12;
}

.view-view-agents-log-message {
  flex: 1;
  color: var(--text-primary);
}
`;

const icons = {
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  circle: '<circle cx="12" cy="12" r="10"/>',
};

const agents = [
  { id: 'momentum-bot', name: 'Momentum Bot', letter: 'M', status: 'running', statusText: 'Running since 9:30 AM', type: 'agent' },
  { id: 'mean-rev-bot', name: 'Mean Reversion', letter: 'R', status: 'running', statusText: 'Running since 9:30 AM', type: 'agent' },
  { id: 'vwap-bot', name: 'VWAP Reversion', letter: 'V', status: 'error', statusText: 'API Error', type: 'agent' },
];

const tasks = [
  { id: 'review-algo', name: 'Review momentum algo', status: 'completed', statusText: 'Due today', type: 'task' },
  { id: 'backtest-spy', name: 'Backtest SPY strategy', status: 'pending', statusText: 'In progress', type: 'task' },
  { id: 'add-stops', name: 'Add stop losses to NVDA', status: 'pending', statusText: 'Pending', type: 'task' },
];

const positions = [
  { symbol: 'AAPL', qty: 100, entry: '$189.50', current: '$191.24', pnl: '+$174.00', positive: true },
  { symbol: 'NVDA', qty: 50, entry: '$465.20', current: '$468.75', pnl: '+$177.50', positive: true },
  { symbol: 'MSFT', qty: 75, entry: '$380.15', current: '$378.90', pnl: '-$93.75', positive: false },
];

const logs = [
  { time: '14:32:15', type: 'signal', message: 'Momentum signal detected on NVDA, SMA10 crossed above SMA20' },
  { time: '14:32:16', type: 'trade', message: 'BUY 50 NVDA @ $465.20' },
  { time: '14:15:42', type: 'info', message: 'Scanning AAPL, MSFT, GOOGL, NVDA for momentum signals' },
  { time: '13:45:22', type: 'trade', message: 'BUY 100 AAPL @ $189.50' },
  { time: '13:45:21', type: 'signal', message: 'Momentum signal detected on AAPL, volume spike confirmed' },
  { time: '12:30:05', type: 'trade', message: 'SELL 100 GOOGL @ $138.45 (P&L: +$342.00)' },
  { time: '11:15:33', type: 'info', message: 'Position size adjusted based on volatility: 75 -> 100 shares' },
  { time: '09:30:01', type: 'info', message: 'Agent started, monitoring 4 symbols' },
];

export const ViewAgents = {
  components: { DesignViewLayout, DesignNavFooter, DesignButton },
  template: `
    <DesignViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="view-view-agents-sidebar-content">
          <div class="view-view-agents-sidebar-header">AI Agents</div>
          <div
            v-for="agent in agents"
            :key="agent.id"
            class="view-view-agents-item"
            :class="{ active: selectedId === agent.id }"
            @click="selectItem(agent)"
          >
            <div class="view-view-agents-item-icon" :class="agent.status">{{ agent.letter }}</div>
            <div class="view-view-agents-item-info">
              <div class="view-view-agents-item-name">{{ agent.name }}</div>
              <div class="view-view-agents-item-status">{{ agent.statusText }}</div>
            </div>
          </div>

          <div class="view-view-agents-sidebar-header">User Tasks</div>
          <div
            v-for="task in tasks"
            :key="task.id"
            class="view-view-agents-item"
            :class="{ active: selectedId === task.id }"
            @click="selectItem(task)"
          >
            <div class="view-view-agents-item-icon task" :class="{ pending: task.status === 'pending' }">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="task.status === 'completed' ? icons.check : icons.circle"></svg>
            </div>
            <div class="view-view-agents-item-info">
              <div class="view-view-agents-item-name">{{ task.name }}</div>
              <div class="view-view-agents-item-status">{{ task.statusText }}</div>
            </div>
          </div>
        </div>
        <DesignNavFooter>
          <DesignButton>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.trash"></svg>
          </DesignButton>
          <DesignButton>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.plus"></svg>
          </DesignButton>
        </DesignNavFooter>
      </template>

      <div class="view-view-agents-main">
        <div class="view-view-agents-header">
          <div class="view-view-agents-header-left">
            <div class="view-view-agents-header-avatar" :class="selectedItem.status">{{ selectedItem.letter || selectedItem.name.charAt(0) }}</div>
            <div class="view-view-agents-header-info">
              <span class="view-view-agents-header-title">{{ selectedItem.name }}</span>
              <span class="view-view-agents-header-meta">{{ selectedItem.type === 'agent' ? 'momentum.algo | AAPL, MSFT, GOOGL, NVDA' : selectedItem.statusText }}</span>
            </div>
          </div>
          <div class="view-view-agents-header-actions">
            <button class="view-view-agents-header-btn">Configure</button>
            <button class="view-view-agents-header-btn">Logs</button>
            <button v-if="selectedItem.type === 'agent'" class="view-view-agents-header-btn danger">Stop</button>
            <button v-else class="view-view-agents-header-btn primary">Complete</button>
          </div>
        </div>
        <div class="view-view-agents-content">
          <div class="view-view-agents-stats">
            <div class="view-view-agents-stat-card">
              <div class="view-view-agents-stat-label">Today P&L</div>
              <div class="view-view-agents-stat-value positive">+$1,245.80</div>
            </div>
            <div class="view-view-agents-stat-card">
              <div class="view-view-agents-stat-label">Open Positions</div>
              <div class="view-view-agents-stat-value">3</div>
            </div>
            <div class="view-view-agents-stat-card">
              <div class="view-view-agents-stat-label">Trades Today</div>
              <div class="view-view-agents-stat-value">12</div>
            </div>
            <div class="view-view-agents-stat-card">
              <div class="view-view-agents-stat-label">Win Rate</div>
              <div class="view-view-agents-stat-value">75%</div>
            </div>
          </div>

          <div class="view-view-agents-section">
            <div class="view-view-agents-section-header">Open Positions</div>
            <div class="view-view-agents-positions">
              <div class="view-view-agents-positions-header">
                <div>Symbol</div>
                <div>Qty</div>
                <div>Entry</div>
                <div>Current</div>
                <div>P&L</div>
              </div>
              <div v-for="(pos, idx) in positions" :key="idx" class="view-view-agents-positions-row">
                <div>{{ pos.symbol }}</div>
                <div>{{ pos.qty }}</div>
                <div>{{ pos.entry }}</div>
                <div>{{ pos.current }}</div>
                <div class="view-view-agents-position-pnl" :class="{ positive: pos.positive, negative: !pos.positive }">{{ pos.pnl }}</div>
              </div>
            </div>
          </div>

          <div class="view-view-agents-section">
            <div class="view-view-agents-section-header">Activity Log</div>
            <div class="view-view-agents-log">
              <div v-for="(log, idx) in logs" :key="idx" class="view-view-agents-log-entry">
                <span class="view-view-agents-log-time">{{ log.time }}</span>
                <span class="view-view-agents-log-type" :class="log.type">{{ log.type.toUpperCase() }}</span>
                <span class="view-view-agents-log-message">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesignViewLayout>
  `,
  setup() {
    useStyles('view-agents-styles', styles);

    const selectedId = Vue.ref('momentum-bot');
    const selectedItem = Vue.ref(agents[0]);

    const selectItem = (item) => {
      selectedId.value = item.id;
      selectedItem.value = item;
    };

    return {
      store,
      agents,
      tasks,
      positions,
      logs,
      icons,
      selectedId,
      selectedItem,
      selectItem,
    };
  },
};
