import { store, actions, type2Apps } from '../store.js';
import { DesignMenuBarButton } from './design/DesignMenuBarButton.js';
import { DesignBrand } from './design/DesignBrand.js';
import { DesignDropdownMenu } from './design/DesignDropdownMenu.js';
import { DesignMenuItem } from './design/DesignMenuItem.js';

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

// TODO: rename toolbar

export const MenuBar = {
  components: { DesignMenuBarButton, DesignBrand, DesignDropdownMenu, DesignMenuItem },
  template: `
    <div class="menu-bar">
      <DesignBrand v-if="!store.distractionFree" :icon="store.brandIcon" :name="store.brandName" :subtitle="'v' + store.version" />
      <div class="menu-bar-right">
        <template v-if="!store.distractionFree">
          <DesignMenuBarButton icon="home" title="Home" :active="isHome" @click="goHome" />
          <DesignDropdownMenu direction="down" trigger="click">
            <template #trigger>
              <DesignMenuBarButton icon="apps" title="Applications" />
            </template>
            <template #menu="{ close }">
              <DesignMenuItem
                v-for="app in type2Apps"
                :key="app.id"
                :icon="app.icon"
                :selected="store.openWindows.includes(app.id)"
                selectable
                @click="launchApp(app.id, close)"
              >
                <span>{{ app.label }}</span>
              </DesignMenuItem>
              <div class="dropdown-menu-separator"></div>
              <DesignMenuItem icon="ellipsis" @click="goToApps(close)">
                <span>More Apps</span>
              </DesignMenuItem>
            </template>
          </DesignDropdownMenu>
          <DesignMenuBarButton :icon="themeIcon" :title="themeTitle + ' (' + modKey + '⇧T)'" @click="actions.toggleTheme" />
          <DesignMenuBarButton icon="contrast" :title="contrastTitle + ' (' + modKey + '⇧C)'" @click="actions.toggleContrast" />
          <DesignMenuBarButton icon="sidenav" :title="'Toggle Sidenav (' + modKey + 'B)'" @click="actions.toggleSidenav" />
          <DesignMenuBarButton icon="subSidenav" :title="'Toggle Panel (' + modKey + 'J)'" @click="actions.toggleSubSidenav" />
          <DesignMenuBarButton icon="terminal" :title="terminalTitle" @click="actions.toggleTerminal" />
        </template>
        <DesignMenuBarButton icon="focus" :title="focusTitle" @click="actions.toggleDistractionFree" class="focus-btn" />
      </div>
    </div>
  `,
  setup() {
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

    return { store, actions, themeIcon, themeTitle, contrastTitle, focusTitle, terminalTitle, modKey, goHome, isHome, type2Apps, launchApp, goToApps };
  },
};
