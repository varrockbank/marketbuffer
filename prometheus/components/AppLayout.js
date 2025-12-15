import { store } from '../store.js';
import { useStyles } from '../lib/useStyles.js';
import { Dock } from './Dock.js';
import { Topbar } from './Topbar.js';

const styles = `
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-box {
  flex: 1;
  display: flex;
  overflow: hidden;
}
`;

export const AppLayout = {
  components: { Dock, Topbar },
  template: `
    <div class="app-layout" :class="['theme-' + store.theme, { 'no-contrast': !store.contrast, 'distraction-free': store.distractionFree }]">
      <Topbar />
      <div class="app-box">
        <Dock />
        <div class="app-box">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  setup() {
    useStyles('app-layout', styles);
    return { store };
  },
};
