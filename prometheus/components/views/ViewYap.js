import { ViewLayout } from '../ViewLayout.js';
import { NavFooter } from '../NavFooter.js';
import { Button } from '../Button.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-yap-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-yap-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-yap-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-yap-channel {
  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}

.view-view-yap-channel:hover {
  background: var(--bg-tertiary);
}

.view-view-yap-channel.active {
  background: var(--bg-tertiary);
}

.view-view-yap-channel-hash {
  color: var(--text-secondary);
  font-weight: bold;
}

.view-view-yap-channel-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-view-yap-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-yap-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.view-view-yap-header-hash {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: bold;
}

.view-view-yap-header-name {
  font-weight: bold;
  font-size: 14px;
  color: var(--text-primary);
}

.view-view-yap-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view-view-yap-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.view-view-yap-message-time {
  color: var(--text-secondary);
  font-size: 10px;
  flex-shrink: 0;
  width: 50px;
  padding-top: 2px;
}

.view-view-yap-message-content {
  flex: 1;
  min-width: 0;
}

.view-view-yap-message-author {
  font-weight: bold;
  margin-bottom: 2px;
  color: var(--text-primary);
}

.view-view-yap-message-text {
  line-height: 1.4;
  word-wrap: break-word;
  color: var(--text-primary);
}

.view-view-yap-input-wrapper {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.view-view-yap-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
  border-radius: 4px;
}

.view-view-yap-input::placeholder {
  color: var(--text-secondary);
}

.view-view-yap-input:focus {
  border-color: var(--accent);
}
`;

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
  components: { ViewLayout, NavFooter, Button },
  template: `
    <ViewLayout>
      <template #menu>
        <div class="view-view-yap-sidebar-content">
          <div class="view-view-yap-sidebar-header">AI Chats</div>
          <div
            v-for="channel in channels.aiChats"
            :key="channel.id"
            class="view-view-yap-channel"
            :class="{ active: selectedChannel === channel.id }"
            @click="selectChannel(channel)"
          >
            <span class="view-view-yap-channel-hash">{{ channel.prefix }}</span>
            <span class="view-view-yap-channel-name">{{ channel.name }}</span>
          </div>

          <div class="view-view-yap-sidebar-header">DMs</div>
          <div
            v-for="channel in channels.dms"
            :key="channel.id"
            class="view-view-yap-channel"
            :class="{ active: selectedChannel === channel.id }"
            @click="selectChannel(channel)"
          >
            <span class="view-view-yap-channel-hash">{{ channel.prefix }}</span>
            <span class="view-view-yap-channel-name">{{ channel.name }}</span>
          </div>

          <div class="view-view-yap-sidebar-header">Channels</div>
          <div
            v-for="channel in channels.channels"
            :key="channel.id"
            class="view-view-yap-channel"
            :class="{ active: selectedChannel === channel.id }"
            @click="selectChannel(channel)"
          >
            <span class="view-view-yap-channel-hash">{{ channel.prefix }}</span>
            <span class="view-view-yap-channel-name">{{ channel.name }}</span>
          </div>
        </div>
        <NavFooter>
          <Button>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </Button>
          <Button>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Button>
        </NavFooter>
      </template>

      <div class="view-view-yap-main">
        <div class="view-view-yap-header">
          <span class="view-view-yap-header-hash">{{ currentPrefix }}</span>
          <span class="view-view-yap-header-name">{{ currentChannelName }}</span>
        </div>
        <div class="view-view-yap-messages" ref="messagesRef">
          <div v-for="(msg, idx) in messages" :key="idx" class="view-view-yap-message">
            <span class="view-view-yap-message-time">{{ msg.time }}</span>
            <div class="view-view-yap-message-content">
              <div class="view-view-yap-message-author">{{ msg.author }}</div>
              <div class="view-view-yap-message-text">{{ msg.text }}</div>
            </div>
          </div>
        </div>
        <div class="view-view-yap-input-wrapper">
          <input
            type="text"
            class="view-view-yap-input"
            :placeholder="'Message ' + currentPrefix + currentChannelName"
            v-model="inputText"
            @keydown.enter="sendMessage"
          >
        </div>
      </div>
    </ViewLayout>
  `,
  setup() {
    useStyles('view-yap-styles', styles);

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
