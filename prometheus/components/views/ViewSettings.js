import { ViewLayout } from '../ViewLayout.js';

export const ViewSettings = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Categories
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Settings</h1>
        <p class="view-content-text">Configure your preferences and account settings here.</p>
      </div>
    </ViewLayout>
  `,
};
