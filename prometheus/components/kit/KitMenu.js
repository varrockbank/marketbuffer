import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-menu-dropdown {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
}
`;

export const KitMenu = {
  props: {
    direction: { type: String, default: 'down' },
    trigger: { type: String, default: 'click' },
    compact: { type: Boolean, default: false },
    align: { type: String, default: 'left' },
  },
  template: `
    <div
      class="kit-menu relative"
      :class="{ 'px-2 py-1 w-full': !compact, 'p-0 w-auto': compact, 'w-auto': align === 'right' }"
      @mouseenter="trigger === 'hover' && (open = true)"
      @mouseleave="trigger === 'hover' && (open = false)"
    >
      <div class="cursor-pointer" :class="{ 'w-full': !compact }" @click="trigger === 'click' && (open = !open)">
        <slot name="trigger"></slot>
      </div>
      <div
        v-if="open"
        class="kit-menu-dropdown absolute rounded-md p-1 z-[100]"
        :class="[
          directionClass,
          compact ? 'left-0 right-0' : 'left-1.5 right-1.5',
          align === 'right' ? 'left-auto right-0 min-w-[220px]' : ''
        ]"
      >
        <slot name="menu" :close="close"></slot>
      </div>
    </div>
  `,
  setup(props) {
    useStyles('kit-menu', styles);

    const open = Vue.ref(false);

    const close = () => {
      open.value = false;
    };

    const directionClass = Vue.computed(() => {
      if (props.direction === 'up') return 'bottom-full mb-2 min-w-[200px]';
      if (props.direction === 'right') return 'left-full top-0 ml-1.5 min-w-[200px]';
      return 'top-full mt-2';
    });

    return { open, close, directionClass };
  },
};
