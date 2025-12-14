import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.menu-bar-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.menu-bar-btn:hover {
  background: #000;
  color: #fff;
}

.menu-bar-btn.active {
  color: var(--accent);
}

.menu-bar-btn svg {
  width: 16px;
  height: 16px;
}

.menu-bar-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  color: var(--text-primary);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease-out;
  z-index: 100;
}

.menu-bar-btn.tooltip-right::after {
  left: auto;
  right: 0;
  transform: none;
}

.menu-bar-btn:hover::after {
  opacity: 1;
}
`;
export const KitBarButton = {
  components: { KitIcon },
  props: ['icon', 'title', 'active'],
  emits: ['click'],
  template: `
    <button
      ref="btn"
      class="menu-bar-btn"
      :class="{ 'tooltip-right': alignRight, 'active': active }"
      :data-tooltip="title"
      @click="$emit('click')"
      @mouseenter="checkPosition"
    >
      <KitIcon :icon="icon" />
    </button>
  `,
  setup() {
    useStyles('kit-bar-button', styles);
    const btn = Vue.ref(null);
    const alignRight = Vue.ref(false);

    const checkPosition = () => {
      if (btn.value) {
        const rect = btn.value.getBoundingClientRect();
        const buttonCenter = rect.left + rect.width / 2;
        const spaceRight = window.innerWidth - buttonCenter;
        alignRight.value = spaceRight < 80;
      }
    };

    return { btn, alignRight, checkPosition };
  },
};
