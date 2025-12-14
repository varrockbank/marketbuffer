import { store, actions } from '../store.js';
import { DesignDropdownMenu } from './design/DesignDropdownMenu.js';

export const SidenavItem = {
  components: { DesignDropdownMenu },
  props: ['id', 'label', 'icon', 'submenu'],
  template: `
    <div class="sidenav-item-container">
      <DesignDropdownMenu v-if="submenu" direction="right" trigger="click">
        <template #trigger>
          <div
            class="sidenav-item"
            :class="{ active: store.activeMenuItem === id }"
            :data-tooltip="label"
          >
            <svg class="sidenav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icon"></svg>
            <span class="sidenav-label">{{ label }}</span>
          </div>
        </template>
        <template #menu="{ close }">
          <div
            v-for="item in submenu"
            :key="item.id"
            class="dropdown-menu-item"
            :class="{ active: store.openWindows.includes(item.id) }"
            @click="launchApp(item.id, close)"
          >
            <svg v-if="store.openWindows.includes(item.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.icon"></svg>
            <span>{{ item.label }}</span>
          </div>
          <div class="dropdown-menu-separator"></div>
          <router-link to="/applications" class="dropdown-menu-item success" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            <span>Add more</span>
          </router-link>
        </template>
      </DesignDropdownMenu>
      <router-link
        v-else
        :to="getRoute()"
        class="sidenav-item"
        :class="{ active: store.activeMenuItem === id }"
        :data-tooltip="label"
      >
        <svg class="sidenav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icon"></svg>
        <span class="sidenav-label">{{ label }}</span>
      </router-link>
    </div>
  `,
  setup(props) {
    const router = VueRouter.useRouter();

    const getRoute = () => {
      if (props.id === 'code') {
        return '/code/' + store.currentProject;
      }
      return '/' + props.id;
    };

    const launchApp = (appId, close) => {
      actions.openWindow(appId);
      router.push('/');
      close();
    };

    return { store, getRoute, launchApp };
  },
};
