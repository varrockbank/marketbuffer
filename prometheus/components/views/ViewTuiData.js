import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

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
  // User Data
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
    ],
    totalRows: 1247,
    columns_count: 6,
  },
  transactions: {
    columns: ['id', 'date', 'ticker', 'type', 'shares', 'price', 'total'],
    rows: [
      [1, '2024-12-01', 'NVDA', 'BUY', 25, 465.20, 11630.00],
      [2, '2024-11-28', 'AAPL', 'BUY', 50, 189.50, 9475.00],
      [3, '2024-11-25', 'MSFT', 'SELL', 25, 378.91, 9472.75],
      [4, '2024-11-22', 'GOOGL', 'BUY', 40, 125.75, 5030.00],
      [5, '2024-11-20', 'TSLA', 'SELL', 20, 248.20, 4964.00],
      [6, '2024-11-15', 'META', 'BUY', 45, 298.00, 13410.00],
    ],
    totalRows: 8421,
    columns_count: 7,
  },
  watchlist: {
    columns: ['ticker', 'name', 'price', 'change', 'volume', 'alert'],
    rows: [
      ['AMD', 'Advanced Micro Devices', 148.50, '+2.3%', '45.2M', '$150.00'],
      ['PLTR', 'Palantir Technologies', 24.80, '+5.1%', '82.1M', '$25.00'],
      ['SNOW', 'Snowflake Inc', 168.25, '-1.2%', '12.4M', '$175.00'],
      ['CRWD', 'CrowdStrike Holdings', 285.40, '+0.8%', '8.2M', '$290.00'],
      ['DDOG', 'Datadog Inc', 125.60, '+1.5%', '6.8M', '$130.00'],
    ],
    totalRows: 45,
    columns_count: 6,
  },
  // Datamart
  stocks_daily: {
    columns: ['date', 'ticker', 'open', 'high', 'low', 'close', 'volume'],
    rows: [
      ['2024-12-01', 'AAPL', 178.50, 180.25, 177.80, 179.25, 52340000],
      ['2024-12-01', 'MSFT', 378.00, 382.50, 376.20, 380.15, 28450000],
      ['2024-12-01', 'GOOGL', 138.20, 140.15, 137.50, 139.80, 18920000],
      ['2024-12-01', 'NVDA', 468.00, 475.50, 465.20, 472.30, 45680000],
      ['2024-12-01', 'TSLA', 250.00, 252.80, 245.50, 248.20, 82150000],
      ['2024-11-30', 'AAPL', 176.80, 179.00, 175.50, 178.50, 48920000],
    ],
    totalRows: 2100000,
    columns_count: 7,
  },
  stocks_intraday: {
    columns: ['timestamp', 'ticker', 'price', 'volume', 'bid', 'ask'],
    rows: [
      ['14:32:15', 'AAPL', 179.25, 1250, 179.24, 179.26],
      ['14:32:14', 'AAPL', 179.24, 800, 179.23, 179.25],
      ['14:32:13', 'MSFT', 380.15, 450, 380.14, 380.16],
      ['14:32:12', 'NVDA', 472.30, 2100, 472.28, 472.32],
      ['14:32:11', 'GOOGL', 139.80, 680, 139.79, 139.81],
    ],
    totalRows: 48000000,
    columns_count: 6,
  },
  earnings: {
    columns: ['ticker', 'date', 'quarter', 'eps_est', 'eps_act', 'surprise'],
    rows: [
      ['AAPL', '2024-11-01', 'Q4 2024', 1.39, 1.46, '+5.0%'],
      ['MSFT', '2024-10-30', 'Q1 2025', 2.95, 3.10, '+5.1%'],
      ['GOOGL', '2024-10-29', 'Q3 2024', 1.85, 1.75, '-5.4%'],
      ['AMZN', '2024-10-31', 'Q3 2024', 1.14, 1.20, '+5.3%'],
      ['META', '2024-10-30', 'Q3 2024', 5.28, 5.42, '+2.7%'],
      ['NVDA', '2024-11-20', 'Q3 2025', 0.74, 0.81, '+9.5%'],
    ],
    totalRows: 125000,
    columns_count: 6,
  },
  fundamentals: {
    columns: ['ticker', 'pe_ratio', 'market_cap', 'dividend', 'beta', 'sector'],
    rows: [
      ['AAPL', 29.5, '2.8T', '0.48%', 1.25, 'Technology'],
      ['MSFT', 35.2, '2.9T', '0.72%', 0.92, 'Technology'],
      ['GOOGL', 24.8, '1.7T', '0.00%', 1.08, 'Technology'],
      ['AMZN', 62.4, '1.9T', '0.00%', 1.22, 'Consumer'],
      ['NVDA', 65.8, '1.2T', '0.03%', 1.85, 'Technology'],
      ['JPM', 11.2, '580B', '2.25%', 1.12, 'Financial'],
    ],
    totalRows: 42000,
    columns_count: 6,
  },
  options_chain: {
    columns: ['ticker', 'expiry', 'strike', 'type', 'bid', 'ask', 'volume'],
    rows: [
      ['AAPL', '2024-12-20', 180.00, 'CALL', 2.45, 2.48, 15420],
      ['AAPL', '2024-12-20', 180.00, 'PUT', 3.12, 3.15, 12350],
      ['NVDA', '2024-12-20', 500.00, 'CALL', 8.50, 8.65, 28400],
      ['NVDA', '2024-12-20', 450.00, 'PUT', 5.20, 5.35, 18200],
      ['TSLA', '2024-12-20', 250.00, 'CALL', 12.80, 12.95, 45600],
      ['SPY', '2024-12-20', 480.00, 'CALL', 4.25, 4.30, 125000],
    ],
    totalRows: 890000,
    columns_count: 7,
  },
};

