import { store, actions } from '../store.js';
import { KitSidebar } from './kit/KitSidebar.js';
import { KitButton } from './kit/KitButton.js';
import { KitSidebarFooter } from './kit/KitSidebarFooter.js';
import { KitMenu } from './kit/KitMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';
import { KitMenuSeparator } from './kit/KitMenuSeparator.js';
import { KitTUISidenav } from './kit/tui/KitTUISidenav.js';

export const Dock = {
  components: { KitSidebar, KitButton, KitSidebarFooter, KitMenu, KitMenuItem, KitMenuSeparator, KitTUISidenav },
  template: `
    <!-- TUI Mode Sidenav -->
    <KitTUISidenav
      v-if="store.tuiMode"
      :items="store.menuItems"
      :activeId="store.activeMenuItem"
      @select="handleSelect"
    >
      <template #footer>
        <div>[U] User</div>
      </template>
    </KitTUISidenav>

    <!-- Normal Mode Sidebar -->
    <KitSidebar v-else class="dock" :mode="sidebarMode" padded>
      <KitButton
        v-for="item in store.menuItems"
        :key="item.id"
        :icon="item.icon"
        :label="item.label"
        :to="getRoute(item.id)"
        :active="store.activeMenuItem === item.id"
        :collapsed="isIconMode"
        tooltipPosition="right"
        variant="sidebar"
      />
      <template v-if="activeApps.length > 0">
        <div class="h-px bg-[var(--border-color)] my-2 mx-2.5"></div>
        <KitButton
          v-for="app in activeApps"
          :key="app.id"
          :icon="app.icon"
          :label="app.label"
          :active="app.isActive"
          :collapsed="isIconMode"
          tooltipPosition="right"
          variant="sidebar"
          @click="app.onClick"
        />
      </template>
      <template #footer>
        <KitSidebarFooter>
          <KitMenu direction="up">
            <template #trigger>
              <KitButton icon="user" label="Profile" :collapsed="isIconMode" tooltipPosition="right" variant="sidebar" />
            </template>
            <template #menu="{ close }">
              <div class="p-2 font-medium text-[var(--text-primary)]">username@foobar.com</div>
              <KitMenuSeparator />
              <KitMenuItem icon="settings" to="/settings" @click="close">Settings</KitMenuItem>
              <KitMenuItem icon="globe">Language</KitMenuItem>
              <KitMenuItem icon="help">Get help</KitMenuItem>
              <KitMenuSeparator />
              <KitMenuItem icon="book">Learn more</KitMenuItem>
              <KitMenuSeparator />
              <KitMenuItem icon="logout" variant="danger">Log out</KitMenuItem>
            </template>
          </KitMenu>
        </KitSidebarFooter>
      </template>
    </KitSidebar>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    const isHome = Vue.computed(() => route.path === '/');

    // Sidebar mode: 'expanded', 'icon', or 'collapsed'
    const sidebarMode = Vue.computed(() => {
      if (store.distractionFree) return 'collapsed';
      if (store.sidenavCollapsed) return 'icon';
      return 'expanded';
    });

    const isIconMode = Vue.computed(() => sidebarMode.value === 'icon');

    const getRoute = (id) => {
      if (id === 'code') return '/code/' + store.currentProject;
      return '/' + id;
    };

    // Combine type-2 open windows and type-3 active routes
    const activeApps = Vue.computed(() => {
      const apps = [];

      // Type-2: open windows
      store.openWindows
        .filter(id => store.type2AppIds.includes(id))
        .forEach(id => {
          const app = store.type2Apps.find(a => a.id === id);
          apps.push({
            ...app,
            isActive: isHome.value && store.activeWindow === id,
            onClick: () => {
              actions.bringToFront(id);
              router.push('/');
            },
          });
        });

      // Type-3: active routes
      store.type3Apps.forEach(app => {
        if (route.path === app.route) {
          apps.push({
            ...app,
            isActive: true,
            onClick: () => router.push(app.route),
          });
        }
      });

      return apps;
    });

    const handleSelect = (id) => {
      const route = getRoute(id);
      router.push(route);
    };

    return { store, activeApps, getRoute, sidebarMode, isIconMode, handleSelect };
  },
};
