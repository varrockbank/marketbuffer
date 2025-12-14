import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';

export const ViewSettings = {
  components: { KitViewLayout },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Categories
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Settings</h1>
        <p class="view-content-text">Configure your preferences and account settings here.</p>
      </div>
    </KitViewLayout>
  `,
  setup() {
    return { store };
  },
};
