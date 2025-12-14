import { ViewLayout } from '../ViewLayout.js';

export const ViewStream = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Active streams
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Stream</h1>
        <p class="view-content-text">Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.</p>
      </div>
    </ViewLayout>
  `,
};
