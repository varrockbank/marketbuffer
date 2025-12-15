import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

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

const agentData = {
  'momentum-bot': {
    strategy: 'momentum.algo',
    pnl: '+$1,245.80',
    positions: 3,
    trades: 12,
    winRate: '75%',
    positions_list: [
      { symbol: 'AAPL', qty: 100, entry: '$189.50', current: '$191.24', pnl: '+$174.00' },
      { symbol: 'NVDA', qty: 50, entry: '$465.20', current: '$468.75', pnl: '+$177.50' },
      { symbol: 'MSFT', qty: 75, entry: '$380.15', current: '$378.90', pnl: '-$93.75' },
    ],
    logs: [
      { time: '14:32:15', type: 'SIGNAL', message: 'Momentum signal detected on NVDA' },
      { time: '14:32:16', type: 'TRADE', message: 'BUY 50 NVDA @ $465.20' },
      { time: '14:15:42', type: 'INFO', message: 'Scanning AAPL, MSFT, GOOGL, NVDA' },
      { time: '13:45:22', type: 'TRADE', message: 'BUY 100 AAPL @ $189.50' },
    ],
  },
  'mean-rev-bot': {
    strategy: 'mean-reversion.algo',
    pnl: '+$892.40',
    positions: 2,
    trades: 8,
    winRate: '62%',
    positions_list: [
      { symbol: 'SPY', qty: 50, entry: '$478.20', current: '$479.85', pnl: '+$82.50' },
      { symbol: 'QQQ', qty: 30, entry: '$410.50', current: '$412.30', pnl: '+$54.00' },
    ],
    logs: [
      { time: '14:28:10', type: 'INFO', message: 'RSI check: SPY=42, QQQ=38, IWM=45' },
      { time: '14:15:05', type: 'TRADE', message: 'BUY 50 SPY @ $478.20 (RSI oversold)' },
      { time: '13:50:22', type: 'SIGNAL', message: 'QQQ approaching oversold territory' },
    ],
  },
  'vwap-bot': {
    strategy: 'vwap-reversion.algo',
    pnl: '-$342.10',
    positions: 0,
    trades: 3,
    winRate: '33%',
    status: 'error',
    error: 'API rate limit exceeded. Retrying in 60s...',
    positions_list: [],
    logs: [
      { time: '14:30:00', type: 'ERR', message: 'API rate limit exceeded' },
      { time: '14:29:58', type: 'ERR', message: 'Failed to fetch VWAP data' },
      { time: '14:15:00', type: 'TRADE', message: 'SELL 25 AMD @ $148.50 (stop loss)' },
      { time: '13:30:00', type: 'INFO', message: 'Bot started, watching AMD, INTC' },
    ],
  },
};

const taskData = {
  'review-algo': {
    description: 'Review momentum algo performance and adjust parameters',
    status: 'completed',
    dueDate: 'Today',
    notes: [
      'Reviewed backtest results from Q3 2024',
      'Win rate improved to 62% after adjusting entry threshold',
      'Recommended: increase position size to 30%',
      'Next review scheduled for Jan 2025',
    ],
  },
  'backtest-spy': {
    description: 'Run backtest on SPY mean reversion strategy',
    status: 'in_progress',
    dueDate: 'Tomorrow',
    notes: [
      'Testing RSI period 14 vs 21',
      'Current results: RSI-14 shows better Sharpe (1.4 vs 1.2)',
      'Need to test different entry thresholds',
      'Progress: 60% complete',
    ],
  },
  'add-stops': {
    description: 'Add stop losses to NVDA position',
    status: 'pending',
    dueDate: 'This week',
    notes: [
      'Current NVDA position: 50 shares @ $465.20',
      'Suggested stop: $445.00 (4.3% below entry)',
      'Consider trailing stop instead',
      'Waiting for volatility to settle',
    ],
  },
};

export const ViewTuiAgents = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedItem.name">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedId"
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

    const allItems = [...agents, ...tasks];

    // Get selected item from route or default to 'momentum-bot'
    const selectedId = Vue.computed(() => route.params.item || 'momentum-bot');

    const selectedItem = Vue.computed(() => {
      return allItems.find(i => i.id === selectedId.value) || agents[0];
    });

    const menuSections = Vue.computed(() => [
      {
        header: 'AI Agents',
        items: agents.map(a => ({
          id: a.id,
          label: a.name,
          prefix: `[${a.letter}] `,
          suffix: a.status === 'running' ? '[RUN]' : '[ERR]',
        })),
      },
      {
        header: 'User Tasks',
        items: tasks.map(t => ({
          id: t.id,
          label: t.name,
          prefix: t.status === 'completed' ? '[x] ' : '[ ] ',
        })),
      },
    ]);

    const onSelect = (id) => {
      router.push(`/agents/${id}`);
    };

    const contentLines = Vue.computed(() => {
      const lines = [];
      const item = selectedItem.value;

      // Check if it's an agent
      const agent = agentData[selectedId.value];
      if (agent) {
        lines.push(`[${item.letter}] ${item.name} | ${agent.strategy}`);
        if (agent.error) {
          lines.push(`ERROR: ${agent.error}`);
        }
        lines.push(`P&L: ${agent.pnl} | Positions: ${agent.positions} | Trades: ${agent.trades} | Win: ${agent.winRate}`);
        lines.push('');
        lines.push(`[Configure] [Logs] [${agent.status === 'error' ? 'Restart' : 'Stop'}]`);
        lines.push('');

        if (agent.positions_list.length > 0) {
          lines.push('== Positions ==');
          lines.push('Symbol | Qty | Entry    | Current  | P&L');
          lines.push('-'.repeat(45));
          agent.positions_list.forEach(pos => {
            lines.push(`${pos.symbol.padEnd(6)} | ${String(pos.qty).padEnd(3)} | ${pos.entry.padEnd(8)} | ${pos.current.padEnd(8)} | ${pos.pnl}`);
          });
          lines.push('');
        }

        lines.push('== Activity Log ==');
        agent.logs.forEach(log => {
          lines.push(`${log.time} [${log.type}] ${log.message}`);
        });

        return lines;
      }

      // It's a task
      const task = taskData[selectedId.value];
      if (task) {
        const statusIcon = task.status === 'completed' ? '[x]' : '[ ]';
        lines.push(`${statusIcon} ${item.name}`);
        lines.push(`Due: ${task.dueDate} | Status: ${task.status}`);
        lines.push('');
        lines.push(task.description);
        lines.push('');
        lines.push(`[${task.status === 'completed' ? 'Reopen' : 'Complete'}] [Edit] [Delete]`);
        lines.push('');
        lines.push('== Notes ==');
        task.notes.forEach(note => {
          lines.push(`- ${note}`);
        });

        return lines;
      }

      lines.push('Select an agent or task to view details');
      return lines;
    });

    return {
      store,
      agents,
      tasks,
      selectedId,
      selectedItem,
      contentLines,
      menuSections,
      onSelect,
    };
  },
};
