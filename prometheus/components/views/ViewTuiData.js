import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

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

export const ViewTuiData = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedTableName">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">User Data</div>
          <div
            v-for="item in dataSources.userData"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedTable === item.id ? 'active' : ''"
            @click="selectTable(item.id)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedTable === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">{{ item.rows }}</span>
          </div>

          <div class="kit-tui-header">Datamart</div>
          <div
            v-for="item in dataSources.datamart"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedTable === item.id ? 'active' : ''"
            @click="selectTable(item.id)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedTable === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">{{ item.rows }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-1">{{ currentData.totalRows.toLocaleString() }} rows | {{ currentData.columns_count }} columns</div>
        <div class="flex-1 overflow-auto">
          <div class="font-bold">{{ currentData.columns.join(' | ') }}</div>
          <div>{{ '-'.repeat(60) }}</div>
          <div v-for="(row, idx) in currentData.rows" :key="idx">
            {{ row.join(' | ') }}
          </div>
        </div>
        <div class="shrink-0 mt-2" style="border-top: 1px solid var(--tui-fg); border-bottom: 1px solid var(--tui-fg);">
          <div class="flex items-center">
            <span style="width: 4ch;">SQL></span>
            <input
              type="text"
              class="flex-1 bg-transparent outline-none"
              placeholder="SELECT * FROM portfolio WHERE pnl > 1000"
              v-model="sqlQuery"
              @keydown.enter="runQuery"
            >
          </div>
        </div>
        <div v-if="sqlResults" class="mt-1">{{ sqlResults }}</div>
      </div>
    </KitTUIViewLayout>
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

    const runQuery = () => {
      const query = sqlQuery.value.trim();
      if (!query) {
        sqlResults.value = 'ERROR: No query to execute';
        return;
      }
      sqlResults.value = 'OK: 7 rows returned in 0.023s';
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
      runQuery,
    };
  },
};
