import { ViewLayout } from '../ViewLayout.js';

export const ViewAgents = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div style="padding: 8px; color: var(--text-secondary);">
          Agent list
        </div>
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Agents</h1>
        <p class="view-content-text">Morbi luctus, wisi viverra faucibus pretium, nibh est placerat odio, nec commodo wisi enim eget quam.</p>
      </div>
    </ViewLayout>
  `,
};
