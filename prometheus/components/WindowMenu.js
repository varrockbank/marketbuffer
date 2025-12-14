import { store } from '../store.js';
import { ProjectSelector } from './ProjectSelector.js';
import { FileTreeContainer } from './FileTree.js';

export const WindowMenu = {
  components: { ProjectSelector, FileTreeContainer },
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-menu" :class="{ collapsed: store.subSidenavCollapsed }">
      <div class="window-menu-header">
        <ProjectSelector v-if="activeType === 'code'" />
        <span v-else class="window-menu-title">{{ title }}</span>
      </div>
      <div class="window-menu-content">
        <FileTreeContainer v-if="activeType === 'code'" />
        <div v-else style="padding: 8px; color: var(--text-secondary);">
          {{ activeType }} panel
        </div>
      </div>
    </div>
  `,
  setup(props) {
    const activeType = Vue.computed(() => props.type || store.activeMenuItem);

    const title = Vue.computed(() => {
      const titles = {
        applications: 'Applications',
        yap: 'Yap',
        deployments: 'Deployments',
        data: 'Data',
        stream: 'Stream',
        code: 'Code',
        publish: 'Publish',
        simulate: 'Simulate',
        agents: 'Agents',
        settings: 'Settings',
      };
      return titles[activeType.value] || 'Panel';
    });

    return { store, title, activeType };
  },
};
