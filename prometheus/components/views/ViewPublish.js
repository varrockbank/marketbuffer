import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitSidebarFooter } from '../kit/KitSidebarFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';

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

const defaultContent = `As we enter the final quarter of 2024, markets face a complex landscape of competing forces. The Federal Reserve's evolving stance on interest rates, persistent inflation concerns, and geopolitical uncertainties continue to shape investor sentiment.

Key themes to watch:

1. Interest Rate Trajectory
The Fed's recent communications suggest a more dovish tone, with markets pricing in potential rate cuts in early 2025. However, the timing and magnitude remain uncertain, creating opportunities for volatility-based strategies.

2. Earnings Season Dynamics
Q3 earnings have shown resilience in the technology sector, while traditional value sectors face headwinds. Our momentum algorithms are positioned to capture rotational opportunities as sector leadership shifts.

3. Technical Levels
The S&P 500 remains in a consolidation pattern, with key support at 4,200 and resistance at 4,600. A decisive break in either direction could trigger significant algorithmic flows.

Portfolio Positioning:
- Maintaining neutral equity exposure
- Overweight quality factor
- Tactical allocation to volatility strategies
- Cash reserves for opportunistic deployment`;

export const ViewPublish = {
  components: { KitViewLayout, KitSidebarFooter, KitButton, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="px-3 py-2 pt-3.5 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Drafts</div>
          <div
            v-for="doc in documents.drafts"
            :key="doc.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedDoc === doc.id }"
            @click="selectDoc(doc)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon icon="file" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ doc.name }}</span>
            <span class="text-[9px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg font-bold">Draft</span>
          </div>

          <div class="px-3 py-2 font-bold text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">Published</div>
          <div
            v-for="doc in documents.published"
            :key="doc.id"
            class="flex items-center gap-2 px-4 py-2 cursor-pointer border-l-[3px] border-transparent transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)] !border-l-[var(--accent)]': selectedDoc === doc.id }"
            @click="selectDoc(doc)"
          >
            <span class="text-[var(--text-secondary)]"><KitIcon icon="file" :size="14" /></span>
            <span class="truncate flex-1 text-[var(--text-primary)]">{{ doc.name }}</span>
            <span class="text-[9px] px-1.5 py-0.5 bg-[#2ecc71] text-white rounded-lg font-bold">Live</span>
          </div>
        </div>
        <KitSidebarFooter padded>
          <KitButton icon="trash" />
          <KitButton icon="plus" />
        </KitSidebarFooter>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <span class="font-bold text-base text-[var(--text-primary)]">{{ selectedName }}</span>
            <span class="text-[11px] text-[var(--text-secondary)]">{{ selectedStatus === 'published' ? 'Published' : 'Draft' }} • Last edited 5 min ago</span>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px] cursor-pointer rounded hover:bg-[var(--bg-tertiary)]">Preview</button>
            <button class="px-3 py-1.5 bg-[var(--accent)] border border-[var(--accent)] text-white text-[11px] cursor-pointer rounded hover:opacity-90">Publish</button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto flex justify-center px-5 py-10">
          <div class="max-w-[700px] w-full">
            <input
              type="text"
              class="text-[32px] font-bold border-none bg-transparent text-[var(--text-primary)] w-full outline-none mb-6 font-serif placeholder:text-[var(--text-secondary)]"
              v-model="title"
              placeholder="Title..."
            >
            <textarea
              class="text-base leading-[1.8] border-none bg-transparent text-[var(--text-primary)] w-full min-h-[400px] outline-none resize-none font-serif placeholder:text-[var(--text-secondary)]"
              v-model="body"
              placeholder="Start writing..."
              @input="updateWordCount"
            ></textarea>
            <div class="mt-5 text-[11px] text-[var(--text-secondary)] text-right">{{ wordCount }} words</div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    const selectedDoc = Vue.ref('market-outlook');
    const selectedName = Vue.ref('Q4 Market Outlook');
    const selectedStatus = Vue.ref('draft');
    const title = Vue.ref('Q4 2024 Market Outlook: Navigating Uncertainty');
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
