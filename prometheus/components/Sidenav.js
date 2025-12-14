import { store, actions, menuItems, type2Apps, type2AppIds, type3Apps } from '../store.js';
import { SidenavItem } from './SidenavItem.js';
import { DesignNavFooter } from './design/DesignNavFooter.js';
import { DesignDropdownMenu } from './design/DesignDropdownMenu.js';
import { DesignMenuItem } from './design/DesignMenuItem.js';
import { DesignIcon } from './design/DesignIcon.js';

// TODO: rename to Dock 

export const Sidenav = {
  components: { SidenavItem, DesignNavFooter, DesignDropdownMenu, DesignMenuItem, DesignIcon },
  template: `
    <div class="sidenav" :class="{ collapsed: store.sidenavCollapsed }">
      <div class="sidenav-menu">
        <SidenavItem
          v-for="item in menuItems"
          :key="item.id"
          :id="item.id"
          :label="item.label"
          :icon="item.icon"
          :submenu="item.submenu"
        />
        <template v-if="activeApps.length > 0">
          <div class="sidenav-separator"></div>
          <SidenavItem
            v-for="app in activeApps"
            :key="app.id"
            :id="app.id"
            :label="app.label"
            :icon="app.icon"
            :active="app.isActive"
            @click="app.onClick"
          />
        </template>
      </div>
      <DesignNavFooter>
        <DesignDropdownMenu direction="up">
          <template #trigger>
            <div class="sidenav-item" data-tooltip="Profile">
              <DesignIcon icon="user" class="sidenav-icon" />
              <span class="sidenav-label">Profile</span>
            </div>
          </template>
          <template #menu="{ close }">
            <div class="dropdown-menu-header">username@foobar.com</div>
            <div class="dropdown-menu-separator"></div>
            <DesignMenuItem icon="settings" to="/settings" @click="close">
              <span>Settings</span>
            </DesignMenuItem>
            <DesignMenuItem icon="globe">
              <span>Language</span>
            </DesignMenuItem>
            <DesignMenuItem icon="help">
              <span>Get help</span>
            </DesignMenuItem>
            <div class="dropdown-menu-separator"></div>
            <DesignMenuItem icon="book">
              <span>Learn more</span>
            </DesignMenuItem>
            <div class="dropdown-menu-separator"></div>
            <DesignMenuItem icon="logout" variant="danger">
              <span>Log out</span>
            </DesignMenuItem>
          </template>
        </DesignDropdownMenu>
      </DesignNavFooter>
    </div>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    const isHome = Vue.computed(() => route.path === '/');

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

    return { store, actions, menuItems, activeApps, isHome };
  },
};
