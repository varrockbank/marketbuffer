import { store } from '../../store.js';
import { ViewLayout } from '../ViewLayout.js';
import { NavFooter } from '../NavFooter.js';
import { Button } from '../Button.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-data-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-data-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-data-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-data-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
}

.view-view-data-item:hover {
  background: var(--bg-tertiary);
}

.view-view-data-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.view-view-data-item-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.view-view-data-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.view-view-data-item-rows {
  font-size: 10px;
  color: var(--text-secondary);
  margin-left: auto;
}

.view-view-data-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-data-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.view-view-data-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-view-data-header-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.view-view-data-header-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.view-view-data-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.view-view-data-preview {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.view-view-data-preview-header {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-primary);
}

.view-view-data-preview-count {
  font-weight: normal;
  color: var(--text-secondary);
  font-size: 11px;
}

.view-view-data-table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.view-view-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.view-view-data-table th {
  background: var(--bg-secondary);
  padding: 8px 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
  color: var(--text-primary);
}

.view-view-data-table td {
  padding: 6px 12px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
  color: var(--text-primary);
}

.view-view-data-table tr:last-child td {
  border-bottom: none;
}

.view-view-data-table tr:hover td {
  background: var(--bg-tertiary);
}

.view-view-data-table .null {
  color: var(--text-secondary);
  font-style: italic;
}

.view-view-data-table .number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.view-view-data-sql {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.view-view-data-sql-header {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
}

.view-view-data-sql-run {
  padding: 4px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
}

.view-view-data-sql-run:hover {
  background: var(--bg-tertiary);
}

.view-view-data-sql-editor {
  flex: 1;
  min-height: 120px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 12px;
  color: var(--text-primary);
  resize: none;
  outline: none;
}

.view-view-data-sql-editor::placeholder {
  color: var(--text-secondary);
}

.view-view-data-sql-results {
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 11px;
  color: var(--text-secondary);
  min-height: 60px;
  white-space: pre-wrap;
}

.view-view-data-sql-results.has-results {
  color: var(--text-primary);
}
`;

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

const icons = {
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>',
  table: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
};

export const ViewData = {
  components: { ViewLayout, NavFooter, Button },
  template: `
    <ViewLayout>
      <template #menu>
        <div class="view-view-data-sidebar-content">
          <div class="view-view-data-sidebar-header">User Data</div>
          <div
            v-for="item in dataSources.userData"
            :key="item.id"
            class="view-view-data-item"
            :class="{ active: selectedTable === item.id }"
            @click="selectTable(item.id)"
          >
            <svg class="view-view-data-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.file"></svg>
            <span class="view-view-data-item-name">{{ item.name }}</span>
            <span class="view-view-data-item-rows">{{ item.rows }}</span>
          </div>

          <div class="view-view-data-sidebar-header">Datamart</div>
          <div
            v-for="item in dataSources.datamart"
            :key="item.id"
            class="view-view-data-item"
            :class="{ active: selectedTable === item.id }"
            @click="selectTable(item.id)"
          >
            <svg class="view-view-data-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.table"></svg>
            <span class="view-view-data-item-name">{{ item.name }}</span>
            <span class="view-view-data-item-rows">{{ item.rows }}</span>
          </div>
        </div>
        <NavFooter>
          <Button>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.upload"></svg>
          </Button>
          <Button>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.plus"></svg>
          </Button>
        </NavFooter>
      </template>

      <div class="view-view-data-main">
        <div class="view-view-data-header">
          <div class="view-view-data-header-left">
            <span class="view-view-data-header-title">{{ selectedTableName }}</span>
            <span class="view-view-data-header-meta">{{ currentData.totalRows.toLocaleString() }} rows • {{ currentData.columns_count }} columns • Updated 2 min ago</span>
          </div>
        </div>
        <div class="view-view-data-content">
          <div class="view-view-data-preview">
            <div class="view-view-data-preview-header">
              <span>Preview</span>
              <span class="view-view-data-preview-count">Showing {{ currentData.rows.length }} of {{ currentData.totalRows.toLocaleString() }} rows</span>
            </div>
            <div class="view-view-data-table-wrapper">
              <table class="view-view-data-table">
                <thead>
                  <tr>
                    <th v-for="col in currentData.columns" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in currentData.rows" :key="idx">
                    <td v-for="(cell, cidx) in row" :key="cidx" :class="{ number: typeof cell === 'number' }">
                      {{ formatCell(cell) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="view-view-data-sql">
            <div class="view-view-data-sql-header">
              <span>SQL Query</span>
              <button class="view-view-data-sql-run" @click="runQuery">Run ⌘↵</button>
            </div>
            <textarea
              class="view-view-data-sql-editor"
              v-model="sqlQuery"
              @keydown="handleKeydown"
              placeholder="SELECT * FROM portfolio WHERE pnl > 1000 ORDER BY pnl DESC"
            ></textarea>
            <div class="view-view-data-sql-results" :class="{ 'has-results': sqlResults }">
              {{ sqlResults || 'Press Run or ⌘+Enter to execute query' }}
            </div>
          </div>
        </div>
      </div>
    </ViewLayout>
  `,
  setup() {
    useStyles('view-data-styles', styles);

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
      dataSources,
      icons,
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
