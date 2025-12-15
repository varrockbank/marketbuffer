import { store, actions, type2Apps, isWindowOpen } from '../store.js';
import { KitBar } from './kit/KitBar.js';
import { KitButton } from './kit/KitButton.js';
import { KitBrand } from './kit/KitBrand.js';
import { KitMenu } from './kit/KitMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';
import { useStyles } from '../lib/useStyles.js';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

const styles = `
.topbar-bar .kit-bar-right .kit-menu {
  width: auto;
  padding: 0;
}

.topbar-bar .kit-bar-right .kit-menu-dropdown {
  left: auto;
  right: 0;
  min-width: 220px;
}
`;

export const Topbar = {
  components: { KitBar, KitButton, KitBrand, KitMenu, KitMenuItem },
  template: `
    <KitBar class="topbar-bar">
      <template #left>
        <KitBrand v-if="!store.distractionFree" :icon="store.brandIcon" :name="store.brandName" :subtitle="'v' + store.version" />
      </template>
      <template v-if="!store.distractionFree">
        <KitButton icon="home" tooltip="Home" size="sm" :active="isHome" @click="goHome" />
        <KitMenu direction="down" trigger="click">
          <template #trigger>
            <KitButton icon="apps" tooltip="Applications" size="sm" />
          </template>
          <template #menu="{ close }">
            <KitMenuItem
              v-for="app in type2Apps"
              :key="app.id"
              :icon="app.icon"
              :selected="isWindowOpen(app.id)"
              selectable
              @click="launchApp(app.id, close)"
            >
              <span>{{ app.label }}</span>
            </KitMenuItem>
            <div class="kit-menu-separator"></div>
            <KitMenuItem icon="ellipsis" @click="goToApps(close)">
              <span>More Apps</span>
            </KitMenuItem>
          </template>
        </KitMenu>
        <KitButton :icon="themeIcon" :tooltip="themeTitle + ' (' + modKey + '⇧T)'" size="sm" @click="actions.toggleTheme" />
        <KitButton icon="contrast" :tooltip="contrastTitle + ' (' + modKey + '⇧C)'" size="sm" @click="actions.toggleContrast" />
        <KitButton icon="sidenav" :tooltip="'Toggle Sidenav (' + modKey + 'B)'" size="sm" @click="actions.toggleSidenav" />
        <KitButton icon="subSidenav" :tooltip="'Toggle Panel (' + modKey + 'J)'" size="sm" @click="actions.toggleSubSidenav" />
        <KitButton icon="terminal" :tooltip="terminalTitle" size="sm" @click="actions.toggleTerminal" />
      </template>
      <KitButton icon="focus" :tooltip="focusTitle" size="sm" @click="actions.toggleDistractionFree" class="focus-btn" />
    </KitBar>
  `,
  setup() {
    useStyles('topbar', styles);

    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();
    const themeIcon = Vue.computed(() => store.theme === 'dark' ? 'sun' : 'moon');
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

    return { store, actions, themeIcon, themeTitle, contrastTitle, focusTitle, terminalTitle, modKey, goHome, isHome, type2Apps, isWindowOpen, launchApp, goToApps };
  },
};
