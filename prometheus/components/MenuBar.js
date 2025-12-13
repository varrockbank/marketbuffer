import { store, actions } from '../store.js';
import { MenuBarButton } from './MenuBarButton.js';
import { Brand } from './Brand.js';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

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
        <MenuBarButton :icon="themeIcon" :title="themeTitle + ' (' + modKey + '⇧T)'" @click="actions.toggleTheme" />
        <MenuBarButton :icon="icons.sidenav" :title="'Toggle Sidenav (' + modKey + 'B)'" @click="actions.toggleSidenav" />
        <MenuBarButton :icon="icons.subSidenav" :title="'Toggle Panel (' + modKey + 'J)'" @click="actions.toggleSubSidenav" />
        <MenuBarButton :icon="icons.terminal" :title="terminalTitle" @click="actions.toggleTerminal" />
      </div>
    </div>
  `,
  setup() {
    const themeIcon = Vue.computed(() => store.theme === 'dark' ? icons.sun : icons.moon);
    const themeTitle = Vue.computed(() => store.theme === 'dark' ? 'Light mode' : 'Dark mode');
    const terminalTitle = 'Toggle Terminal (' + modKey + '`)';

    Vue.onMounted(() => {
      const handleKeydown = (e) => {
        const mod = isMac ? e.metaKey : e.ctrlKey;
        if (!mod) return;

        if (e.shiftKey && e.key.toLowerCase() === 't') {
          e.preventDefault();
          actions.toggleTheme();
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          actions.toggleSidenav();
        } else if (e.key.toLowerCase() === 'j') {
          e.preventDefault();
          actions.toggleSubSidenav();
        } else if (e.key === '`') {
          e.preventDefault();
          actions.toggleTerminal();
        }
      };

      window.addEventListener('keydown', handleKeydown);
      Vue.onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
    });

    return { store, actions, icons, themeIcon, themeTitle, terminalTitle, modKey };
  },
};
