import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

const feeds = {
  news: [
    { id: 'all-news', name: 'All News', badge: '24' },
    { id: 'earnings', name: 'Earnings', badge: '8' },
    { id: 'sec-filings', name: 'SEC Filings', badge: '12' },
  ],
  rss: [
    { id: 'bloomberg', name: 'Bloomberg', badge: '15' },
    { id: 'reuters', name: 'Reuters', badge: '9' },
    { id: 'wsj', name: 'WSJ Markets', badge: '7' },
    { id: 'reddit', name: 'r/wallstreetbets', badge: '31' },
  ],
  alerts: [
    { id: 'price-alerts', name: 'Price Alerts', badge: '3', isAlert: true },
    { id: 'volume-alerts', name: 'Volume Alerts', badge: '1', isAlert: true },
    { id: 'earnings-alerts', name: 'Earnings Alerts', badge: '0' },
  ],
  scanners: [
    { id: 'gap-up', name: 'Gap Up >3%', badge: '18' },
    { id: 'high-volume', name: 'High Volume', badge: '42' },
    { id: 'new-highs', name: '52wk Highs', badge: '27' },
    { id: 'unusual-options', name: 'Unusual Options', badge: '13' },
  ],
};

const feedEntries = {
  // News
  'all-news': [
    { source: 'Bloomberg', time: '2m', title: 'Fed Officials Signal Potential Rate Cut in Early 2025' },
    { source: 'Reuters', time: '15m', title: 'Apple Announces $100B Stock Buyback Program' },
    { source: 'SEC', time: '45m', title: 'Microsoft Corp - Form 10-K Annual Report Filed' },
    { source: 'WSJ', time: '1h', title: 'Oil Prices Surge 4% on Middle East Supply Concerns' },
    { source: 'Bloomberg', time: '1h', title: 'Tesla Deliveries Miss Estimates' },
  ],
  earnings: [
    { source: 'Earnings', time: '5m', title: 'AAPL Q4 EPS $1.46 vs $1.39 est, Revenue $89.5B vs $88.2B' },
    { source: 'Earnings', time: '1h', title: 'MSFT Cloud Revenue +29% YoY, Beats Estimates' },
    { source: 'Earnings', time: '2h', title: 'GOOGL Ad Revenue Disappoints, Stock Down 3% AH' },
    { source: 'Earnings', time: '4h', title: 'AMZN AWS Growth Slows to 12%, Guidance Weak' },
    { source: 'Preview', time: '1d', title: 'NVDA Reports Tomorrow - Options Imply 8% Move' },
  ],
  'sec-filings': [
    { source: 'Form 4', time: '10m', title: 'NVDA CEO Jensen Huang sells 100,000 shares @ $468' },
    { source: '10-K', time: '45m', title: 'Microsoft Corp - Annual Report Filed' },
    { source: '8-K', time: '2h', title: 'Tesla - Material Event: New Factory Announcement' },
    { source: '13F', time: '1d', title: 'Berkshire Q3 Holdings: Added OXY, Trimmed AAPL' },
    { source: 'Form 4', time: '1d', title: 'META Zuckerberg sells 50,000 shares @ $505' },
  ],
  // RSS
  bloomberg: [
    { source: 'Bloomberg', time: '2m', title: 'Fed Officials Signal Potential Rate Cut in Early 2025' },
    { source: 'Bloomberg', time: '1h', title: 'Tesla Deliveries Miss Estimates' },
    { source: 'Bloomberg', time: '3h', title: 'China Tech Stocks Rally on Stimulus Hopes' },
    { source: 'Bloomberg', time: '5h', title: 'Gold Hits Record High Amid Geopolitical Tensions' },
  ],
  reuters: [
    { source: 'Reuters', time: '15m', title: 'Apple Announces $100B Stock Buyback Program' },
    { source: 'Reuters', time: '2h', title: 'European Markets Close Higher on ECB Comments' },
    { source: 'Reuters', time: '4h', title: 'Oil Inventories Fall More Than Expected' },
  ],
  wsj: [
    { source: 'WSJ', time: '1h', title: 'Oil Prices Surge 4% on Middle East Supply Concerns' },
    { source: 'WSJ', time: '3h', title: 'Inflation Data Shows Signs of Cooling' },
    { source: 'WSJ', time: '6h', title: 'Housing Market Shows Mixed Signals' },
  ],
  reddit: [
    { source: 'WSB', time: '5m', title: 'YOLO: $50k on NVDA 500C expiring Friday' },
    { source: 'WSB', time: '20m', title: 'GME short interest rising again. Round 2?' },
    { source: 'WSB', time: '1h', title: 'Loss porn: -$200k on TSLA puts. F in chat' },
    { source: 'WSB', time: '2h', title: 'DD: Why AMD will hit $200 by Q2' },
    { source: 'WSB', time: '3h', title: 'Apes together strong. PLTR to the moon' },
  ],
  // Alerts
  'price-alerts': [
    { source: 'ALERT', time: '23m', title: 'NVDA crossed above $500.00', isAlert: true },
    { source: 'ALERT', time: '1h', title: 'AAPL hit target price $180.00', isAlert: true },
    { source: 'ALERT', time: '3h', title: 'TSLA dropped below $250.00 stop', isAlert: true },
  ],
  'volume-alerts': [
    { source: 'ALERT', time: '2h', title: 'Unusual volume in AMD (3.5x avg)', isAlert: true },
  ],
  'earnings-alerts': [],
  // Scanners
  'gap-up': [
    { source: 'Scanner', time: 'now', title: 'SMCI +8.2% - AI server demand' },
    { source: 'Scanner', time: 'now', title: 'RIVN +5.4% - Delivery numbers beat' },
    { source: 'Scanner', time: 'now', title: 'COIN +4.8% - Bitcoin rally' },
    { source: 'Scanner', time: 'now', title: 'MARA +6.1% - Crypto momentum' },
    { source: 'Scanner', time: 'now', title: 'ARM +3.9% - AI chip demand' },
  ],
  'high-volume': [
    { source: 'Scanner', time: 'now', title: 'AMD - 3.5x avg volume, +2.1%' },
    { source: 'Scanner', time: 'now', title: 'NVDA - 2.8x avg volume, +1.8%' },
    { source: 'Scanner', time: 'now', title: 'TSLA - 2.2x avg volume, -0.5%' },
    { source: 'Scanner', time: 'now', title: 'SPY - 1.8x avg volume, +0.3%' },
  ],
  'new-highs': [
    { source: 'Scanner', time: 'now', title: 'NVDA $502.30 - New ATH' },
    { source: 'Scanner', time: 'now', title: 'META $510.25 - New ATH' },
    { source: 'Scanner', time: 'now', title: 'MSFT $385.40 - New ATH' },
    { source: 'Scanner', time: 'now', title: 'LLY $642.80 - New ATH' },
    { source: 'Scanner', time: 'now', title: 'COST $728.50 - New ATH' },
  ],
  'unusual-options': [
    { source: 'Options', time: '10m', title: 'NVDA Jan 550C - 15,000 contracts, $2.1M premium' },
    { source: 'Options', time: '25m', title: 'AAPL Dec 190C - 8,500 contracts swept' },
    { source: 'Options', time: '1h', title: 'TSLA Jan 300P - 12,000 contracts, bearish bet' },
    { source: 'Options', time: '2h', title: 'AMD Feb 200C - Large block trade' },
  ],
};

