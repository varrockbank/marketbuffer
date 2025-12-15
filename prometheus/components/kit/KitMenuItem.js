import { KitButton } from './KitButton.js';

/**
 * KitMenuItem - Menu item that wraps KitButton with menu-specific behavior.
 * Handles selected state (shows checkmark) and selectable alignment.
 */
export const KitMenuItem = {
  components: { KitButton },
  props: {
    icon: { type: String, default: null },
    selected: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    variant: { type: String, default: 'menu' }, // menu, success, danger
    to: { type: String, default: null },
  },
  emits: ['click'],
  computed: {
    effectiveIcon() {
      if (this.selected) return 'check';
      if (this.icon) return this.icon;
      return null;
    },
    effectiveVariant() {
      if (this.variant === 'menu' || this.variant === 'default') return 'menu';
      return this.variant;
    },
  },
  template: `
    <KitButton
      :icon="effectiveIcon"
      :to="to"
      :variant="effectiveVariant"
      :active="selected"
      @click="$emit('click', $event)"
    >
      <span v-if="!effectiveIcon && selectable" style="width: 16px; height: 16px; flex-shrink: 0;"></span>
      <slot></slot>
    </KitButton>
  `,
};
