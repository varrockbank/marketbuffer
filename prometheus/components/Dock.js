import { store, actions, menuItems, type2Apps, type2AppIds, type3Apps } from '../store.js';
import { useStyles } from '../useStyles.js';
import { KitSidebar } from './kit/KitSidebar.js';
import { KitSidebarItem } from './kit/KitSidebarItem.js';
import { KitSidebarFooter } from './kit/KitSidebarFooter.js';
import { KitMenu } from './kit/KitMenu.js';
import { KitMenuItem } from './kit/KitMenuItem.js';

const styles = `
/* Sidenav - Dock styling */
.sidenav {
  width: 200px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: width 0.2s ease-out;
}

.sidenav.collapsed {
  width: 48px;
  overflow: visible;
}

.sidenav.collapsed .kit-sidebar-content {
  overflow: visible;
}

.sidenav > .kit-sidebar-content {
  padding: 0.5em;
}

.sidenav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  aspect-ratio: 1;
}

.sidenav-label {
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s ease-out;
}

.sidenav.collapsed .sidenav-label {
  opacity: 0;
  width: 0;
}

.sidenav-separator {
  height: 1px;
  background: var(--border-color);
  margin: 0.5em 0.667em;
}

.sidenav.collapsed .sidenav-item {
  position: relative;
}

.sidenav.collapsed .sidenav-item::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease-out;
  z-index: 100;
}

.sidenav.collapsed .sidenav-item:hover::after {
  opacity: 1;
}
`;

export const Dock = {
  components: { KitSidebar, KitSidebarItem, KitSidebarFooter, KitMenu, KitMenuItem },
  template: `
    <KitSidebar class="sidenav" :collapsed="store.sidenavCollapsed">
      <KitSidebarItem
        v-for="item in menuItems"
        :key="item.id"
        :icon="item.icon"
        :label="item.label"
        :to="getRoute(item.id)"
        :active="store.activeMenuItem === item.id"
      />
      <template v-if="activeApps.length > 0">
        <div class="sidenav-separator"></div>
        <KitSidebarItem
          v-for="app in activeApps"
          :key="app.id"
          :icon="app.icon"
          :label="app.label"
          :active="app.isActive"
          @click="app.onClick"
        />
      </template>
      <template #footer>
        <KitSidebarFooter>
          <KitMenu direction="up">
            <template #trigger>
              <KitSidebarItem icon="user" label="Profile" />
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
