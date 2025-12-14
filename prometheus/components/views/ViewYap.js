import { ViewLayout } from '../ViewLayout.js';

export const ViewYap = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Conversations list
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Yap</h1>
        <p class="view-content-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </ViewLayout>
  `,
};
