import { store, actions, menuItems, type2Apps, type2AppIds, type3Apps } from '../store.js';
import { useStyles } from '../lib/useStyles.js';
import { KitSidebar } from './kit/KitSidebar.js';
import { KitSidebarItem } from './kit/KitSidebarItem.js';
import { KitSidebarFooter } from './kit/KitSidebarFooter.js';
import { KitMenu } from './kit/KitMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';

const styles = `
/* Dock styling */
.dock {
  width: 200px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: width 0.2s ease-out;
}

.dock.collapsed {
  width: 48px;
}

.no-contrast .dock {
  background: var(--bg-primary);
  border-right-color: transparent;
}

.distraction-free .dock {
  display: none;
}
`;

export const Dock = {
  components: { KitSidebar, KitSidebarItem, KitSidebarFooter, KitMenu, KitMenuItem },
  template: `
    <KitSidebar class="dock" :collapsed="store.sidenavCollapsed" padded>
      <KitSidebarItem
        v-for="item in menuItems"
        :key="item.id"
        :icon="item.icon"
        :label="item.label"
        :to="getRoute(item.id)"
        :active="store.activeMenuItem === item.id"
        :collapsed="store.sidenavCollapsed"
      />
      <template v-if="activeApps.length > 0">
        <div style="height: 1px; background: var(--border-color); margin: 0.5em 0.667em;"></div>
        <KitSidebarItem
          v-for="app in activeApps"
          :key="app.id"
          :icon="app.icon"
          :label="app.label"
          :active="app.isActive"
          :collapsed="store.sidenavCollapsed"
          @click="app.onClick"
        />
      </template>
      <template #footer>
        <KitSidebarFooter>
          <KitMenu direction="up">
            <template #trigger>
              <KitSidebarItem icon="user" label="Profile" :collapsed="store.sidenavCollapsed" />
            </template>
            <template #menu="{ close }">
              <div class="kit-menu-header">username@foobar.com</div>
              <div class="kit-menu-separator"></div>
              <KitMenuItem icon="settings" to="/settings" @click="close">
                <span>Settings</span>
              </KitMenuItem>
              <KitMenuItem icon="globe">
                <span>Language</span>
              </KitMenuItem>
              <KitMenuItem icon="help">
                <span>Get help</span>
              </KitMenuItem>
              <div class="kit-menu-separator"></div>
              <KitMenuItem icon="book">
                <span>Learn more</span>
              </KitMenuItem>
              <div class="kit-menu-separator"></div>
              <KitMenuItem icon="logout" variant="danger">
                <span>Log out</span>
              </KitMenuItem>
            </template>
          </KitMenu>
        </KitSidebarFooter>
      </template>
    </KitSidebar>
  `,
  setup() {
    useStyles('dock', styles);

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
