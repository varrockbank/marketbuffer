import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

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
  { symbol: 'AAPL', qty: 100, entry: '$189.50', current: '$191.24', pnl: '+$174.00' },
  { symbol: 'NVDA', qty: 50, entry: '$465.20', current: '$468.75', pnl: '+$177.50' },
  { symbol: 'MSFT', qty: 75, entry: '$380.15', current: '$378.90', pnl: '-$93.75' },
];

const logs = [
  { time: '14:32:15', type: 'SIGNAL', message: 'Momentum signal detected on NVDA' },
  { time: '14:32:16', type: 'TRADE', message: 'BUY 50 NVDA @ $465.20' },
  { time: '14:15:42', type: 'INFO', message: 'Scanning AAPL, MSFT, GOOGL, NVDA' },
  { time: '13:45:22', type: 'TRADE', message: 'BUY 100 AAPL @ $189.50' },
  { time: '13:45:21', type: 'SIGNAL', message: 'Momentum signal on AAPL confirmed' },
];

export const ViewTuiAgents = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedItem.name">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">AI Agents</div>
          <div
            v-for="agent in agents"
            :key="agent.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedId === agent.id ? 'active' : ''"
            @click="selectItem(agent)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedId === agent.id ? '>' : '' }}</span>
            <span>[{{ agent.letter }}]</span>
            <span class="truncate flex-1 ml-1">{{ agent.name }}</span>
            <span class="ml-1">{{ agent.status === 'running' ? '[RUN]' : '[ERR]' }}</span>
          </div>

          <div class="kit-tui-header">User Tasks</div>
          <div
            v-for="task in tasks"
            :key="task.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedId === task.id ? 'active' : ''"
            @click="selectItem(task)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedId === task.id ? '>' : '' }}</span>
            <span>{{ task.status === 'completed' ? '[x]' : '[ ]' }}</span>
            <span class="truncate flex-1 ml-1">{{ task.name }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-1">[{{ selectedItem.letter || selectedItem.name.charAt(0) }}] {{ selectedItem.name }} | {{ selectedItem.type === 'agent' ? 'momentum.algo' : selectedItem.statusText }}</div>
        <div class="mb-2">
          P&L: +$1,245.80 | Positions: 3 | Trades: 12 | Win: 75%
        </div>
        <div class="mb-1">[Configure] [Logs] {{ selectedItem.type === 'agent' ? '[Stop]' : '[Complete]' }}</div>

        <div class="mt-2">
          <div class="font-bold">== Positions ==</div>
          <div>Symbol | Qty | Entry    | Current  | P&L</div>
          <div>{{ '-'.repeat(45) }}</div>
          <div v-for="(pos, idx) in positions" :key="idx">
            {{ pos.symbol.padEnd(6) }} | {{ String(pos.qty).padEnd(3) }} | {{ pos.entry.padEnd(8) }} | {{ pos.current.padEnd(8) }} | {{ pos.pnl }}
          </div>
        </div>

        <div class="flex-1 overflow-auto mt-2">
          <div class="font-bold">== Activity Log ==</div>
          <div v-for="(log, idx) in logs" :key="idx">
            {{ log.time }} [{{ log.type }}] {{ log.message }}
          </div>
        </div>
      </div>
    </KitTUIViewLayout>
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
