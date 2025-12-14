import { store, apps, type2AppIds } from '../store.js';
import { AppSimulator } from './apps/AppSimulator.js';
import { AppWallpaper } from './apps/AppWallpaper.js';
import { Terminal } from './Terminal.js';
import { KitSidebar } from './kit/KitSidebar.js';

export const AppViewport = {
  components: { AppSimulator, AppWallpaper, Terminal, KitSidebar },
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-viewport">
      <div v-if="!isType2App">
         <KitSidebar :title="title" :collapsed="store.subSidenavCollapsed">
          <div style="padding: 8px; color: var(--text-secondary);">
            {{ activeType }} panel
          </div>
        </KitSidebar>
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
