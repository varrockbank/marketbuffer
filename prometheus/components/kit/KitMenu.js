import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-menu {
  position: relative;
  padding: 0.5em;
  width: 100%;
}

.kit-menu.kit-menu-compact {
  padding: 0;
}

.kit-menu.kit-menu-compact .kit-menu-dropdown {
  left: 0;
  right: 0;
}

.kit-menu-trigger {
  cursor: pointer;
  width: 100%;
}

/* Selector-style trigger (for project selectors, profile menus, etc.) */
.kit-menu-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-primary);
  width: 100%;
}

.kit-menu-selector:hover {
  background: var(--bg-tertiary);
}

.kit-menu-selector-label {
  font-weight: 500;
}

.kit-menu-selector-chevron {
  color: var(--text-secondary);
  margin-left: auto;
}

.kit-menu-dropdown {
  position: absolute;
  left: 0.5em;
  right: 0.5em;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 4px;
  z-index: 100;
}

.kit-menu-down {
  top: 100%;
  margin-top: 8px;
}

.kit-menu-up {
  bottom: 100%;
  margin-bottom: 8px;
}

.kit-menu-right {
  left: 100%;
  right: auto;
  top: 0;
  margin-left: 6px;
  min-width: 200px;
}

.kit-menu-teleported {
  min-width: 220px;
  z-index: 1000;
}

.kit-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  text-decoration: none;
}

.kit-menu-item:hover {
  background: #000;
  color: #fff;
}

.kit-menu-item.active {
  color: var(--text-primary);
}

.kit-menu-item.active:hover {
  color: #fff;
}

.kit-menu-separator {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.kit-menu-header {
  padding: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.kit-menu-item.danger {
  color: #e55;
}

.kit-menu-item.danger:hover {
  background: rgba(238, 85, 85, 0.1);
  color: #e55;
}

.kit-menu-item.success {
  color: rgb(131, 193, 141);
}

.kit-menu-item.success:hover {
  background: rgba(131, 193, 141, 0.1);
  color: rgb(131, 193, 141);
}
`;

export const KitMenu = {
  props: {
    direction: { type: String, default: 'down' }, // 'up', 'down', or 'right'
    trigger: { type: String, default: 'click' }, // 'click' or 'hover'
    compact: { type: Boolean, default: false }, // removes wrapper padding
  },
  template: `
    <div
      class="kit-menu"
      :class="{ 'kit-menu-compact': compact }"
      @mouseenter="trigger === 'hover' && (open = true)"
      @mouseleave="trigger === 'hover' && (open = false)"
    >
      <div class="kit-menu-trigger" @click="trigger === 'click' && (open = !open)">
        <slot name="trigger"></slot>
      </div>
      <div
        v-if="open"
        class="kit-menu-dropdown"
        :class="'kit-menu-' + direction"
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
