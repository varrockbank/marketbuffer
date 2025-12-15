import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

const documents = {
  drafts: [
    { id: 'market-outlook', name: 'Q4 Market Outlook', status: 'draft' },
    { id: 'trading-journal', name: 'Trading Journal - Dec', status: 'draft' },
    { id: 'algo-notes', name: 'Algorithm Design Notes', status: 'draft' },
  ],
  published: [
    { id: 'momentum-guide', name: 'Momentum Trading Guide', status: 'published' },
    { id: 'risk-management', name: 'Risk Management 101', status: 'published' },
    { id: 'backtest-results', name: 'Backtest Results Nov', status: 'published' },
  ],
};

const documentContent = {
  'market-outlook': {
    title: 'Q4 2024 Market Outlook',
    body: `As we enter the final quarter of 2024, markets face a complex landscape.

Key themes:
1. Interest Rate Trajectory
2. Earnings Season Dynamics
3. Technical Levels

Portfolio Positioning:
- Maintaining neutral equity exposure
- Overweight quality factor
- Tactical allocation to volatility strategies`,
  },
  'trading-journal': {
    title: 'Trading Journal - December 2024',
    body: `Week 1 Summary:

Trades Executed: 8
Win Rate: 62.5%
Total P&L: +$1,847.50

Notable Trades:
- NVDA momentum play: +$567.80 (held 2 days)
- AAPL earnings fade: -$125.00 (stopped out)
- SPY mean reversion: +$425.00 (textbook setup)

Lessons Learned:
- Need to reduce position size on earnings plays
- Morning momentum setups working well
- Should add more pairs trades for diversification`,
  },
  'algo-notes': {
    title: 'Algorithm Design Notes',
    body: `Current Strategy Performance Review:

Momentum Strategy (v2.3):
- Sharpe: 1.85 (up from 1.42)
- Key change: Added volume confirmation
- Next: Test 5-day vs 10-day lookback

Mean Reversion (v1.8):
- Sharpe: 1.42
- Issue: Too many false signals in trending markets
- Idea: Add trend filter (SMA50 > SMA200)

Pairs Trading (v1.2):
- Sharpe: 2.15 (best performer)
- Working well, no changes needed
- Consider adding XLF/XLK pair`,
  },
  'momentum-guide': {
    title: 'Momentum Trading Guide',
    body: `A Complete Guide to Momentum Trading

What is Momentum Trading?
Momentum trading is a strategy that aims to capitalize on the
continuance of existing trends in the market.

Key Principles:
1. Trend is your friend
2. Cut losers quickly
3. Let winners run
4. Volume confirms moves

Entry Criteria:
- 10-day return > 2%
- Volume > 1.5x average
- Price above 20-day SMA

Exit Criteria:
- Trailing stop: 5%
- Time stop: 10 days
- Momentum reversal signal`,
  },
  'risk-management': {
    title: 'Risk Management 101',
    body: `Essential Risk Management Principles

Position Sizing:
- Never risk more than 2% per trade
- Scale into positions (1/3 at a time)
- Maximum 6 concurrent positions

Stop Loss Rules:
- Always use stops
- Set before entry, never move down
- Use ATR-based stops for volatility adjustment

Portfolio Rules:
- Max sector exposure: 30%
- Max single stock: 10%
- Cash reserve: 20% minimum

Daily Risk Limits:
- Max daily loss: 3% of portfolio
- Stop trading after 2 consecutive losses`,
  },
  'backtest-results': {
    title: 'Backtest Results - November 2024',
    body: `November 2024 Backtest Summary

Tested: 5 strategy variations
Period: Jan 2020 - Nov 2024

Best Performer: Momentum + Volume Filter
- Annual Return: 24.5%
- Sharpe Ratio: 1.85
- Max Drawdown: -8.3%
- Win Rate: 62%

Worst Performer: Pure RSI Mean Reversion
- Annual Return: 8.2%
- Sharpe Ratio: 0.95
- Max Drawdown: -15.2%
- Win Rate: 48%

Recommendations:
1. Deploy Momentum + Volume to production
2. Pause RSI strategy for parameter optimization
3. Continue walk-forward on Pairs strategy`,
  },
};

export const ViewTuiPublish = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedName">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedDoc"
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

    const allDocs = [...documents.drafts, ...documents.published];

    // Get selected doc from route or default to 'market-outlook'
    const selectedDoc = Vue.computed(() => route.params.doc || 'market-outlook');

    const currentDoc = Vue.computed(() => {
      return allDocs.find(d => d.id === selectedDoc.value) || documents.drafts[0];
    });

    const selectedName = Vue.computed(() => currentDoc.value?.name || 'Q4 Market Outlook');
    const selectedStatus = Vue.computed(() => currentDoc.value?.status || 'draft');

    const menuSections = Vue.computed(() => [
      { header: 'Drafts', items: documents.drafts.map(d => ({ id: d.id, label: d.name, suffix: '[D]' })) },
      { header: 'Published', items: documents.published.map(d => ({ id: d.id, label: d.name, suffix: '[P]' })) },
    ]);

    const currentContent = Vue.computed(() => {
      return documentContent[selectedDoc.value] || { title: '', body: '' };
    });

    const wordCount = Vue.computed(() => {
      const text = currentContent.value.body.trim();
      return text ? text.split(/\s+/).length : 0;
    });

    const onSelect = (id) => {
      router.push(`/publish/${id}`);
    };

    const contentLines = Vue.computed(() => {
      const lines = [];
      const content = currentContent.value;

      lines.push(`${selectedStatus.value === 'published' ? '[Published]' : '[Draft]'} | ${wordCount.value} words | [Preview] [Publish]`);
      lines.push('');
      lines.push('─'.repeat(60));
      lines.push(content.title);
      lines.push('─'.repeat(60));
      lines.push('');

      content.body.split('\n').forEach(line => {
        lines.push(line);
      });

      return lines;
    });

    return {
      store,
      documents,
      selectedDoc,
      selectedName,
      selectedStatus,
      wordCount,
      contentLines,
      menuSections,
      onSelect,
    };
  },
};
