import { KitIcon } from './KitIcon.js';


export const KitMenuItem = {
  components: { KitIcon },
  props: {
    icon: { type: String, default: null },
    selected: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false }, // Reserve icon space for alignment in selectable lists
    variant: { type: String, default: 'default' }, // default, success, danger
    to: { type: String, default: null },
  },
  emits: ['click'],
  template: `
    <component
      :is="to ? 'router-link' : 'div'"
      :to="to"
      class="kit-menu-item"
      :class="[variant !== 'default' ? variant : '', { active: selected }]"
      @click="$emit('click', $event)"
    >
      <KitIcon v-if="selected" icon="check" :size="16" />
      <KitIcon v-else-if="icon" :icon="icon" :size="16" />
      <span v-else-if="selectable" style="width: 16px; height: 16px; flex-shrink: 0;"></span>
      <slot></slot>
    </component>
  `,
};
