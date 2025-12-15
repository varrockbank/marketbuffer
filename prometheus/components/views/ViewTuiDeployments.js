import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

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

const deploymentData = {
  'momentum-10': {
    enabled: true,
    pnlToday: '+$1,247.50',
    pnlYtd: '+$24,832.50',
    target: 500,
    executed: 350,
    avgPrice: '$142.38',
    winRate: '67%',
    trades: 142,
    logs: [
      { time: '09:30:01', level: 'INFO', msg: 'Strategy initialized. Watching AAPL, MSFT, GOOGL' },
      { time: '09:31:15', level: 'INFO', msg: 'AAPL: SMA10=142.35, SMA20=141.82, Close=142.50' },
      { time: '09:31:15', level: 'OK', msg: 'AAPL: Entry signal triggered. Bought 100 shares @ $142.38' },
      { time: '09:45:22', level: 'INFO', msg: 'AAPL: Position P&L +0.8% ($112.00)' },
      { time: '10:02:08', level: 'WARN', msg: 'MSFT: Volume spike detected (2.3x avg) but no entry signal' },
    ],
  },
  'mean-reversion': {
    enabled: true,
    pnlToday: '-$342.10',
    pnlYtd: '+$8,421.30',
    target: 200,
    executed: 180,
    avgPrice: '$478.50',
    winRate: '58%',
    trades: 89,
    logs: [
      { time: '09:30:05', level: 'INFO', msg: 'Mean reversion bot started. Symbols: SPY, QQQ, IWM' },
      { time: '09:35:12', level: 'INFO', msg: 'SPY RSI: 42 (neutral), QQQ RSI: 38, IWM RSI: 45' },
      { time: '10:15:30', level: 'OK', msg: 'QQQ: RSI crossed below 30. Bought 50 shares @ $410.25' },
      { time: '11:22:45', level: 'WARN', msg: 'QQQ: Position down -0.8%. Monitoring stop level.' },
      { time: '14:01:00', level: 'ERR', msg: 'QQQ: Stop loss triggered. Sold @ $407.10 (-0.77%)' },
    ],
  },
  'pairs-trade': {
    enabled: true,
    pnlToday: '+$523.00',
    pnlYtd: '+$12,156.80',
    target: 100,
    executed: 100,
    avgPrice: 'Spread: 0.82',
    winRate: '71%',
    trades: 64,
    logs: [
      { time: '09:30:02', level: 'INFO', msg: 'Pairs trading initialized. Watching SPY/QQQ spread' },
      { time: '09:32:00', level: 'INFO', msg: 'Current spread: 0.82, Z-score: 0.3 (neutral)' },
      { time: '10:45:15', level: 'OK', msg: 'Z-score crossed 2.0. Opening spread position' },
      { time: '10:45:16', level: 'OK', msg: 'Long 100 SPY @ $479.50, Short 82 QQQ @ $412.10' },
      { time: '13:20:30', level: 'OK', msg: 'Z-score mean reverted to 0.5. Closing position +$523' },
    ],
  },
  'breakout-vol': {
    enabled: true,
    category: 'walk-forward',
    pnlToday: '+$89.25',
    pnlYtd: '+$1,842.50',
    target: 50,
    executed: 45,
    avgPrice: '$168.30',
    winRate: '55%',
    trades: 28,
    logs: [
      { time: '09:30:10', level: 'INFO', msg: 'Walk-forward test started. Period: Week 49' },
      { time: '09:45:00', level: 'INFO', msg: 'Scanning for breakout candidates with volume confirmation' },
      { time: '10:12:30', level: 'OK', msg: 'SMCI: Breakout detected +3.2% with 2.5x volume' },
      { time: '10:12:31', level: 'OK', msg: 'Bought 25 SMCI @ $42.50 (paper trade)' },
    ],
  },
  'vwap-revert': {
    enabled: true,
    category: 'walk-forward',
    pnlToday: '+$312.40',
    pnlYtd: '+$4,567.20',
    target: 75,
    executed: 70,
    avgPrice: '$465.80',
    winRate: '64%',
    trades: 45,
    logs: [
      { time: '09:30:08', level: 'INFO', msg: 'VWAP reversion test active. Watching NVDA, AMD' },
      { time: '09:42:15', level: 'INFO', msg: 'NVDA: Price $468.50, VWAP $465.20 (+0.7% deviation)' },
      { time: '10:05:00', level: 'OK', msg: 'NVDA: Deviation > 1%. Short entry @ $470.25' },
      { time: '11:30:22', level: 'OK', msg: 'NVDA: Mean reverted to VWAP. Closed +$312.40' },
    ],
  },
  'gap-fill': {
    enabled: true,
    category: 'walk-forward',
    pnlToday: '-$78.50',
    pnlYtd: '+$892.30',
    target: 40,
    executed: 35,
    avgPrice: '$142.60',
    winRate: '52%',
    trades: 31,
    logs: [
      { time: '09:30:15', level: 'INFO', msg: 'Gap fill scanner active. Min gap: 2%' },
      { time: '09:31:00', level: 'INFO', msg: 'Found 3 gap-down candidates: TSLA, RIVN, LCID' },
      { time: '09:35:00', level: 'OK', msg: 'TSLA: Gapped down -2.8%. Long entry @ $248.50' },
      { time: '10:45:00', level: 'WARN', msg: 'TSLA: Gap not filling. Down -1.2% from entry' },
      { time: '11:00:00', level: 'ERR', msg: 'TSLA: Stop triggered @ $245.50 (-1.2%)' },
    ],
  },
  'rsi-oversold': {
    enabled: false,
    category: 'disabled',
    pnlYtd: '+$2,145.00',
    reason: 'Paused for parameter optimization',
    logs: [
      { time: 'Nov 28', level: 'INFO', msg: 'Strategy paused by user' },
      { time: 'Nov 25', level: 'WARN', msg: 'Win rate dropped to 45%. Review recommended.' },
      { time: 'Nov 20', level: 'ERR', msg: 'Three consecutive losses. Auto-pause triggered.' },
    ],
  },
  'macd-cross': {
    enabled: false,
    category: 'disabled',
    pnlYtd: '-$1,234.50',
    reason: 'Underperforming - needs review',
    logs: [
      { time: 'Nov 15', level: 'INFO', msg: 'Strategy disabled after review' },
      { time: 'Nov 14', level: 'ERR', msg: 'Sharpe ratio dropped below 0.5' },
      { time: 'Nov 10', level: 'WARN', msg: 'Max drawdown exceeded threshold (-12%)' },
    ],
  },
};

