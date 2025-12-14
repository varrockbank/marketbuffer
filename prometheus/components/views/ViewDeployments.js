import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitNavFooter } from '../kit/KitNavFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-deploy-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-deploy-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-deploy-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-deploy-item {
  padding: 10px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
}

.view-view-deploy-item:hover {
  background: var(--bg-tertiary);
}

.view-view-deploy-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.view-view-deploy-item-title {
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.view-view-deploy-item-pnl {
  font-size: 11px;
  font-weight: bold;
}

.view-view-deploy-item-pnl.positive {
  color: #2ecc71;
}

.view-view-deploy-item-pnl.negative {
  color: #e74c3c;
}

.view-view-deploy-item.disabled {
  opacity: 0.6;
}

.view-view-deploy-item.disabled .view-view-deploy-item-pnl {
  color: var(--text-secondary);
  font-weight: normal;
}

.view-view-deploy-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-deploy-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.view-view-deploy-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-view-deploy-header-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.view-view-deploy-header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.view-view-deploy-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2ecc71;
}

.view-view-deploy-status-dot.disabled {
  background: #95a5a6;
}

.view-view-deploy-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  font-family: inherit;
  font-size: 11px;
  color: var(--text-primary);
  border-radius: 4px;
}

.view-view-deploy-toggle:hover {
  background: var(--bg-tertiary);
}

.view-view-deploy-toggle-switch {
  width: 32px;
  height: 18px;
  background: #95a5a6;
  border-radius: 9px;
  position: relative;
  transition: background 0.2s;
}

.view-view-deploy-toggle-switch.active {
  background: #2ecc71;
}

.view-view-deploy-toggle-switch::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.view-view-deploy-toggle-switch.active::after {
  transform: translateX(14px);
}

.view-view-deploy-content {
  flex: 1;
  overflow-y: auto;
}

.view-view-deploy-stats {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.view-view-deploy-stats-header {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--text-primary);
}

