import { ViewLayout } from '../ViewLayout.js';

export const DeploymentsView = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Deployment list
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Deployments</h1>
        <p class="view-content-text">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </div>
    </ViewLayout>
  `,
};
