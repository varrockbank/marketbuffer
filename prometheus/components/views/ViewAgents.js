import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';

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
  components: { KitViewLayout, KitSidebarFooter, KitButton, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">AI Agents</div>
          <div
            v-for="agent in agents"
            :key="agent.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedId === agent.id }"
            @click="selectItem(agent)"
          >
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" :class="{'bg-[#2ecc71] text-white': agent.status === 'running', 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]': agent.status === 'idle', 'bg-[#e74c3c] text-white': agent.status === 'error'}">{{ agent.letter }}</div>
            <div class="flex-1 min-w-0">
              <div class="truncate text-[var(--text-primary)]">{{ agent.name }}</div>
              <div class="text-[10px] text-[var(--text-secondary)]">{{ agent.statusText }}</div>
            </div>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">User Tasks</div>
          <div
            v-for="task in tasks"
            :key="task.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedId === task.id }"
            @click="selectItem(task)"
          >
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0" :class="task.status === 'pending' ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' : 'bg-[#3498db] text-white'">
              <KitIcon :icon="task.status === 'completed' ? 'check' : 'circle'" :size="12" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="truncate text-[var(--text-primary)]">{{ task.name }}</div>
              <div class="text-[10px] text-[var(--text-secondary)]">{{ task.statusText }}</div>
            </div>
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
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold text-white" :class="{'bg-[#2ecc71]': selectedItem.status === 'running', 'bg-[#e74c3c]': selectedItem.status === 'error', 'bg-[#3498db]': selectedItem.type === 'task'}">{{ selectedItem.letter || selectedItem.name.charAt(0) }}</div>
            <div class="flex flex-col">
              <span class="font-bold text-base text-[var(--text-primary)]">{{ selectedItem.name }}</span>
              <span class="text-[11px] text-[var(--text-secondary)]">{{ selectedItem.type === 'agent' ? 'momentum.algo | AAPL, MSFT, GOOGL, NVDA' : selectedItem.statusText }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Configure</button>
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Logs</button>
            <button v-if="selectedItem.type === 'agent'" class="px-3 py-1.5 bg-[#e74c3c] border border-[#e74c3c] text-white text-[11px] cursor-pointer rounded hover:bg-[#c0392b]">Stop</button>
            <button v-else class="px-3 py-1.5 bg-[#2ecc71] border border-[#2ecc71] text-white text-[11px] cursor-pointer rounded hover:bg-[#27ae60]">Complete</button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-5">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Today P&L</div>
              <div class="text-2xl font-bold text-[#2ecc71]">+$1,245.80</div>
            </div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Open Positions</div>
              <div class="text-2xl font-bold text-[var(--text-primary)]">3</div>
            </div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Trades Today</div>
              <div class="text-2xl font-bold text-[var(--text-primary)]">12</div>
            </div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
              <div class="text-[11px] text-[var(--text-secondary)] uppercase tracking-wide mb-2">Win Rate</div>
              <div class="text-2xl font-bold text-[var(--text-primary)]">75%</div>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-bold text-[13px] mb-3 text-[var(--text-secondary)] uppercase tracking-wide">Open Positions</div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded overflow-hidden">
              <div class="grid grid-cols-[1fr_100px_100px_100px_100px] px-4 py-3 bg-[var(--bg-tertiary)] text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">
                <div>Symbol</div>
                <div>Qty</div>
                <div>Entry</div>
                <div>Current</div>
                <div>P&L</div>
              </div>
              <div v-for="(pos, idx) in positions" :key="idx" class="grid grid-cols-[1fr_100px_100px_100px_100px] px-4 py-3 border-t border-[var(--border-color)] text-xs text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                <div>{{ pos.symbol }}</div>
                <div>{{ pos.qty }}</div>
                <div>{{ pos.entry }}</div>
                <div>{{ pos.current }}</div>
                <div :class="{ 'text-[#2ecc71]': pos.positive, 'text-[#e74c3c]': !pos.positive }">{{ pos.pnl }}</div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-bold text-[13px] mb-3 text-[var(--text-secondary)] uppercase tracking-wide">Activity Log</div>
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded max-h-[300px] overflow-y-auto">
              <div v-for="(log, idx) in logs" :key="idx" class="flex px-3 py-2 border-b border-[var(--border-color)] gap-3 text-[11px] last:border-b-0">
                <span class="text-[var(--text-secondary)] font-mono shrink-0">{{ log.time }}</span>
                <span class="w-[60px] shrink-0 font-bold" :class="{'text-[#3498db]': log.type === 'info', 'text-[#2ecc71]': log.type === 'trade', 'text-[#e74c3c]': log.type === 'error', 'text-[#f39c12]': log.type === 'signal'}">{{ log.type.toUpperCase() }}</span>
                <span class="flex-1 text-[var(--text-primary)]">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
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
      selectedId,
      selectedItem,
      selectItem,
    };
  },
};
