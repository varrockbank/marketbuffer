import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';

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

const initialMessages = [
  { time: '9:15 AM', author: 'alice', text: 'Good morning everyone! Ready for another trading day?' },
  { time: '9:17 AM', author: 'bob', text: 'Morning! Yeah, watching the pre-market closely. Looks like it might be volatile today.' },
  { time: '9:22 AM', author: 'charlie', text: 'Did anyone see the Fed announcement yesterday? Thinking it might affect tech stocks.' },
  { time: '9:25 AM', author: 'alice', text: "Yeah, I'm keeping an eye on AAPL and MSFT. Might be some opportunities there." },
  { time: '9:31 AM', author: 'dave', text: "Just joined. What's the sentiment today?" },
  { time: '9:33 AM', author: 'bob', text: 'Cautiously optimistic. Futures are green but not by much.' },
  { time: '9:40 AM', author: 'eve', text: 'Anyone looking at the energy sector? Oil prices have been interesting lately.' },
  { time: '9:45 AM', author: 'charlie', text: "I've been watching XOM. Might be a good entry point soon." },
];

export const ViewYap = {
  components: { KitViewLayout, KitSidebarFooter, KitButton },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">AI Chats</div>
          <div
            v-for="channel in channels.aiChats"
            :key="channel.id"
            class="flex items-center gap-1.5 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            :class="selectedChannel === channel.id ? 'bg-[var(--bg-tertiary)]' : ''"
            @click="selectChannel(channel)"
          >
            <span class="text-[var(--text-secondary)] font-bold">{{ channel.prefix }}</span>
            <span class="truncate">{{ channel.name }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">DMs</div>
          <div
            v-for="channel in channels.dms"
            :key="channel.id"
            class="flex items-center gap-1.5 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            :class="selectedChannel === channel.id ? 'bg-[var(--bg-tertiary)]' : ''"
            @click="selectChannel(channel)"
          >
            <span class="text-[var(--text-secondary)] font-bold">{{ channel.prefix }}</span>
            <span class="truncate">{{ channel.name }}</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Channels</div>
          <div
            v-for="channel in channels.channels"
            :key="channel.id"
            class="flex items-center gap-1.5 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            :class="selectedChannel === channel.id ? 'bg-[var(--bg-tertiary)]' : ''"
            @click="selectChannel(channel)"
          >
            <span class="text-[var(--text-secondary)] font-bold">{{ channel.prefix }}</span>
            <span class="truncate">{{ channel.name }}</span>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="search" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-2 shrink-0">
          <span class="text-[var(--text-secondary)] text-base font-bold">{{ currentPrefix }}</span>
          <span class="font-bold text-sm text-[var(--text-primary)]">{{ currentChannelName }}</span>
        </div>
        <div class="flex-1 overflow-y-auto flex flex-col p-4 gap-3" ref="messagesRef">
          <div v-for="(msg, idx) in messages" :key="idx" class="flex items-start gap-3">
            <span class="text-[var(--text-secondary)] text-[10px] shrink-0 w-[50px] pt-0.5">{{ msg.time }}</span>
            <div class="flex-1 min-w-0">
              <div class="font-bold mb-0.5 text-[var(--text-primary)]">{{ msg.author }}</div>
              <div class="leading-[1.4] break-words text-[var(--text-primary)]">{{ msg.text }}</div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 border-t border-[var(--border-color)] shrink-0">
          <input
            type="text"
            class="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-secondary)]"
            :placeholder="'Message ' + currentPrefix + currentChannelName"
            v-model="inputText"
            @keydown.enter="sendMessage"
          >
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    const selectedChannel = Vue.ref('general');
    const currentPrefix = Vue.ref('#');
    const currentChannelName = Vue.ref('general');
    const messages = Vue.ref([...initialMessages]);
    const inputText = Vue.ref('');
    const messagesRef = Vue.ref(null);

    const selectChannel = (channel) => {
      selectedChannel.value = channel.id;
      currentPrefix.value = channel.prefix;
      currentChannelName.value = channel.name;
    };

    const sendMessage = () => {
      if (!inputText.value.trim()) return;
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      messages.value.push({
        time,
        author: 'you',
        text: inputText.value,
      });
      inputText.value = '';
      Vue.nextTick(() => {
        if (messagesRef.value) {
          messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
        }
      });
    };

    return {
      store,
      channels,
      selectedChannel,
      currentPrefix,
      currentChannelName,
      messages,
      inputText,
      messagesRef,
      selectChannel,
      sendMessage,
    };
  },
};
