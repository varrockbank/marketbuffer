import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
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

export const ViewTuiYap = {
  components: { KitTUIViewLayout, KitSidebarFooter, KitButton },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="currentPrefix + currentChannelName">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">AI Chats</div>
          <div
            v-for="channel in channels.aiChats"
            :key="channel.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedChannel === channel.id ? 'active' : ''"
            @click="selectChannel(channel)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedChannel === channel.id ? '>' : '' }}</span>
            <span>{{ channel.prefix }}</span>
            <span class="truncate">{{ channel.name }}</span>
          </div>

          <div class="kit-tui-header">DMs</div>
          <div
            v-for="channel in channels.dms"
            :key="channel.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedChannel === channel.id ? 'active' : ''"
            @click="selectChannel(channel)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedChannel === channel.id ? '>' : '' }}</span>
            <span>{{ channel.prefix }}</span>
            <span class="truncate">{{ channel.name }}</span>
          </div>

          <div class="kit-tui-header">Channels</div>
          <div
            v-for="channel in channels.channels"
            :key="channel.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedChannel === channel.id ? 'active' : ''"
            @click="selectChannel(channel)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedChannel === channel.id ? '>' : '' }}</span>
            <span>{{ channel.prefix }}</span>
            <span class="truncate">{{ channel.name }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="flex-1 overflow-y-auto flex flex-col p-0 gap-0" ref="messagesRef">
          <div v-for="(msg, idx) in messages" :key="idx" class="flex items-start gap-0">
            <div class="flex-1 min-w-0">
              <span class="font-bold">{{ msg.author }}: </span>
              <span>{{ msg.text }}</span>
            </div>
          </div>
        </div>
        <div class="shrink-0" style="border-top: 1px solid var(--tui-fg); border-bottom: 1px solid var(--tui-fg); margin-bottom: 1ch;">
          <div class="flex items-center">
            <span style="width: 2ch;">&gt;</span>
            <input
              type="text"
              class="flex-1 bg-transparent outline-none"
              :placeholder="'Message ' + currentPrefix + currentChannelName"
              v-model="inputText"
              @keydown.enter="sendMessage"
            >
          </div>
        </div>
      </div>
    </KitTUIViewLayout>
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
