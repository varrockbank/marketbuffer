import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
/* Toggle switch pseudo-element - cannot be done with Tailwind */
.view-deploy-toggle-switch::after {
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
.view-deploy-toggle-switch.active::after {
  transform: translateX(14px);
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
  components: { KitViewLayout, KitSidebarFooter, KitButton },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Production</div>
          <div
            v-for="item in deployments.production"
            :key="item.id"
            class="px-4 py-2.5 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedDeployment === item.id }"
            @click="selectDeployment(item)"
          >
            <div class="font-bold mb-1 text-[var(--text-primary)]">{{ item.name }}</div>
            <div class="text-[11px] font-bold" :class="item.positive ? 'text-[#2ecc71]' : 'text-[#e74c3c]'">{{ item.pnl }} today</div>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Walk-forward Tests</div>
          <div
            v-for="item in deployments.walkForward"
            :key="item.id"
            class="px-4 py-2.5 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedDeployment === item.id }"
            @click="selectDeployment(item)"
          >
            <div class="font-bold mb-1 text-[var(--text-primary)]">{{ item.name }}</div>
            <div class="text-[11px] font-bold" :class="item.positive ? 'text-[#2ecc71]' : 'text-[#e74c3c]'">{{ item.pnl }} today</div>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Disabled</div>
          <div
            v-for="item in deployments.disabled"
            :key="item.id"
            class="px-4 py-2.5 cursor-pointer border-l-[3px] border-transparent opacity-60 transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedDeployment === item.id }"
            @click="selectDeployment(item)"
          >
            <div class="font-bold mb-1 text-[var(--text-primary)]">{{ item.name }}</div>
            <div class="text-[11px] text-[var(--text-secondary)]">{{ item.pnl }}</div>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="archive" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-4">
            <span class="font-bold text-base text-[var(--text-primary)]">{{ selectedName }}</span>
            <div class="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span class="w-2 h-2 rounded-full" :class="enabled ? 'bg-[#2ecc71]' : 'bg-[#95a5a6]'"></span>
              <span>{{ enabled ? 'Running' : 'Stopped' }}</span>
            </div>
          </div>
          <button class="flex items-center gap-2 cursor-pointer px-3 py-1.5 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[11px] rounded hover:bg-[var(--bg-tertiary)]" @click="enabled = !enabled">
            <span class="view-deploy-toggle-switch w-8 h-[18px] rounded-[9px] relative transition-colors" :class="enabled ? 'active bg-[#2ecc71]' : 'bg-[#95a5a6]'"></span>
            <span>{{ enabled ? 'Enabled' : 'Disabled' }}</span>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="p-5 border-b border-[var(--border-color)]">
            <div class="font-bold mb-3 text-[13px] text-[var(--text-primary)]">Today</div>
            <div class="flex gap-8 mb-4 flex-wrap">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">P&L</span>
                <span class="text-lg font-bold text-[#2ecc71]">+$1,247.50</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Target Shares</span>
                <span class="text-lg font-bold text-[var(--text-primary)]">500</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Executed</span>
                <span class="text-lg font-bold text-[var(--text-primary)]">350</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Avg Price</span>
                <span class="text-lg font-bold text-[var(--text-primary)]">$142.38</span>
              </div>
            </div>
          </div>
          <div class="p-5 border-b border-[var(--border-color)]">
            <div class="font-bold mb-3 text-[13px] text-[var(--text-primary)]">Performance YTD</div>
            <div class="flex gap-8 mb-4 flex-wrap">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Total P&L</span>
                <span class="text-lg font-bold text-[#2ecc71]">+$24,832.50</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Win Rate</span>
                <span class="text-lg font-bold text-[var(--text-primary)]">67%</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Trades</span>
                <span class="text-lg font-bold text-[var(--text-primary)]">142</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Avg Win</span>
                <span class="text-lg font-bold text-[#2ecc71]">+$412</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] text-[var(--text-secondary)] uppercase">Avg Loss</span>
                <span class="text-lg font-bold text-[#e74c3c]">-$198</span>
              </div>
            </div>
            <div class="flex gap-0.5 h-10 items-end">
              <div v-for="(bar, idx) in chartBars" :key="idx" class="flex-1 min-w-[3px] max-w-2 rounded-[1px]" :class="bar.positive ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'" :style="{ height: bar.height + 'px' }"></div>
            </div>
          </div>
          <div class="p-5 border-t border-[var(--border-color)]">
            <div class="font-bold mb-3 text-[13px] text-[var(--text-secondary)]">Logs</div>
            <div class="font-mono text-[10px] leading-relaxed bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)] rounded">
              <div v-for="(log, idx) in logs" :key="idx" class="flex gap-3">
                <span class="text-[var(--text-secondary)] shrink-0">{{ log.time }}</span>
                <span class="shrink-0 w-[55px] font-bold" :class="{'text-[#3498db]': log.level === 'info', 'text-[#f39c12]': log.level === 'warn', 'text-[#e74c3c]': log.level === 'error', 'text-[#2ecc71]': log.level === 'success'}">[{{ log.level.toUpperCase() }}]</span>
                <span class="flex-1 text-[var(--text-primary)]">{{ log.msg }}</span>
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
