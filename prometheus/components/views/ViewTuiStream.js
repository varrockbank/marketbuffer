import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

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

const entries = [
  { source: 'Bloomberg', time: '2m', title: 'Fed Officials Signal Potential Rate Cut in Early 2025', isAlert: false },
  { source: 'Reuters', time: '15m', title: 'Apple Announces $100B Stock Buyback Program', isAlert: false },
  { source: 'ALERT', time: '23m', title: 'NVDA crossed above $500.00', isAlert: true },
  { source: 'SEC', time: '45m', title: 'Microsoft Corp - Form 10-K Annual Report Filed', isAlert: false },
  { source: 'WSJ', time: '1h', title: 'Oil Prices Surge 4% on Middle East Supply Concerns', isAlert: false },
  { source: 'Bloomberg', time: '1h', title: 'Tesla Deliveries Miss Estimates', isAlert: false },
  { source: 'ALERT', time: '2h', title: 'Unusual volume detected in AMD (3.5x avg)', isAlert: true },
];

export const ViewTuiStream = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedName">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">News</div>
          <div
            v-for="item in feeds.news"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedFeed === item.id ? 'active' : ''"
            @click="selectFeed(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedFeed === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">({{ item.badge }})</span>
          </div>

          <div class="kit-tui-header">RSS Feeds</div>
          <div
            v-for="item in feeds.rss"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedFeed === item.id ? 'active' : ''"
            @click="selectFeed(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedFeed === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">({{ item.badge }})</span>
          </div>

          <div class="kit-tui-header">Alerts</div>
          <div
            v-for="item in feeds.alerts"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedFeed === item.id ? 'active' : ''"
            @click="selectFeed(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedFeed === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1" :class="item.isAlert ? 'font-bold' : ''">({{ item.badge }})</span>
          </div>

          <div class="kit-tui-header">Scanners</div>
          <div
            v-for="item in feeds.scanners"
            :key="item.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedFeed === item.id ? 'active' : ''"
            @click="selectFeed(item)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedFeed === item.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ item.name }}</span>
            <span class="ml-1">({{ item.badge }})</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-1">{{ selectedBadge }} items | Updated 1 min ago | [Mark All Read] [Refresh]</div>
        <div class="flex-1 overflow-y-auto">
          <div v-for="(entry, idx) in entries" :key="idx" class="mb-1">
            <span v-if="entry.isAlert" class="font-bold">!</span>
            <span>{{ entry.time }} [{{ entry.source }}] {{ entry.title }}</span>
          </div>
        </div>
      </div>
    </KitTUIViewLayout>
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
