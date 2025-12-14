import { store, actions } from '../store.js';
import { DesignDropdownMenu } from './design/DesignDropdownMenu.js';
import { DesignMenuItem } from './design/DesignMenuItem.js';
import { DesignIcon } from './design/DesignIcon.js';

export const SidenavItem = {
  components: { DesignDropdownMenu, DesignMenuItem, DesignIcon },
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    icon: { type: String, required: true },
    submenu: { type: Array, default: null },
    to: { type: String, default: null },
    active: { type: Boolean, default: null },
  },
  emits: ['click'],
  template: `
    <div class="sidenav-item-container">
      <DesignDropdownMenu v-if="submenu" direction="right" trigger="click">
        <template #trigger>
          <div
            class="sidenav-item"
            :class="{ active: isActive }"
            :data-tooltip="label"
          >
            <DesignIcon :icon="icon" class="sidenav-icon" />
            <span class="sidenav-label">{{ label }}</span>
          </div>
        </template>
        <template #menu="{ close }">
          <DesignMenuItem
            v-for="item in submenu"
            :key="item.id"
            :icon="item.icon"
            :selected="store.openWindows.includes(item.id)"
            selectable
            @click="launchApp(item.id, close)"
          >
            <span>{{ item.label }}</span>
          </DesignMenuItem>
          <div class="dropdown-menu-separator"></div>
          <DesignMenuItem icon="plus" variant="success" to="/applications" @click="close">
            <span>Add more</span>
          </DesignMenuItem>
        </template>
      </DesignDropdownMenu>
      <component
        v-else
        :is="to || active === null ? 'router-link' : 'div'"
        :to="to || getRoute()"
        class="sidenav-item"
        :class="{ active: isActive }"
        :data-tooltip="label"
        @click="$emit('click', $event)"
      >
        <DesignIcon :icon="icon" class="sidenav-icon" />
        <span class="sidenav-label">{{ label }}</span>
      </component>
    </div>
  `,
  setup(props) {
    const router = VueRouter.useRouter();

    const isActive = Vue.computed(() => {
      if (props.active !== null) return props.active;
      return store.activeMenuItem === props.id;
    });

    const getRoute = () => {
      if (props.to) return props.to;
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

    return { store, isActive, getRoute, launchApp };
  },
};
