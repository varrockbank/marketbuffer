import { store } from '../store.js';
import { Dock } from './Dock.js';
import { Topbar } from './Topbar.js';
import { KitTUIVbufTerminal } from './kit/tui/KitTUIVbufTerminal.js';

export const AppLayout = {
  components: { Dock, Topbar, KitTUIVbufTerminal },
  template: `
    <div class="flex flex-col h-screen" :class="['theme-' + store.theme, { 'no-contrast': !store.contrast, 'distraction-free': store.distractionFree }]">
      <Topbar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex overflow-hidden">
          <Dock />
          <div class="flex-1 flex overflow-hidden">
            <slot></slot>
          </div>
        </div>
        <KitTUIVbufTerminal v-if="store.tuiMode && store.terminalExpanded && !store.distractionFree" />
      </div>
    </div>
  `,
  setup() {
    return { store };
  },
};
