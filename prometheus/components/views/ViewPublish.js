import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitNavFooter } from '../kit/KitNavFooter.js';
import { KitButton } from '../kit/KitButton.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-publish-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.view-view-publish-sidebar-header {
  padding: 8px 12px;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-view-publish-sidebar-header:first-child {
  padding-top: 14px;
}

.view-view-publish-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
}

.view-view-publish-item:hover {
  background: var(--bg-tertiary);
}

.view-view-publish-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.view-view-publish-item-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.view-view-publish-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  color: var(--text-primary);
}

.view-view-publish-item-status {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
}

.view-view-publish-item-status.draft {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.view-view-publish-item-status.published {
  background: #2ecc71;
  color: #fff;
}

.view-view-publish-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-publish-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.view-view-publish-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-view-publish-header-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}

.view-view-publish-header-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.view-view-publish-header-actions {
  display: flex;
  gap: 8px;
}

.view-view-publish-header-btn {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  border-radius: 4px;
}

.view-view-publish-header-btn:hover {
  background: var(--bg-tertiary);
}

.view-view-publish-header-btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.view-view-publish-header-btn.primary:hover {
  opacity: 0.9;
}

.view-view-publish-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.view-view-publish-editor {
  max-width: 700px;
  width: 100%;
}

.view-view-publish-editor-title {
  font-size: 32px;
  font-weight: bold;
  border: none;
  background: transparent;
  color: var(--text-primary);
  width: 100%;
  outline: none;
  margin-bottom: 24px;
  font-family: Georgia, 'Times New Roman', serif;
}

.view-view-publish-editor-title::placeholder {
  color: var(--text-secondary);
}

.view-view-publish-editor-body {
  font-size: 16px;
  line-height: 1.8;
  border: none;
  background: transparent;
  color: var(--text-primary);
  width: 100%;
  min-height: 400px;
  outline: none;
  resize: none;
  font-family: Georgia, 'Times New Roman', serif;
}

.view-view-publish-editor-body::placeholder {
  color: var(--text-secondary);
}

.view-view-publish-word-count {
  margin-top: 20px;
  font-size: 11px;
  color: var(--text-secondary);
  text-align: right;
}
`;

const icons = {
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
};

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
  components: { KitViewLayout, KitNavFooter, KitButton },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="view-view-publish-sidebar-content">
          <div class="view-view-publish-sidebar-header">Drafts</div>
          <div
            v-for="doc in documents.drafts"
            :key="doc.id"
            class="view-view-publish-item"
            :class="{ active: selectedDoc === doc.id }"
            @click="selectDoc(doc)"
          >
            <svg class="view-view-publish-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.file"></svg>
            <span class="view-view-publish-item-name">{{ doc.name }}</span>
            <span class="view-view-publish-item-status draft">Draft</span>
          </div>

          <div class="view-view-publish-sidebar-header">Published</div>
          <div
            v-for="doc in documents.published"
            :key="doc.id"
            class="view-view-publish-item"
            :class="{ active: selectedDoc === doc.id }"
            @click="selectDoc(doc)"
          >
            <svg class="view-view-publish-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.file"></svg>
            <span class="view-view-publish-item-name">{{ doc.name }}</span>
            <span class="view-view-publish-item-status published">Live</span>
          </div>
        </div>
        <KitNavFooter>
          <KitButton>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.trash"></svg>
          </KitButton>
          <KitButton>
            <svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icons.plus"></svg>
          </KitButton>
        </KitNavFooter>
      </template>

      <div class="view-view-publish-main">
        <div class="view-view-publish-header">
          <div class="view-view-publish-header-left">
            <span class="view-view-publish-header-title">{{ selectedName }}</span>
            <span class="view-view-publish-header-meta">{{ selectedStatus === 'published' ? 'Published' : 'Draft' }} • Last edited 5 min ago</span>
          </div>
          <div class="view-view-publish-header-actions">
            <button class="view-view-publish-header-btn">Preview</button>
            <button class="view-view-publish-header-btn primary">Publish</button>
          </div>
        </div>
        <div class="view-view-publish-content">
          <div class="view-view-publish-editor">
            <input
              type="text"
              class="view-view-publish-editor-title"
              v-model="title"
              placeholder="Title..."
            >
            <textarea
              class="view-view-publish-editor-body"
              v-model="body"
              placeholder="Start writing..."
              @input="updateWordCount"
            ></textarea>
            <div class="view-view-publish-word-count">{{ wordCount }} words</div>
          </div>
        </div>
      </div>
    </KitViewLayout>
  `,
  setup() {
    useStyles('view-publish-styles', styles);

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
      icons,
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
