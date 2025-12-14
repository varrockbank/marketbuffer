import { store, actions } from '../store.js';
import { MenuBarButton } from './MenuBarButton.js';
import { Brand } from './Brand.js';
import { DropdownMenu } from './DropdownMenu.js';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

const icons = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  sidenav: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  subSidenav: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  contrast: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/>',
  focus: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
  apps: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
};

// Type-2 apps available in Applications menu
const appSubmenu = [
  { id: 'simulator', label: 'Perfect Liquidity Simulator', icon: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>' },
  { id: 'wallpaper', label: 'Desktop Wallpaper', icon: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>' },
];

export const MenuBar = {
  components: { MenuBarButton, Brand, DropdownMenu },
  template: `
    <div class="menu-bar">
      <Brand v-if="!store.distractionFree" />
      <div class="menu-bar-right">
        <template v-if="!store.distractionFree">
          <MenuBarButton :icon="icons.home" title="Home" :active="isHome" @click="goHome" />
          <DropdownMenu direction="down" trigger="click">
            <template #trigger>
              <MenuBarButton :icon="icons.apps" title="Applications" />
            </template>
            <template #menu="{ close }">
              <div
                v-for="app in appSubmenu"
                :key="app.id"
                class="dropdown-menu-item"
                @click="launchApp(app.id, close)"
              >
                <svg v-if="store.openWindows.includes(app.id)" class="dropdown-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else class="dropdown-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="app.icon"></svg>
                <span>{{ app.label }}</span>
              </div>
              <div class="dropdown-menu-separator"></div>
              <div class="dropdown-menu-item" @click="goToApps(close)">
                <svg class="dropdown-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                <span>More Apps</span>
              </div>
            </template>
          </DropdownMenu>
          <MenuBarButton :icon="themeIcon" :title="themeTitle + ' (' + modKey + '⇧T)'" @click="actions.toggleTheme" />
          <MenuBarButton :icon="icons.contrast" :title="contrastTitle + ' (' + modKey + '⇧C)'" @click="actions.toggleContrast" />
          <MenuBarButton :icon="icons.sidenav" :title="'Toggle Sidenav (' + modKey + 'B)'" @click="actions.toggleSidenav" />
          <MenuBarButton :icon="icons.subSidenav" :title="'Toggle Panel (' + modKey + 'J)'" @click="actions.toggleSubSidenav" />
          <MenuBarButton :icon="icons.terminal" :title="terminalTitle" @click="actions.toggleTerminal" />
        </template>
        <MenuBarButton :icon="icons.focus" :title="focusTitle" @click="actions.toggleDistractionFree" class="focus-btn" />
      </div>
    </div>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();
    const themeIcon = Vue.computed(() => store.theme === 'dark' ? icons.sun : icons.moon);
    const themeTitle = Vue.computed(() => store.theme === 'dark' ? 'Light mode' : 'Dark mode');
    const contrastTitle = Vue.computed(() => store.contrast ? 'Borderless' : 'Border');
    const focusTitle = Vue.computed(() => store.distractionFree ? 'Exit Focus (' + modKey + '⇧F)' : 'Focus Mode (' + modKey + '⇧F)');
    const terminalTitle = 'Toggle Terminal (' + modKey + '`)';
    const isHome = Vue.computed(() => route.path === '/');

    const goHome = () => {
      router.push('/');
    };

    const launchApp = (appId, closeMenu) => {
      actions.openWindow(appId);
      router.push('/');
      closeMenu();
    };

    const goToApps = (closeMenu) => {
      router.push('/applications');
      closeMenu();
    };

    Vue.onMounted(() => {
      const handleKeydown = (e) => {
        const mod = isMac ? e.metaKey : e.ctrlKey;
        if (!mod) return;

        if (e.shiftKey && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          actions.toggleDistractionFree();
        } else if (e.shiftKey && e.key.toLowerCase() === 't') {
          e.preventDefault();
          actions.toggleTheme();
        } else if (e.shiftKey && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          actions.toggleContrast();
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

    return { store, actions, icons, themeIcon, themeTitle, contrastTitle, focusTitle, terminalTitle, modKey, goHome, isHome, appSubmenu, launchApp, goToApps };
  },
};
