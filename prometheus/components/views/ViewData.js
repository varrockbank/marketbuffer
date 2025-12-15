import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';

// Mock data sources
const dataSources = {
  userData: [
    { id: 'portfolio', name: 'portfolio.csv', rows: '1.2k', type: 'file' },
    { id: 'transactions', name: 'transactions.pqt', rows: '8.4k', type: 'file' },
    { id: 'watchlist', name: 'watchlist.json', rows: '45', type: 'file' },
  ],
  datamart: [
    { id: 'stocks_daily', name: 'stocks_daily', rows: '2.1M', type: 'table' },
    { id: 'stocks_intraday', name: 'stocks_intraday', rows: '48M', type: 'table' },
    { id: 'earnings', name: 'earnings', rows: '125k', type: 'table' },
    { id: 'fundamentals', name: 'fundamentals', rows: '42k', type: 'table' },
    { id: 'options_chain', name: 'options_chain', rows: '890k', type: 'table' },
  ],
};

// Mock table data
const tableData = {
  portfolio: {
    columns: ['id', 'ticker', 'shares', 'avg_cost', 'current_price', 'pnl'],
    rows: [
      [1, 'AAPL', 150, 142.50, 178.25, 5362.50],
      [2, 'MSFT', 75, 285.00, 378.50, 7012.50],
      [3, 'GOOGL', 40, 125.75, 138.92, 526.80],
      [4, 'AMZN', 60, 145.20, 178.35, 1989.00],
      [5, 'NVDA', 25, 420.00, 495.80, 1895.00],
      [6, 'TSLA', 30, 265.50, 248.20, -519.00],
      [7, 'META', 45, 298.00, 505.75, 9348.75],
      [8, 'JPM', 80, 145.25, 198.40, 4252.00],
      [9, 'V', 55, 225.80, 278.95, 2923.25],
      [10, 'JNJ', 100, 162.40, 155.20, -720.00],
    ],
    totalRows: 1247,
    columns_count: 6,
  },
};


export const ViewData = {
  components: { KitViewLayout, KitSidebarFooter, KitButton, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">User Data</div>
          <div
            v-for="item in dataSources.userData"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedTable === item.id }"
            @click="selectTable(item.id)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon icon="file" :size="14" /></span>
            <span class="truncate text-[var(--text-primary)]">{{ item.name }}</span>
            <span class="text-[10px] text-[var(--text-secondary)] ml-auto">{{ item.rows }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Datamart</div>
          <div
            v-for="item in dataSources.datamart"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedTable === item.id }"
            @click="selectTable(item.id)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon icon="table" :size="14" /></span>
            <span class="truncate text-[var(--text-primary)]">{{ item.name }}</span>
            <span class="text-[10px] text-[var(--text-secondary)] ml-auto">{{ item.rows }}</span>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="upload" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <span class="font-bold text-base text-[var(--text-primary)]">{{ selectedTableName }}</span>
            <span class="text-[11px] text-[var(--text-secondary)]">{{ currentData.totalRows.toLocaleString() }} rows • {{ currentData.columns_count }} columns • Updated 2 min ago</span>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto flex flex-col">
          <div class="px-5 py-4 border-b border-[var(--border-color)]">
            <div class="font-bold mb-3 text-[13px] flex items-center justify-between text-[var(--text-primary)]">
              <span>Preview</span>
              <span class="font-normal text-[var(--text-secondary)] text-[11px]">Showing {{ currentData.rows.length }} of {{ currentData.totalRows.toLocaleString() }} rows</span>
            </div>
            <div class="overflow-x-auto border border-[var(--border-color)] rounded">
              <table class="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th v-for="col in currentData.columns" :key="col" class="bg-[var(--bg-secondary)] px-3 py-2 text-left font-bold border-b border-[var(--border-color)] whitespace-nowrap text-[var(--text-primary)]">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in currentData.rows" :key="idx" class="hover:bg-[var(--bg-tertiary)]">
                    <td v-for="(cell, cidx) in row" :key="cidx" class="px-3 py-1.5 border-b border-[var(--border-color)] whitespace-nowrap text-[var(--text-primary)] last:border-b-0" :class="{ 'text-right tabular-nums': typeof cell === 'number' }">
                      {{ formatCell(cell) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="px-5 py-4 flex-1 flex flex-col">
            <div class="font-bold mb-3 text-[13px] flex items-center gap-3 text-[var(--text-primary)]">
              <span>SQL Query</span>
              <button class="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]" @click="runQuery">Run ⌘↵</button>
            </div>
            <textarea
              class="flex-1 min-h-[120px] p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded font-mono text-xs text-[var(--text-primary)] resize-none outline-none placeholder:text-[var(--text-secondary)]"
              v-model="sqlQuery"
              @keydown="handleKeydown"
              placeholder="SELECT * FROM portfolio WHERE pnl > 1000 ORDER BY pnl DESC"
            ></textarea>
            <div class="mt-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded font-mono text-[11px] min-h-[60px] whitespace-pre-wrap" :class="sqlResults ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'">
              {{ sqlResults || 'Press Run or ⌘+Enter to execute query' }}
            </div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    const selectedTable = Vue.ref('portfolio');
    const sqlQuery = Vue.ref('');
    const sqlResults = Vue.ref('');

    const selectedTableName = Vue.computed(() => {
      const allSources = [...dataSources.userData, ...dataSources.datamart];
      const source = allSources.find(s => s.id === selectedTable.value);
      return source ? source.name : selectedTable.value;
    });

    const currentData = Vue.computed(() => {
      return tableData[selectedTable.value] || tableData.portfolio;
    });

    const selectTable = (id) => {
      selectedTable.value = id;
    };

    const formatCell = (cell) => {
      if (typeof cell === 'number') {
        return cell.toLocaleString(undefined, { minimumFractionDigits: cell % 1 !== 0 ? 2 : 0 });
      }
      return cell;
    };

    const runQuery = () => {
      const query = sqlQuery.value.trim();
      if (!query) {
        sqlResults.value = '❌ No query to execute';
        return;
      }
      sqlResults.value = '✓ Query executed successfully\n\nReturned 7 rows in 0.023s';
    };

    const handleKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runQuery();
      }
    };

    return {
      store,
      dataSources,
      selectedTable,
      selectedTableName,
      currentData,
      sqlQuery,
      sqlResults,
      selectTable,
      formatCell,
      runQuery,
      handleKeydown,
    };
  },
};
