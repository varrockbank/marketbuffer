import { KitBar } from './KitBar.js';
import { KitButton } from './KitButton.js';

export const KitPanel = {
  components: { KitBar, KitButton },
  props: {
    title: { type: String, default: 'Window' },
  },
  emits: ['close', 'dragstart', 'drag', 'dragend'],
  template: `
    <div class="flex flex-col rounded-md overflow-hidden border border-[var(--border-color)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <KitBar
        draggable
        @dragstart="$emit('dragstart', $event)"
        @drag="$emit('drag', $event)"
        @dragend="$emit('dragend')"
      >
        <template #left>{{ title }}</template>
        <KitButton icon="x" size="sm" variant="inherit" @click.stop="$emit('close')" />
      </KitBar>
      <slot></slot>
    </div>
  `,
};