export const ViewTuiData = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedTableName">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedTable"
          @select="selectTable"
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

    const sqlQuery = Vue.ref('');
    const sqlResults = Vue.ref('');

    // Get selected table from route or default to 'portfolio'
    const selectedTable = Vue.computed(() => route.params.table || 'portfolio');

    // Build menu sections for vbuf sidenav
    const menuSections = Vue.computed(() => [
      {
        header: 'User Data',
        items: dataSources.userData.map(d => ({ id: d.id, label: d.name, suffix: d.rows })),
      },
      {
        header: 'Datamart',
        items: dataSources.datamart.map(d => ({ id: d.id, label: d.name, suffix: d.rows })),
      },
    ]);

    const selectedTableName = Vue.computed(() => {
      const allSources = [...dataSources.userData, ...dataSources.datamart];
      const source = allSources.find(s => s.id === selectedTable.value);
      return source ? source.name : selectedTable.value;
    });

    const currentData = Vue.computed(() => {
      return tableData[selectedTable.value] || tableData.portfolio;
    });

    const selectTable = (id) => {
      router.push(`/data/${id}`);
    };

    // Build content lines for vbuf
    const contentLines = Vue.computed(() => {
      const data = currentData.value;
      const lines = [];

      lines.push(`${data.totalRows.toLocaleString()} rows | ${data.columns_count} columns`);
      lines.push('');
      lines.push(data.columns.join(' | '));
      lines.push('-'.repeat(60));

      data.rows.forEach(row => {
        lines.push(row.join(' | '));
      });

      lines.push('');
      lines.push('─'.repeat(60));
      lines.push(`SQL> ${sqlQuery.value || 'SELECT * FROM portfolio WHERE pnl > 1000'}`);

      if (sqlResults.value) {
        lines.push(sqlResults.value);
      }

      return lines;
    });

    return {
      store,
      dataSources,
      selectedTable,
      selectedTableName,
      currentData,
      contentLines,
      menuSections,
      selectTable,
    };
  },
};
