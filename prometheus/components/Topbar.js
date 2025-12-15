import { store, actions, isWindowOpen } from '../store.js';
import { KitBar } from './kit/KitBar.js';
import { KitButton } from './kit/KitButton.js';
import { KitBrand } from './kit/KitBrand.js';
import { KitMenu } from './kit/KitMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';
import { KitMenuSeparator } from './kit/KitMenuSeparator.js';
import { KitTUIBar } from './kit/tui/KitTUIBar.js';
import { KitTUIButton } from './kit/tui/KitTUIButton.js';

export const Topbar = {
  components: { KitBar, KitButton, KitBrand, KitMenu, KitMenuItem, KitMenuSeparator, KitTUIBar, KitTUIButton },
  template: `
    <!-- TUI Mode Bar -->
    <KitTUIBar v-if="store.tuiMode" :brand="store.brandName">
      <KitTUIButton char="H" tooltip="Home" :active="isHome" @click="router.push('/')" />
      <KitTUIButton char="A" tooltip="Applications" @click="router.push('/applications')" />
      <KitTUIButton char="⽉" tooltip="Toggle Theme" @click="actions.toggleTheme" />
      <KitTUIButton char="#" tooltip="Exit TUI Mode" @click="actions.toggleTuiMode" />
      <KitTUIButton char="C" tooltip="Toggle Contrast" @click="actions.toggleContrast" />
      <KitTUIButton char="S" tooltip="Toggle Sidenav" @click="actions.toggleSidenav" />
      <KitTUIButton char="P" tooltip="Toggle Panel" @click="actions.toggleSubSidenav" />
      <KitTUIButton char=">" tooltip="Toggle Terminal" @click="actions.toggleTerminal" />
      <KitTUIButton char="F" tooltip="Focus Mode" @click="actions.toggleDistractionFree" />
    </KitTUIBar>

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

    const launchApp = (appId, closeMenu) => {
      actions.openWindow(appId);
      router.push('/');
      closeMenu();
    };

    const goToApps = (closeMenu) => {
      router.push('/applications');
      closeMenu();
    };

    return { store, actions, router, themeIcon, themeTitle, contrastTitle, focusTitle, terminalTitle, isHome, isWindowOpen, launchApp, goToApps };
  },
};
