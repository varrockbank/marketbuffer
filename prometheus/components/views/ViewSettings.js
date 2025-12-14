import { store } from '../../store.js';
import { DesignViewLayout } from '../design/DesignViewLayout.js';

export const ViewSettings = {
  components: { DesignViewLayout },
  template: `
    <DesignViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Categories
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Settings</h1>
        <p class="view-content-text">Configure your preferences and account settings here.</p>
      </div>
    </DesignViewLayout>
  `,
  setup() {
    return { store };
  },
};
