import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';

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
  components: { KitViewLayout, KitSidebarFooter, KitButton, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">News</div>
          <div
            v-for="item in feeds.news"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon :icon="item.icon" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ item.name }}</span>
            <span v-if="item.badge" class="text-[9px] px-1.5 py-0.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg font-bold">{{ item.badge }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">RSS Feeds</div>
          <div
            v-for="item in feeds.rss"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon :icon="item.icon" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ item.name }}</span>
            <span v-if="item.badge" class="text-[9px] px-1.5 py-0.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg font-bold">{{ item.badge }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Alerts</div>
          <div
            v-for="item in feeds.alerts"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon :icon="item.icon" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ item.name }}</span>
            <span v-if="item.badge" class="text-[9px] px-1.5 py-0.5 rounded-lg font-bold" :class="item.alertBadge ? 'bg-[#e74c3c] text-white' : 'bg-[var(--text-primary)] text-[var(--bg-primary)]'">{{ item.badge }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Scanners</div>
          <div
            v-for="item in feeds.scanners"
            :key="item.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedFeed === item.id }"
            @click="selectFeed(item)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon :icon="item.icon" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ item.name }}</span>
            <span v-if="item.badge" class="text-[9px] px-1.5 py-0.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg font-bold">{{ item.badge }}</span>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="settings" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <span class="font-bold text-base text-[var(--text-primary)]">{{ selectedName }}</span>
            <span class="text-[11px] text-[var(--text-secondary)]">{{ selectedBadge }} items • Updated 1 min ago</span>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Mark All Read</button>
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Refresh</button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="(entry, idx) in entries"
            :key="idx"
            class="px-5 py-4 border-b border-[var(--border-color)] cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'border-l-[3px] border-l-[#e74c3c]': entry.isAlert }"
          >
            <div class="flex items-start justify-between mb-1.5">
              <span class="text-[10px] uppercase tracking-wide" :class="entry.isAlert ? 'text-[#e74c3c]' : 'text-[var(--text-secondary)]'">{{ entry.source }}</span>
              <span class="text-[10px] text-[var(--text-secondary)]">{{ entry.time }}</span>
            </div>
            <div class="font-bold mb-1.5 leading-tight text-[var(--text-primary)]">{{ entry.title }}</div>
            <div class="text-[11px] text-[var(--text-secondary)] leading-[1.4]">{{ entry.summary }}</div>
            <div class="flex gap-1.5 mt-2">
              <span
                v-for="tag in entry.tags"
                :key="tag"
                class="text-[9px] px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                :class="{ 'text-[var(--text-primary)] font-bold': tag === entry.tickerTag }"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    const selectedFeed = Vue.ref('all-news');
    const selectedName = Vue.ref('All News');
    const selectedBadge = Vue.ref('24');

    const selectFeed = (item) => {
      selectedFeed.value = item.id;
      selectedName.value = item.name;
      selectedBadge.value = item.badge || '0';
    };

    return {
      store,
      feeds,
      entries,
      selectedFeed,
      selectedName,
      selectedBadge,
      selectFeed,
    };
  },
};
