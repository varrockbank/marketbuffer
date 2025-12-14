import { store } from '../store.js';
import { WindowMenu } from './WindowMenu.js';
import { WindowContent } from './WindowContent.js';
import { SimulatorWindow } from './SimulatorWindow.js';
import { Terminal } from './Terminal.js';

export const WindowViewport = {
  components: { WindowMenu, WindowContent, SimulatorWindow, Terminal },
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-viewport">
      <WindowMenu v-if="type !== 'simulator'" :type="type" />
      <div class="window-main">
        <SimulatorWindow v-if="type === 'simulator'" />
        <WindowContent v-else-if="type" :type="type" />
        <router-view v-else />
        <Terminal v-if="type !== 'simulator'" />
      </div>
    </div>
  `,
  setup(props) {
    return { store };
  },
};
