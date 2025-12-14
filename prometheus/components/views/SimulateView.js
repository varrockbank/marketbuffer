import { ViewLayout } from '../ViewLayout.js';

export const SimulateView = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Simulations
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Simulate</h1>
        <p class="view-content-text">Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</p>
      </div>
    </ViewLayout>
  `,
};
