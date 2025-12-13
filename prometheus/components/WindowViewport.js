import { store } from '../store.js';
import { WindowMenu } from './WindowMenu.js';
import { WindowContent } from './WindowContent.js';
import { Terminal } from './Terminal.js';

export const WindowViewport = {
  components: { WindowMenu, WindowContent, Terminal },
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-viewport">
      <WindowMenu :type="type" />
      <div class="window-main">
        <WindowContent v-if="type" :type="type" />
        <router-view v-else />
        <Terminal />
      </div>
    </div>
  `,
  setup(props) {
    return { store };
  },
};