.view-view-deploy-stats-row {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.view-view-deploy-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.view-view-deploy-stat-label {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.view-view-deploy-stat-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
}

.view-view-deploy-stat-value.positive {
  color: #2ecc71;
}

.view-view-deploy-stat-value.negative {
  color: #e74c3c;
}

.view-view-deploy-chart {
  display: flex;
  gap: 2px;
  height: 40px;
  align-items: flex-end;
}

.view-view-deploy-chart-bar {
  flex: 1;
  min-width: 3px;
  max-width: 8px;
  border-radius: 1px;
}

.view-view-deploy-chart-bar.positive {
  background: #2ecc71;
}

.view-view-deploy-chart-bar.negative {
  background: #e74c3c;
}

.view-view-deploy-logs {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.view-view-deploy-logs-header {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.view-view-deploy-logs-content {
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 10px;
  line-height: 1.6;
  background: var(--bg-secondary);
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.view-view-deploy-log-entry {
  display: flex;
  gap: 12px;
}

.view-view-deploy-log-time {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.view-view-deploy-log-level {
  flex-shrink: 0;
  width: 55px;
  font-weight: bold;
}

.view-view-deploy-log-level.info { color: #3498db; }
.view-view-deploy-log-level.warn { color: #f39c12; }
.view-view-deploy-log-level.error { color: #e74c3c; }
.view-view-deploy-log-level.success { color: #2ecc71; }

.view-view-deploy-log-msg {
  flex: 1;
  color: var(--text-primary);
}
`;

const deployments = {
  production: [
    { id: 'momentum-10', name: '10-day momentum', pnl: '+$1,247.50', positive: true },
    { id: 'mean-reversion', name: 'Mean reversion', pnl: '-$342.10', positive: false },
    { id: 'pairs-trade', name: 'Pairs trading', pnl: '+$523.00', positive: true },
  ],
  walkForward: [
    { id: 'breakout-vol', name: 'Breakout + volume', pnl: '+$89.25', positive: true },
    { id: 'vwap-revert', name: 'VWAP reversion', pnl: '+$312.40', positive: true },
    { id: 'gap-fill', name: 'Gap fill', pnl: '-$78.50', positive: false },
  ],
  disabled: [
    { id: 'rsi-oversold', name: 'RSI oversold', pnl: 'paused', disabled: true },
    { id: 'macd-cross', name: 'MACD crossover', pnl: 'paused', disabled: true },
  ],
};

const logs = [
  { time: '09:30:01', level: 'info', msg: 'Strategy initialized. Watching AAPL, MSFT, GOOGL' },
  { time: '09:31:15', level: 'info', msg: 'AAPL: SMA10=142.35, SMA20=141.82, Close=142.50' },
  { time: '09:31:15', level: 'success', msg: 'AAPL: Entry signal triggered. Bought 100 shares @ $142.38' },
  { time: '09:45:22', level: 'info', msg: 'AAPL: Position P&L +0.8% ($112.00)' },
  { time: '10:02:08', level: 'warn', msg: 'MSFT: Volume spike detected (2.3x avg) but no entry signal' },
  { time: '10:15:33', level: 'info', msg: 'AAPL: Position P&L +1.2% ($171.00)' },
  { time: '10:30:01', level: 'success', msg: 'GOOGL: Entry signal triggered. Bought 50 shares @ $138.92' },
  { time: '11:15:44', level: 'error', msg: 'GOOGL: Stop loss hit (-2.1%). Sold 50 shares @ $136.00' },
];

export const ViewDeployments = {
  components: { KitViewLayout, KitNavFooter, KitButton },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="view-view-deploy-sidebar-content">
          <div class="view-view-deploy-sidebar-header">Production</div>
          <div
            v-for="item in deployments.production"
            :key="item.id"
            class="view-view-deploy-item"
            :class="{ active: selectedDeployment === item.id }"
            @click="selectDeployment(item)"
          >
            <div class="view-view-deploy-item-title">{{ item.name }}</div>
            <div class="view-view-deploy-item-pnl" :class="{ positive: item.positive, negative: !item.positive }">{{ item.pnl }} today</div>
          </div>

          <div class="view-view-deploy-sidebar-header">Walk-forward Tests</div>
          <div
            v-for="item in deployments.walkForward"
            :key="item.id"
            class="view-view-deploy-item"
            :class="{ active: selectedDeployment === item.id }"
            @click="selectDeployment(item)"
          >
            <div class="view-view-deploy-item-title">{{ item.name }}</div>
            <div class="view-view-deploy-item-pnl" :class="{ positive: item.positive, negative: !item.positive }">{{ item.pnl }} today</div>
          </div>

          <div class="view-view-deploy-sidebar-header">Disabled</div>
          <div
            v-for="item in deployments.disabled"
            :key="item.id"
            class="view-view-deploy-item disabled"
            :class="{ active: selectedDeployment === item.id }"
            @click="selectDeployment(item)"
          >
            <div class="view-view-deploy-item-title">{{ item.name }}</div>
            <div class="view-view-deploy-item-pnl">{{ item.pnl }}</div>
          </div>
        </div>
        <KitNavFooter>
          <KitButton>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>
            </svg>
          </KitButton>
          <KitButton>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </KitButton>
        </KitNavFooter>
      </template>

      <div class="view-view-deploy-main">
        <div class="view-view-deploy-header">
          <div class="view-view-deploy-header-left">
            <span class="view-view-deploy-header-title">{{ selectedName }}</span>
            <div class="view-view-deploy-header-status">
              <span class="view-view-deploy-status-dot" :class="{ disabled: !enabled }"></span>
              <span>{{ enabled ? 'Running' : 'Stopped' }}</span>
            </div>
          </div>
          <button class="view-view-deploy-toggle" @click="enabled = !enabled">
            <span class="view-view-deploy-toggle-switch" :class="{ active: enabled }"></span>
            <span>{{ enabled ? 'Enabled' : 'Disabled' }}</span>
          </button>
        </div>
        <div class="view-view-deploy-content">
          <div class="view-view-deploy-stats">
            <div class="view-view-deploy-stats-header">Today</div>
            <div class="view-view-deploy-stats-row">
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">P&L</span>
                <span class="view-view-deploy-stat-value positive">+$1,247.50</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Target Shares</span>
                <span class="view-view-deploy-stat-value">500</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Executed</span>
                <span class="view-view-deploy-stat-value">350</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Avg Price</span>
                <span class="view-view-deploy-stat-value">$142.38</span>
              </div>
            </div>
          </div>
          <div class="view-view-deploy-stats">
            <div class="view-view-deploy-stats-header">Performance YTD</div>
            <div class="view-view-deploy-stats-row">
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Total P&L</span>
                <span class="view-view-deploy-stat-value positive">+$24,832.50</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Win Rate</span>
                <span class="view-view-deploy-stat-value">67%</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Trades</span>
                <span class="view-view-deploy-stat-value">142</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Avg Win</span>
                <span class="view-view-deploy-stat-value positive">+$412</span>
              </div>
              <div class="view-view-deploy-stat">
                <span class="view-view-deploy-stat-label">Avg Loss</span>
                <span class="view-view-deploy-stat-value negative">-$198</span>
              </div>
            </div>
            <div class="view-view-deploy-chart">
              <div v-for="(bar, idx) in chartBars" :key="idx" class="view-view-deploy-chart-bar" :class="bar.positive ? 'positive' : 'negative'" :style="{ height: bar.height + 'px' }"></div>
            </div>
          </div>
          <div class="view-view-deploy-logs">
            <div class="view-view-deploy-logs-header">Logs</div>
            <div class="view-view-deploy-logs-content">
              <div v-for="(log, idx) in logs" :key="idx" class="view-view-deploy-log-entry">
                <span class="view-view-deploy-log-time">{{ log.time }}</span>
                <span class="view-view-deploy-log-level" :class="log.level">[{{ log.level.toUpperCase() }}]</span>
                <span class="view-view-deploy-log-msg">{{ log.msg }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    useStyles('view-deploy-styles', styles);

    const selectedDeployment = Vue.ref('momentum-10');
    const selectedName = Vue.ref('10-day momentum');
    const enabled = Vue.ref(true);

    const chartBars = Vue.ref([]);
    for (let i = 0; i < 30; i++) {
      chartBars.value.push({
        positive: Math.random() > 0.33,
        height: Math.random() * 30 + 10,
      });
    }

    const selectDeployment = (item) => {
      selectedDeployment.value = item.id;
      selectedName.value = item.name;
      enabled.value = !item.disabled;
    };

    return {
      store,
      deployments,
      logs,
      selectedDeployment,
      selectedName,
      enabled,
      chartBars,
      selectDeployment,
    };
  },
};
