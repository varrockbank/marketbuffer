import { store } from '../store.js';
import { WindowMenu } from './WindowMenu.js';
import { AppSimulator } from './apps/AppSimulator.js';
import { AppWallpaper } from './apps/AppWallpaper.js';
import { Terminal } from './Terminal.js';

// Type-2 apps don't show WindowMenu or Terminal
const type2Apps = ['simulator', 'wallpaper'];

export const WindowViewport = {
  components: { WindowMenu, AppSimulator, AppWallpaper, Terminal },
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-viewport">
      <WindowMenu v-if="!isType2App" :type="type" />
      <div class="window-main">
        <AppSimulator v-if="type === 'simulator'" />
        <AppWallpaper v-else-if="type === 'wallpaper'" />
        <router-view v-else />
        <Terminal v-if="!isType2App" />
      </div>
    </div>
  `,
  setup(props) {
    const isType2App = Vue.computed(() => type2Apps.includes(props.type));
    return { store, isType2App };
  },
};
