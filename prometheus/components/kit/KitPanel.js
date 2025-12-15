import { KitBar } from './KitBar.js';
import { KitButton } from './KitButton.js';

export const KitPanel = {
  components: { KitBar, KitButton },
  props: {
    title: { type: String, default: 'Window' },
  },
  emits: ['close', 'dragstart', 'drag', 'dragend'],
  template: `
    <div class="window">
      <KitBar
        variant="title"
        draggable
        @dragstart="$emit('dragstart', $event)"
        @drag="$emit('drag', $event)"
        @dragend="$emit('dragend')"
      >
        <template #left>{{ title }}</template>
        <KitButton icon="x" size="xs" variant="inherit" @click.stop="$emit('close')" />
      </KitBar>
      <slot></slot>
    </div>
  `,
};
