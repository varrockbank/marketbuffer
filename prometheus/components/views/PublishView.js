import { ViewLayout } from '../ViewLayout.js';

export const PublishView = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Publications
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Publish</h1>
        <p class="view-content-text">Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien.</p>
      </div>
    </ViewLayout>
  `,
};