export const ViewTuiDeployments = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedName">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedDeployment"
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

    const allDeployments = [...deployments.production, ...deployments.walkForward, ...deployments.disabled];

    // Get selected deployment from route or default to 'momentum-10'
    const selectedDeployment = Vue.computed(() => route.params.item || 'momentum-10');

    const currentDeployment = Vue.computed(() => {
      return allDeployments.find(d => d.id === selectedDeployment.value) || deployments.production[0];
    });

    const selectedName = Vue.computed(() => currentDeployment.value?.name || '10-day momentum');
    const enabled = Vue.computed(() => !currentDeployment.value?.disabled);

    const menuSections = Vue.computed(() => [
      { header: 'Production', items: deployments.production.map(d => ({ id: d.id, label: d.name, suffix: d.pnl })) },
      { header: 'Walk-forward', items: deployments.walkForward.map(d => ({ id: d.id, label: d.name, suffix: d.pnl })) },
      { header: 'Disabled', items: deployments.disabled.map(d => ({ id: d.id, label: d.name, suffix: d.pnl })) },
    ]);

    const onSelect = (id) => {
      router.push(`/deployments/${id}`);
    };

    const contentLines = Vue.computed(() => {
      const lines = [];
      const data = deploymentData[selectedDeployment.value];

      if (!data) {
        lines.push('Select a deployment to view details');
        return lines;
      }

      // Disabled strategy
      if (!data.enabled) {
        lines.push('Status: [STOPPED] [Enable]');
        lines.push(`Reason: ${data.reason}`);
        lines.push(`YTD P&L: ${data.pnlYtd}`);
        lines.push('');
        lines.push('== History ==');
        data.logs.forEach(log => {
          lines.push(`${log.time} [${log.level}] ${log.msg}`);
        });
        return lines;
      }

      // Active strategy
      lines.push(`Status: [RUNNING] [${data.category === 'walk-forward' ? 'Promote' : 'Pause'}]`);
      lines.push(`P&L Today: ${data.pnlToday} | Target: ${data.target} | Executed: ${data.executed} | Avg: ${data.avgPrice}`);
      lines.push(`YTD: ${data.pnlYtd} | Win: ${data.winRate} | Trades: ${data.trades}`);
      lines.push('');
      lines.push('== Logs ==');

      data.logs.forEach(log => {
        lines.push(`${log.time} [${log.level}] ${log.msg}`);
      });

      return lines;
    });

    return {
      store,
      deployments,
      selectedDeployment,
      selectedName,
      enabled,
      contentLines,
      menuSections,
      onSelect,
    };
  },
};
