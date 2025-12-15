import { store } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

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

const defaultContent = `As we enter the final quarter of 2024, markets face a complex landscape.

Key themes:
1. Interest Rate Trajectory
2. Earnings Season Dynamics
3. Technical Levels

Portfolio Positioning:
- Maintaining neutral equity exposure
- Overweight quality factor
- Tactical allocation to volatility strategies`;

export const ViewTuiPublish = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedName">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">Drafts</div>
          <div
            v-for="doc in documents.drafts"
            :key="doc.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedDoc === doc.id ? 'active' : ''"
            @click="selectDoc(doc)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedDoc === doc.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ doc.name }}</span>
            <span class="ml-1">[D]</span>
          </div>

          <div class="kit-tui-header">Published</div>
          <div
            v-for="doc in documents.published"
            :key="doc.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedDoc === doc.id ? 'active' : ''"
            @click="selectDoc(doc)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedDoc === doc.id ? '>' : '' }}</span>
            <span class="truncate flex-1">{{ doc.name }}</span>
            <span class="ml-1">[P]</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="mb-1">{{ selectedStatus === 'published' ? '[Published]' : '[Draft]' }} | {{ wordCount }} words | [Preview] [Publish]</div>
        <div class="shrink-0 mb-2" style="border-bottom: 1px solid var(--tui-fg);">
          <input
            type="text"
            class="w-full bg-transparent outline-none font-bold"
            v-model="title"
            placeholder="Title..."
          >
        </div>
        <div class="flex-1 overflow-auto">
          <textarea
            class="w-full h-full bg-transparent outline-none resize-none"
            v-model="body"
            placeholder="Start writing..."
            @input="updateWordCount"
          ></textarea>
        </div>
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const selectedDoc = Vue.ref('market-outlook');
    const selectedName = Vue.ref('Q4 Market Outlook');
    const selectedStatus = Vue.ref('draft');
    const title = Vue.ref('Q4 2024 Market Outlook');
    const body = Vue.ref(defaultContent);
    const wordCount = Vue.ref(0);

    const updateWordCount = () => {
      const text = body.value.trim();
      wordCount.value = text ? text.split(/\s+/).length : 0;
    };

    updateWordCount();

    const selectDoc = (doc) => {
      selectedDoc.value = doc.id;
      selectedName.value = doc.name;
      selectedStatus.value = doc.status;
    };

    return {
      store,
      documents,
      selectedDoc,
      selectedName,
      selectedStatus,
      title,
      body,
      wordCount,
      updateWordCount,
      selectDoc,
    };
  },
};
