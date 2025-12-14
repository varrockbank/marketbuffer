import { store, apps, type2AppIds } from '../store.js';
import { AppSimulator } from './apps/AppSimulator.js';
import { AppWallpaper } from './apps/AppWallpaper.js';
import { Terminal } from './Terminal.js';
import { DesignPanelMenu } from './design/DesignPanelMenu.js';

// Todo: rename: AppViewport 

export const WindowViewport = {
  components: { AppSimulator, AppWallpaper, Terminal, DesignPanelMenu },
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-viewport">
      <div v-if="!isType2App">
         <DesignPanelMenu :title="title" :collapsed="store.subSidenavCollapsed">
          <div style="padding: 8px; color: var(--text-secondary);">
            {{ activeType }} panel
          </div>
        </DesignPanelMenu>
      </div>
      <div class="window-main">
        <AppSimulator v-if="type === 'simulator'" />
        <AppWallpaper v-else-if="type === 'wallpaper'" />
        <router-view v-else />
        <Terminal v-if="!isType2App" />
      </div>
    </div>
  `,
  setup(props) {
    const isType2App = Vue.computed(() => type2AppIds.includes(props.type));
    const activeType = Vue.computed(() => props.type || store.activeMenuItem);

    const title = Vue.computed(() => {
      const app = apps.find(a => a.id === activeType.value);
      return app?.label || 'Panel';
    });
    return { store, title, isType2App };
  },
};
