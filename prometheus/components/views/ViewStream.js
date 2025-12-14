import { ViewLayout } from '../ViewLayout.js';
import { NavFooter } from '../NavFooter.js';
import { Button } from '../Button.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-stream-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-stream-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-stream-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-stream-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
}

.view-view-stream-item:hover {
  background: var(--bg-tertiary);
}

.view-view-stream-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.view-view-stream-item-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.view-view-stream-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  color: var(--text-primary);
}

.view-view-stream-item-badge {
  font-size: 9px;
  padding: 2px 6px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 8px;
  font-weight: bold;
}

.view-view-stream-item-badge.alert {
  background: #e74c3c;
  color: white;
}

.view-view-stream-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-stream-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.view-view-stream-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-view-stream-header-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.view-view-stream-header-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.view-view-stream-header-actions {
  display: flex;
  gap: 8px;
}

.view-view-stream-header-btn {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
}

.view-view-stream-header-btn:hover {
  background: var(--bg-tertiary);
}

.view-view-stream-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-stream-entry {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.view-view-stream-entry:hover {
  background: var(--bg-tertiary);
}

.view-view-stream-entry.alert {
  border-left: 3px solid #e74c3c;
}

.view-view-stream-entry-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}

.view-view-stream-entry-source {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-stream-entry.alert .view-view-stream-entry-source {
  color: #e74c3c;
}

.view-view-stream-entry-time {
  font-size: 10px;
  color: var(--text-secondary);
}

.view-view-stream-entry-title {
  font-weight: bold;
  margin-bottom: 6px;
  line-height: 1.3;
  color: var(--text-primary);
}

.view-view-stream-entry-summary {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.view-view-stream-entry-tags {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.view-view-stream-entry-tag {
  font-size: 9px;
  padding: 2px 6px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.view-view-stream-entry-tag.ticker {
  color: var(--text-primary);
  font-weight: bold;
}
`;

const icons = {
  news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
  rss: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  scanner: '<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
};

const feeds = {
  news: [
    { id: 'all-news', name: 'All News', icon: 'news', badge: '24' },
    { id: 'earnings', name: 'Earnings', icon: 'news', badge: '8' },
    { id: 'sec-filings', name: 'SEC Filings', icon: 'news', badge: '12' },
  ],
  rss: [
    { id: 'bloomberg', name: 'Bloomberg', icon: 'rss', badge: '15' },
    { id: 'reuters', name: 'Reuters', icon: 'rss', badge: '9' },
    { id: 'wsj', name: 'WSJ Markets', icon: 'rss', badge: '7' },
    { id: 'reddit', name: 'r/wallstreetbets', icon: 'rss', badge: '31' },
  ],
  alerts: [
    { id: 'price-alerts', name: 'Price Alerts', icon: 'bell', badge: '3', alertBadge: true },
    { id: 'volume-alerts', name: 'Volume Alerts', icon: 'bell', badge: '1', alertBadge: true },
    { id: 'earnings-alerts', name: 'Earnings Alerts', icon: 'bell' },
  ],
  scanners: [
    { id: 'gap-up', name: 'Gap Up >3%', icon: 'scanner', badge: '18' },
    { id: 'high-volume', name: 'High Volume', icon: 'scanner', badge: '42' },
    { id: 'new-highs', name: '52wk Highs', icon: 'scanner', badge: '27' },
    { id: 'unusual-options', name: 'Unusual Options', icon: 'scanner', badge: '13' },
  ],
};

const entries = [
  { source: 'Bloomberg', time: '2 min ago', title: 'Fed Officials Signal Potential Rate Cut in Early 2025 Amid Cooling Inflation', summary: 'Federal Reserve officials indicated they may begin cutting interest rates in the first quarter of 2025 as inflation continues to moderate toward their 2% target...', tags: ['Macro', 'Fed'] },
  { source: 'Reuters', time: '15 min ago', title: 'Apple Announces $100B Stock Buyback Program, Beats Q4 Earnings Estimates', summary: 'Apple Inc. reported quarterly revenue of $94.8 billion, exceeding analyst expectations, and announced a new $100 billion share repurchase authorization...', tags: ['AAPL', 'Earnings', 'Buyback'], tickerTag: 'AAPL' },
  { source: 'Price Alert', time: '23 min ago', title: 'NVDA crossed above $500.00', summary: 'NVIDIA Corporation (NVDA) has crossed above your price alert level of $500.00. Current price: $502.45 (+3.2%)', tags: ['NVDA', 'Alert'], tickerTag: 'NVDA', isAlert: true },
  { source: 'SEC Filing', time: '45 min ago', title: 'Microsoft Corp - Form 10-K Annual Report Filed', summary: 'Microsoft Corporation has filed its annual report on Form 10-K for fiscal year 2024, reporting record revenue of $245 billion...', tags: ['MSFT', '10-K'], tickerTag: 'MSFT' },
  { source: 'WSJ Markets', time: '1 hr ago', title: 'Oil Prices Surge 4% on Middle East Supply Concerns', summary: 'Crude oil futures jumped more than 4% as escalating tensions in the Middle East raised concerns about potential supply disruptions...', tags: ['Energy', 'Commodities'] },
  { source: 'Bloomberg', time: '1 hr ago', title: 'Tesla Deliveries Miss Estimates as EV Competition Intensifies', summary: 'Tesla Inc. reported fourth-quarter deliveries of 484,507 vehicles, falling short of analyst estimates as competition in the electric vehicle market continues to grow...', tags: ['TSLA', 'EV'], tickerTag: 'TSLA' },
  { source: 'Volume Alert', time: '2 hr ago', title: 'Unusual volume detected in AMD', summary: 'Advanced Micro Devices (AMD) is trading at 3.5x average volume. Current volume: 45.2M shares vs 20-day avg of 12.9M', tags: ['AMD', 'Alert'], tickerTag: 'AMD', isAlert: true },
];

export const ViewStream = {
  components: { ViewLayout, NavFooter, Button },
  template: `
    <ViewLayout>
      <template #menu>
        <div class="view-view-stream-sidebar-content">
          <div class="view-view-stream-sidebar-header">News</div>
          <div
            v-for="item in feeds.news"
            :key="item.id"
            class="view-view-stream-item"
            :class="{ active: selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <svg class="view-view-stream-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons[item.icon]"></svg>
            <span class="view-view-stream-item-name">{{ item.name }}</span>
            <span v-if="item.badge" class="view-view-stream-item-badge">{{ item.badge }}</span>
          </div>

          <div class="view-view-stream-sidebar-header">RSS Feeds</div>
          <div
            v-for="item in feeds.rss"
            :key="item.id"
            class="view-view-stream-item"
            :class="{ active: selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <svg class="view-view-stream-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons[item.icon]"></svg>
            <span class="view-view-stream-item-name">{{ item.name }}</span>
            <span v-if="item.badge" class="view-view-stream-item-badge">{{ item.badge }}</span>
          </div>

          <div class="view-view-stream-sidebar-header">Alerts</div>
          <div
            v-for="item in feeds.alerts"
            :key="item.id"
            class="view-view-stream-item"
            :class="{ active: selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <svg class="view-view-stream-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons[item.icon]"></svg>
            <span class="view-view-stream-item-name">{{ item.name }}</span>
            <span v-if="item.badge" class="view-view-stream-item-badge" :class="{ alert: item.alertBadge }">{{ item.badge }}</span>
          </div>

          <div class="view-view-stream-sidebar-header">Scanners</div>
          <div
            v-for="item in feeds.scanners"
            :key="item.id"
            class="view-view-stream-item"
            :class="{ active: selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <svg class="view-view-stream-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons[item.icon]"></svg>
            <span class="view-view-stream-item-name">{{ item.name }}</span>
            <span v-if="item.badge" class="view-view-stream-item-badge">{{ item.badge }}</span>
          </div>
        </div>
        <NavFooter>
          <Button>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.settings"></svg>
          </Button>
          <Button>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.plus"></svg>
          </Button>
        </NavFooter>
      </template>

      <div class="view-view-stream-main">
        <div class="view-view-stream-header">
          <div class="view-view-stream-header-left">
            <span class="view-view-stream-header-title">{{ selectedName }}</span>
            <span class="view-view-stream-header-meta">{{ selectedBadge }} items • Updated 1 min ago</span>
          </div>
          <div class="view-view-stream-header-actions">
            <button class="view-view-stream-header-btn">Mark All Read</button>
            <button class="view-view-stream-header-btn">Refresh</button>
          </div>
        </div>
        <div class="view-view-stream-content">
          <div
            v-for="(entry, idx) in entries"
            :key="idx"
            class="view-view-stream-entry"
            :class="{ alert: entry.isAlert }"
          >
            <div class="view-view-stream-entry-header">
              <span class="view-view-stream-entry-source">{{ entry.source }}</span>
              <span class="view-view-stream-entry-time">{{ entry.time }}</span>
            </div>
            <div class="view-view-stream-entry-title">{{ entry.title }}</div>
            <div class="view-view-stream-entry-summary">{{ entry.summary }}</div>
            <div class="view-view-stream-entry-tags">
              <span
                v-for="tag in entry.tags"
                :key="tag"
                class="view-view-stream-entry-tag"
                :class="{ ticker: tag === entry.tickerTag }"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </ViewLayout>
  `,
  setup() {
    useStyles('view-stream-styles', styles);

    const selectedFeed = Vue.ref('all-news');
    const selectedName = Vue.ref('All News');
    const selectedBadge = Vue.ref('24');

    const selectFeed = (item) => {
      selectedFeed.value = item.id;
      selectedName.value = item.name;
      selectedBadge.value = item.badge || '0';
    };

    return {
      feeds,
      icons,
      entries,
      selectedFeed,
      selectedName,
      selectedBadge,
      selectFeed,
    };
  },
};
