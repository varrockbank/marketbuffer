import { store } from '../store.js';
import { ProjectSelector } from './ProjectSelector.js';

export const SubSidenav = {
  components: { ProjectSelector },
  template: `
    <div class="sub-sidenav" :class="{ collapsed: store.subSidenavCollapsed }">
      <div class="sub-sidenav-header">
        <ProjectSelector v-if="store.activeMenuItem === 'code'" />
        <span v-else class="sub-sidenav-title">{{ title }}</span>
      </div>
      <div class="sub-sidenav-content">
        <div style="padding: 8px; color: var(--text-secondary);">
          {{ store.activeMenuItem }} panel
        </div>
      </div>
    </div>
  `,
  setup() {
    const title = Vue.computed(() => {
      const titles = {
        yap: 'Yap',
        deployments: 'Deployments',
        data: 'Data',
        stream: 'Stream',
        code: 'Code',
        publish: 'Publish',
        simulate: 'Simulate',
        agents: 'Agents',
      };
      return titles[store.activeMenuItem] || 'Panel';
    });

    return { store, title };
  },
};
