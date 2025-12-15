import { store } from '../store.js';
import { Dock } from './Dock.js';
import { Topbar } from './Topbar.js';

export const AppLayout = {
  components: { Dock, Topbar },
  template: `
    <div class="flex flex-col h-screen" :class="['theme-' + store.theme, { 'no-contrast': !store.contrast, 'distraction-free': store.distractionFree }]">
      <Topbar />
      <div class="flex-1 flex overflow-hidden">
        <Dock />
        <div class="flex-1 flex overflow-hidden">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  setup() {
    return { store };
  },
};
