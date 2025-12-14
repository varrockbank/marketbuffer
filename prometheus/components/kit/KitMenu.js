import { useStyles } from '../../useStyles.js';

const styles = `
.dropdown-menu-trigger {
  cursor: pointer;
  width: 100%;
}

.dropdown-menu-teleported {
  min-width: 220px;
  z-index: 1000;
}

.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  text-decoration: none;
}

.dropdown-menu-item:hover {
  background: #000;
  color: #fff;
}

.dropdown-menu-item.active {
  color: var(--text-primary);
}

.dropdown-menu-item.active:hover {
  color: #fff;
}

.dropdown-menu-item svg {
  width: 16px;
  height: 16px;
}

.dropdown-menu-separator {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.dropdown-menu-header {
  padding: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.dropdown-menu-item.danger {
  color: #e55;
}

.dropdown-menu-item.danger:hover {
  background: rgba(238, 85, 85, 0.1);
  color: #e55;
}

.dropdown-menu-item.success {
  color: rgb(131, 193, 141);
}

.dropdown-menu-item.success:hover {
  background: rgba(131, 193, 141, 0.1);
  color: rgb(131, 193, 141);
}
`;

export const KitMenu = {
  props: {
    direction: { type: String, default: 'down' }, // 'up', 'down', or 'right'
    trigger: { type: String, default: 'click' }, // 'click' or 'hover'
  },
  template: `
    <div
      class="dropdown-menu-wrapper"
      @mouseenter="trigger === 'hover' && (open = true)"
      @mouseleave="trigger === 'hover' && (open = false)"
    >
      <div class="dropdown-menu-trigger" @click="trigger === 'click' && (open = !open)">
        <slot name="trigger"></slot>
      </div>
      <div
        v-if="open"
        class="dropdown-menu"
        :class="'dropdown-menu-' + direction"
      >
        <slot name="menu" :close="close"></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-menu', styles);

    const open = Vue.ref(false);

    const close = () => {
      open.value = false;
    };

    return { open, close };
  },
};
