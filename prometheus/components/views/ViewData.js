import { ViewLayout } from '../ViewLayout.js';

export const ViewData = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Data sources
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Data</h1>
        <p class="view-content-text">Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.</p>
      </div>
    </ViewLayout>
  `,
};
