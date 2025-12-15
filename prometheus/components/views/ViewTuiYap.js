import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

const channels = {
  aiChats: [
    { id: 'market-analysis', name: 'Market analysis', prefix: '~' },
    { id: 'portfolio-review', name: 'Portfolio review', prefix: '~' },
    { id: 'trading-strategy', name: 'Trading strategy', prefix: '~' },
  ],
  dms: [
    { id: 'alice', name: 'alice', prefix: '@' },
    { id: 'bob', name: 'bob', prefix: '@' },
    { id: 'charlie', name: 'charlie', prefix: '@' },
    { id: 'dave', name: 'dave', prefix: '@' },
  ],
  channels: [
    { id: 'general', name: 'general', prefix: '#' },
    { id: 'random', name: 'random', prefix: '#' },
    { id: 'trading', name: 'trading', prefix: '#' },
    { id: 'markets', name: 'markets', prefix: '#' },
    { id: 'tech', name: 'tech', prefix: '#' },
    { id: 'off-topic', name: 'off-topic', prefix: '#' },
  ],
};

const channelMessages = {
  // AI Chats
  'market-analysis': [
    { author: 'claude', text: 'Based on current technicals, SPY is testing resistance at 480.' },
    { author: 'you', text: 'What about NVDA? Seems overextended.' },
    { author: 'claude', text: 'NVDA RSI at 72, approaching overbought. Consider trailing stops.' },
    { author: 'you', text: 'Good call. Setting stop at 485.' },
    { author: 'claude', text: 'Noted. Also watching AMD for a sympathy play if NVDA pulls back.' },
  ],
  'portfolio-review': [
    { author: 'claude', text: 'Your portfolio is up 12.4% YTD vs SPY +8.2%.' },
    { author: 'claude', text: 'Top performer: NVDA (+45%), Laggard: JNJ (-4.2%).' },
    { author: 'you', text: 'Should I trim NVDA position?' },
    { author: 'claude', text: 'Consider taking 25% off the table to lock in gains.' },
    { author: 'claude', text: 'JNJ may recover with healthcare rotation. Hold for now.' },
  ],
  'trading-strategy': [
    { author: 'you', text: 'Thinking about adding momentum to my strategy.' },
    { author: 'claude', text: '10-day momentum works well in trending markets.' },
    { author: 'claude', text: 'Backtest shows +18% annual return, 1.4 Sharpe.' },
    { author: 'you', text: 'What about mean reversion as a complement?' },
    { author: 'claude', text: 'Good diversification. They tend to be uncorrelated.' },
  ],
  // DMs
  alice: [
    { author: 'alice', text: 'Hey, did you see that AAPL earnings report?' },
    { author: 'you', text: 'Yeah, beat estimates. Services revenue was strong.' },
    { author: 'alice', text: 'Thinking of adding to my position.' },
    { author: 'you', text: 'I bought some calls last week. Looking good so far.' },
  ],
  bob: [
    { author: 'bob', text: 'Quick question - what broker do you use for options?' },
    { author: 'you', text: 'IBKR for the low commissions.' },
    { author: 'bob', text: 'How are the fills?' },
    { author: 'you', text: 'Generally good, especially for liquid names.' },
  ],
  charlie: [
    { author: 'charlie', text: 'That energy trade worked out!' },
    { author: 'you', text: 'Nice! What was your entry on XOM?' },
    { author: 'charlie', text: '$98.50, sold at $104. Quick 5.5%.' },
    { author: 'you', text: 'Well played. I missed that one.' },
  ],
  dave: [
    { author: 'dave', text: 'New to trading. Any book recommendations?' },
    { author: 'you', text: 'Market Wizards by Schwager is a classic.' },
    { author: 'dave', text: 'Thanks! Ill check it out.' },
    { author: 'you', text: 'Also Trading in the Zone for psychology.' },
  ],
  // Channels
  general: [
    { author: 'alice', text: 'Good morning everyone! Ready for another trading day?' },
    { author: 'bob', text: 'Morning! Watching the pre-market closely.' },
    { author: 'charlie', text: 'Fed announcement might affect tech stocks.' },
    { author: 'alice', text: 'Keeping an eye on AAPL and MSFT.' },
    { author: 'dave', text: 'Just joined. Whats the sentiment today?' },
    { author: 'bob', text: 'Cautiously optimistic. Futures are green.' },
  ],
  random: [
    { author: 'eve', text: 'Anyone watching the game tonight?' },
    { author: 'bob', text: 'Lakers vs Celtics? Definitely.' },
    { author: 'alice', text: 'More of a football person myself.' },
    { author: 'charlie', text: 'Speaking of random, anyone tried that new coffee shop?' },
  ],
  trading: [
    { author: 'bob', text: 'NVDA breaking out of the wedge pattern.' },
    { author: 'alice', text: 'Volume confirming the move. Looks legit.' },
    { author: 'charlie', text: 'Just entered at 468. Stop at 460.' },
    { author: 'dave', text: 'What timeframe are you looking at?' },
    { author: 'bob', text: 'Daily chart, but watching 15min for entries.' },
  ],
  markets: [
    { author: 'eve', text: '10Y yield spiking. Could pressure growth stocks.' },
    { author: 'bob', text: 'Good point. Rotating to value names.' },
    { author: 'alice', text: 'Energy and financials looking strong.' },
    { author: 'charlie', text: 'XLE up 2% premarket on oil news.' },
  ],
  tech: [
    { author: 'alice', text: 'Anyone using the new IBKR TWS update?' },
    { author: 'bob', text: 'Yeah, the new charting is nice.' },
    { author: 'dave', text: 'Still prefer TradingView for analysis.' },
    { author: 'charlie', text: 'TradingView + IBKR for execution is my setup.' },
  ],
  'off-topic': [
    { author: 'eve', text: 'Working from home today. Much better focus.' },
    { author: 'alice', text: 'Same. No commute = more research time.' },
    { author: 'bob', text: 'I need the office energy personally.' },
    { author: 'charlie', text: 'Hybrid is the way. Best of both.' },
  ],
};

