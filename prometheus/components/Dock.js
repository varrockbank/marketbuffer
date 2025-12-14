import { store, actions, menuItems, type2Apps, type2AppIds, type3Apps } from '../store.js';
import { KitSidebar } from './kit/KitSidebar.js';
import { KitNavItem } from './kit/KitNavItem.js';
import { KitSidebarFooter } from './kit/KitSidebarFooter.js';
import { KitDropdownMenu } from './kit/KitDropdownMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';

export const Dock = {
  components: { KitSidebar, KitNavItem, KitSidebarFooter, KitDropdownMenu, KitMenuItem },
  template: `
    <KitSidebar class="sidenav" :collapsed="store.sidenavCollapsed">
      <KitNavItem
        v-for="item in menuItems"
        :key="item.id"
        :icon="item.icon"
        :label="item.label"
        :to="getRoute(item.id)"
        :active="store.activeMenuItem === item.id"
      />
      <template v-if="activeApps.length > 0">
        <div class="sidenav-separator"></div>
        <KitNavItem
          v-for="app in activeApps"
          :key="app.id"
          :icon="app.icon"
          :label="app.label"
          :active="app.isActive"
          @click="app.onClick"
        />
      </template>
      <KitSidebarFooter>
        <KitDropdownMenu direction="up">
          <template #trigger>
            <KitNavItem icon="user" label="Profile" />
          </template>
          <template #menu="{ close }">
            <div class="dropdown-menu-header">username@foobar.com</div>
            <div class="dropdown-menu-separator"></div>
            <KitMenuItem icon="settings" to="/settings" @click="close">
              <span>Settings</span>
            </KitMenuItem>
            <KitMenuItem icon="globe">
              <span>Language</span>
            </KitMenuItem>
            <KitMenuItem icon="help">
              <span>Get help</span>
            </KitMenuItem>
            <div class="dropdown-menu-separator"></div>
            <KitMenuItem icon="book">
              <span>Learn more</span>
            </KitMenuItem>
            <div class="dropdown-menu-separator"></div>
            <KitMenuItem icon="logout" variant="danger">
              <span>Log out</span>
            </KitMenuItem>
          </template>
        </KitDropdownMenu>
      </KitSidebarFooter>
    </KitSidebar>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    const isHome = Vue.computed(() => route.path === '/');

    const getRoute = (id) => {
      if (id === 'code') return '/code/' + store.currentProject;
      return '/' + id;
    };

    // Combine type-2 open windows and type-3 active routes
    const activeApps = Vue.computed(() => {
      const apps = [];

      // Type-2: open windows
      store.openWindows
        .filter(id => type2AppIds.includes(id))
        .forEach(id => {
          const app = type2Apps.find(a => a.id === id);
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
      type3Apps.forEach(app => {
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

    return { store, menuItems, activeApps, getRoute };
  },
};
