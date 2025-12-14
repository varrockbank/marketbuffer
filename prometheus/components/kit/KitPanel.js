import { useStyles } from '../../useStyles.js';
import { KitBar } from './KitBar.js';
import { KitIcon } from './KitIcon.js';

// TODO(claude): this should be pushed odwn into KitPanel and we have a prop determining what type of Titlebar.
// TODO(claude): for top-type bar, distraction-free should be a prop on 
const styles = `
.title-bar {
  padding: 0 0 0 8px;
  background: #000;
  border-bottom: 1px solid var(--border-color);
  user-select: none;
}

.title-bar .kit-bar-left {
  font-weight: 600;
  font-size: 12px;
  color: #fff;
}

.title-bar-close {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-bar-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.title-bar-close svg {
  width: 14px;
  height: 14px;
}

.distraction-free .title-bar {
  background: var(--bg-primary);
}

.distraction-free .title-bar .kit-bar-left {
  color: var(--text-primary);
}

.distraction-free .title-bar-close {
  color: var(--text-secondary);
}

.distraction-free .title-bar-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
`;

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
  setup() {
    useStyles('kit-panel', styles)
  },
};
