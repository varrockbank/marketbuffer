import { store, actions } from '../store.js';
import { MenuBarButton } from './MenuBarButton.js';
import { Brand } from './Brand.js';

const icons = {
  sidenav: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  subSidenav: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
};

export const MenuBar = {
  components: { MenuBarButton, Brand },
  template: `
    <div class="menu-bar">
      <Brand />
      <div class="menu-bar-right">
        <MenuBarButton :icon="themeIcon" :title="themeTitle" @click="actions.toggleTheme" />
        <MenuBarButton :icon="icons.sidenav" title="Toggle Sidenav" @click="actions.toggleSidenav" />
        <MenuBarButton :icon="icons.subSidenav" title="Toggle Panel" @click="actions.toggleSubSidenav" />
        <MenuBarButton :icon="icons.terminal" title="Toggle Terminal" @click="actions.toggleTerminal" />
      </div>
    </div>
  `,
  setup() {
    const themeIcon = Vue.computed(() => store.theme === 'dark' ? icons.sun : icons.moon);
    const themeTitle = Vue.computed(() => store.theme === 'dark' ? 'Light mode' : 'Dark mode');
    return { store, actions, icons, themeIcon, themeTitle };
  },
};