export const ViewTuiStream = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedName">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedFeed"
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

    const allFeeds = [...feeds.news, ...feeds.rss, ...feeds.alerts, ...feeds.scanners];

    // Get selected feed from route or default to 'all-news'
    const selectedFeed = Vue.computed(() => route.params.feed || 'all-news');

    const currentFeed = Vue.computed(() => {
      return allFeeds.find(f => f.id === selectedFeed.value) || allFeeds[0];
    });

    const selectedName = Vue.computed(() => currentFeed.value?.name || 'All News');
    const selectedBadge = Vue.computed(() => currentFeed.value?.badge || '0');

    const menuSections = Vue.computed(() => [
      { header: 'News', items: feeds.news.map(f => ({ id: f.id, label: f.name, suffix: `(${f.badge})` })) },
      { header: 'RSS Feeds', items: feeds.rss.map(f => ({ id: f.id, label: f.name, suffix: `(${f.badge})` })) },
      { header: 'Alerts', items: feeds.alerts.map(f => ({ id: f.id, label: f.name, suffix: `(${f.badge})` })) },
      { header: 'Scanners', items: feeds.scanners.map(f => ({ id: f.id, label: f.name, suffix: `(${f.badge})` })) },
    ]);

    const onSelect = (id) => {
      router.push(`/stream/${id}`);
    };

    // Build content lines for vbuf
    const contentLines = Vue.computed(() => {
      const lines = [];
      const entries = feedEntries[selectedFeed.value] || [];

      lines.push(`${entries.length} items | Updated 1 min ago | [Mark All Read] [Refresh]`);
      lines.push('');

      if (entries.length === 0) {
        lines.push('No items in this feed.');
      } else {
        entries.forEach(entry => {
          const alert = entry.isAlert ? '! ' : '  ';
          lines.push(`${alert}${entry.time} [${entry.source}] ${entry.title}`);
        });
      }

      return lines;
    });

    return {
      store,
      feeds,
      selectedFeed,
      selectedName,
      selectedBadge,
      contentLines,
      menuSections,
      onSelect,
    };
  },
};
