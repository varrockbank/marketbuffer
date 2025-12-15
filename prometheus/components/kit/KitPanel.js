import { KitBar } from './KitBar.js';
import { KitButton } from './KitButton.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-panel {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
`;

export const KitPanel = {
  components: { KitBar, KitButton },
  props: {
    title: { type: String, default: 'Window' },
  },
  emits: ['close', 'dragstart', 'drag', 'dragend'],
  template: `
    <div class="kit-panel">
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
  setup() {
    useStyles('kit-panel', styles);
  },
};