export const ViewTuiYap = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="currentPrefix + currentChannelName">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedChannel"
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

    const allChannels = [...channels.aiChats, ...channels.dms, ...channels.channels];

    // Get selected channel from route or default to 'general'
    const selectedChannel = Vue.computed(() => route.params.channel || 'general');

    const currentChannel = Vue.computed(() => {
      return allChannels.find(c => c.id === selectedChannel.value) || allChannels.find(c => c.id === 'general');
    });

    const currentPrefix = Vue.computed(() => currentChannel.value?.prefix || '#');
    const currentChannelName = Vue.computed(() => currentChannel.value?.name || 'general');

    // Build menu sections for vbuf sidenav
    const menuSections = Vue.computed(() => [
      {
        header: 'AI Chats',
        items: channels.aiChats.map(c => ({ id: c.id, label: c.name, prefix: c.prefix })),
      },
      {
        header: 'DMs',
        items: channels.dms.map(c => ({ id: c.id, label: c.name, prefix: c.prefix })),
      },
      {
        header: 'Channels',
        items: channels.channels.map(c => ({ id: c.id, label: c.name, prefix: c.prefix })),
      },
    ]);

    const onSelect = (id) => {
      router.push(`/yap/${id}`);
    };

    // Build content lines for vbuf
    const contentLines = Vue.computed(() => {
      const lines = [];
      const messages = channelMessages[selectedChannel.value] || [];

      messages.forEach(msg => {
        lines.push(`${msg.author}: ${msg.text}`);
      });

      lines.push('');
      lines.push('─'.repeat(60));
      lines.push(`> Message ${currentPrefix.value}${currentChannelName.value}...`);

      return lines;
    });

    return {
      store,
      channels,
      selectedChannel,
      currentPrefix,
      currentChannelName,
      contentLines,
      menuSections,
      onSelect,
    };
  },
};
