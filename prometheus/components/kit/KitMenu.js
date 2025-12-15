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

.kit-menu.kit-menu-align-right {
  width: auto;
}

.kit-menu.kit-menu-align-right .kit-menu-dropdown {
  left: auto;
  right: 0;
  min-width: 220px;
}

.kit-menu-trigger {
  cursor: pointer;
  width: 100%;
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
`;

export const KitMenu = {
  props: {
    direction: { type: String, default: 'down' }, // 'up', 'down', or 'right'
    trigger: { type: String, default: 'click' }, // 'click' or 'hover'
    compact: { type: Boolean, default: false }, // removes wrapper padding
    align: { type: String, default: 'left' }, // 'left' or 'right'
  },
  template: `
    <div
      class="kit-menu"
      :class="{ 'kit-menu-compact': compact, 'kit-menu-align-right': align === 'right' }"
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
