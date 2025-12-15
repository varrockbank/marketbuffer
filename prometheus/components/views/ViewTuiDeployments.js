import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

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
  { time: '09:30:01', level: 'INFO', msg: 'Strategy initialized. Watching AAPL, MSFT, GOOGL' },
  { time: '09:31:15', level: 'INFO', msg: 'AAPL: SMA10=142.35, SMA20=141.82, Close=142.50' },
  { time: '09:31:15', level: 'OK', msg: 'AAPL: Entry signal triggered. Bought 100 shares @ $142.38' },
  { time: '09:45:22', level: 'INFO', msg: 'AAPL: Position P&L +0.8% ($112.00)' },
  { time: '10:02:08', level: 'WARN', msg: 'MSFT: Volume spike detected (2.3x avg) but no entry signal' },
  { time: '10:15:33', level: 'INFO', msg: 'AAPL: Position P&L +1.2% ($171.00)' },
  { time: '10:30:01', level: 'OK', msg: 'GOOGL: Entry signal triggered. Bought 50 shares @ $138.92' },
  { time: '11:15:44', level: 'ERR', msg: 'GOOGL: Stop loss hit (-2.1%). Sold 50 shares @ $136.00' },
];

export const ViewTuiDeployments = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedName">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">Production</div>
          <div
            v-for="item in deployments.production"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedDeployment === item.id ? 'active' : ''"
            @click="selectDeployment(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedDeployment === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">{{ item.pnl }}</span>
          </div>

          <div class="kit-tui-header">Walk-forward</div>
          <div
            v-for="item in deployments.walkForward"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedDeployment === item.id ? 'active' : ''"
            @click="selectDeployment(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedDeployment === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">{{ item.pnl }}</span>
          </div>

          <div class="kit-tui-header">Disabled</div>
          <div
            v-for="item in deployments.disabled"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer opacity-60"
            :class="selectedDeployment === item.id ? 'active' : ''"
            @click="selectDeployment(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedDeployment === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">{{ item.pnl }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-1">Status: {{ enabled ? '[RUNNING]' : '[STOPPED]' }} <span class="cursor-pointer" @click="enabled = !enabled">[Toggle]</span></div>
        <div class="mb-2">
          P&L Today: +$1,247.50 | Target: 500 | Executed: 350 | Avg: $142.38
        </div>
        <div class="mb-1">YTD: +$24,832.50 | Win: 67% | Trades: 142</div>
        <div class="flex-1 overflow-auto mt-2">
          <div class="font-bold">== Logs ==</div>
          <div v-for="(log, idx) in logs" :key="idx">
            {{ log.time }} [{{ log.level }}] {{ log.msg }}
          </div>
        </div>
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const selectedDeployment = Vue.ref('momentum-10');
    const selectedName = Vue.ref('10-day momentum');
    const enabled = Vue.ref(true);

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
      selectDeployment,
    };
  },
};
