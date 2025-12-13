import { store, actions } from '../store.js';
import { MenuBarButton } from './MenuBarButton.js';
import { Brand } from './Brand.js';

const icons = {
  sidenav: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  subSidenav: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
};

export const MenuBar = {
  components: { MenuBarButton, Brand },
  template: `
    <div class="menu-bar">
      <Brand />
      <div class="menu-bar-right">
        <MenuBarButton :icon="icons.sidenav" title="Toggle Sidenav" @click="actions.toggleSidenav" />
        <MenuBarButton :icon="icons.subSidenav" title="Toggle Panel" @click="actions.toggleSubSidenav" />
        <MenuBarButton :icon="icons.terminal" title="Toggle Terminal" @click="actions.toggleTerminal" />
      </div>
    </div>
  `,
  setup() {
    return { store, actions, icons };
  },
};
