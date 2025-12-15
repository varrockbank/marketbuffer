import { store, actions, isWindowOpen } from '../store.js';
import { KitBar } from './kit/KitBar.js';
import { KitButton } from './kit/KitButton.js';
import { KitBrand } from './kit/KitBrand.js';
import { KitMenu } from './kit/KitMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';
import { KitMenuSeparator } from './kit/KitMenuSeparator.js';
import { KitTUIBar } from './kit/tui/KitTUIBar.js';

export const Topbar = {
  components: { KitBar, KitButton, KitBrand, KitMenu, KitMenuItem, KitMenuSeparator, KitTUIBar },
  template: `
    <!-- TUI Mode Bar -->
    <KitTUIBar v-if="store.tuiMode" :brand="store.brandName" :buttons="tuiButtons" :distractionFree="store.distractionFree" :borderless="!store.contrast" @button-click="onTuiButtonClick" />

    <!-- Normal Mode Bar -->
    <KitBar v-else class="topbar-bar">
      <template #left>
        <KitBrand v-if="!store.distractionFree" :icon="store.brandIcon" :name="store.brandName" :subtitle="'v' + store.version" />
      </template>
      <template v-if="!store.distractionFree">
        <KitButton icon="home" tooltip="Home" size="sm" variant="primary" :active="isHome" @click="router.push('/')" />
        <KitMenu direction="down" trigger="click" align="right" compact>
          <template #trigger>
            <KitButton icon="apps" tooltip="Applications" size="sm" variant="primary" />
          </template>
          <template #menu="{ close }">
            <KitMenuItem
              v-for="app in store.type2Apps"
              :key="app.id"
              :icon="app.icon"
              :selected="isWindowOpen(app.id)"
              selectable
              @click="launchApp(app.id, close)"
            >
              <span>{{ app.label }}</span>
            </KitMenuItem>
            <KitMenuSeparator />
            <KitMenuItem icon="ellipsis" variant="success" @click="goToApps(close)">
              <span>More Apps</span>
            </KitMenuItem>
          </template>
        </KitMenu>
        <KitButton :icon="themeIcon" :tooltip="themeTitle + ' (' + store.modKey + '⇧T)'" size="sm" variant="primary" @click="actions.toggleTheme" />
        <KitButton icon="box" tooltip="TUI Mode" size="sm" variant="primary" @click="actions.toggleTuiMode" />
        <KitButton icon="contrast" :tooltip="contrastTitle + ' (' + store.modKey + '⇧C)'" size="sm" variant="primary" @click="actions.toggleContrast" />
        <KitButton icon="sidenav" :tooltip="'Toggle Sidenav (' + store.modKey + 'B)'" size="sm" variant="primary" @click="actions.toggleSidenav" />
        <KitButton icon="subSidenav" :tooltip="'Toggle Panel (' + store.modKey + 'J)'" size="sm" variant="primary" @click="actions.toggleSubSidenav" />
        <KitButton icon="terminal" :tooltip="terminalTitle" size="sm" variant="primary" @click="actions.toggleTerminal" />
      </template>
      <KitButton icon="focus" :tooltip="focusTitle" size="sm" variant="primary" @click="actions.toggleDistractionFree" class="focus-btn" />
    </KitBar>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();
    const themeIcon = Vue.computed(() => store.theme === 'dark' ? 'sun' : 'moon');
    const themeTitle = Vue.computed(() => store.theme === 'dark' ? 'Light mode' : 'Dark mode');
    const contrastTitle = Vue.computed(() => store.contrast ? 'Borderless' : 'Border');
    const focusTitle = Vue.computed(() => store.distractionFree ? 'Exit Focus (' + store.modKey + '⇧F)' : 'Focus Mode (' + store.modKey + '⇧F)');
    const terminalTitle = Vue.computed(() => 'Toggle Terminal (' + store.modKey + '`)');
    const isHome = Vue.computed(() => route.path === '/');

    // TUI buttons with reactive active states
    const tuiButtons = Vue.computed(() => {
      const inFocus = store.distractionFree;
      const buttons = [
        { id: 'theme', char: store.theme === 'dark' ? '☀' : '☽', active: false, hidden: inFocus },
        { id: 'tui', char: '#', active: store.tuiMode, hidden: inFocus },
        { id: 'contrast', char: 'C', active: store.contrast, hidden: inFocus },
        { id: 'sidenav', char: 'S', active: !store.sidenavCollapsed, hidden: inFocus },
        { id: 'panel', char: 'P', active: !store.subSidenavCollapsed, hidden: inFocus },
        { id: 'terminal', char: 'T', active: store.terminalExpanded, hidden: inFocus },
        { id: 'focus', char: 'F', active: inFocus, hidden: false },
      ];
      // Only show apps button when not on applications page
      if (route.path !== '/applications') {
        buttons.unshift({ id: 'apps', char: 'A', active: false, hidden: inFocus });
      }
      return buttons;
    });

    const launchApp = (appId, closeMenu) => {
      actions.openWindow(appId);
      router.push('/');
      closeMenu();
    };

    const goToApps = (closeMenu) => {
      router.push('/applications');
      closeMenu();
    };

    const onTuiButtonClick = (id) => {
      console.log('onTuiButtonClick received:', id);
      switch (id) {
        case 'home': router.push('/'); break;
        case 'apps': router.push('/applications'); break;
        case 'theme': actions.toggleTheme(); break;
        case 'tui': actions.toggleTuiMode(); break;
        case 'contrast': actions.toggleContrast(); break;
        case 'sidenav': actions.toggleSidenav(); break;
        case 'panel': actions.toggleSubSidenav(); break;
        case 'terminal': actions.toggleTerminal(); break;
        case 'focus': actions.toggleDistractionFree(); break;
      }
    };

    return { store, actions, router, themeIcon, themeTitle, contrastTitle, focusTitle, terminalTitle, isHome, isWindowOpen, launchApp, goToApps, tuiButtons, onTuiButtonClick };
  },
};
