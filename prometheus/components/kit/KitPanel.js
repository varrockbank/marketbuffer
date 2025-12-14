import { KitBar } from './KitBar.js';
import { KitIcon } from './KitIcon.js';

export const KitPanel = {
  components: { KitBar, KitIcon },
  props: {
    title: { type: String, default: 'Window' },
  },
  emits: ['close', 'dragstart', 'drag', 'dragend'],
  template: `
    <div class="window">
      <KitBar
        class="title-bar"
        draggable
        @dragstart="$emit('dragstart', $event)"
        @drag="$emit('drag', $event)"
        @dragend="$emit('dragend')"
      >
        <template #left>{{ title }}</template>
        <button class="title-bar-close" @click.stop="$emit('close')">
          <KitIcon icon="x" :size="16" />
        </button>
      </KitBar>
      <slot></slot>
    </div>
  `,
};
