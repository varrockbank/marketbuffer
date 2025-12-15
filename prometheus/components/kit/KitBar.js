import { useStyles } from '../../lib/useStyles.js';

/**
 * KitBar - Horizontal bar with left and right slots.
 *
 * Props:
 *   draggable - Enables drag events for window title bars
 *   variant   - "default" | "title" - Changes visual style
 *
 * Slots:
 *   #left    - Left side content (title, brand, etc.)
 *   default  - Right side content (buttons, menus, etc.)
 *
 * Events:
 *   dragstart, drag, dragend - Emitted when draggable is true
 */

const styles = `
.kit-bar {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.kit-bar-draggable {
  cursor: grab;
}

.kit-bar-draggable:active {
  cursor: grabbing;
}

.kit-bar-left,
.kit-bar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Title bar variant - for window panels */
.kit-bar-title {
  padding: 0 0 0 8px;
  background: #000;
  border-bottom: 1px solid var(--border-color);
  user-select: none;
}

.kit-bar-title .kit-bar-left {
  font-weight: 600;
  font-size: 12px;
  color: #fff;
}

.kit-bar-title .kit-bar-right {
  color: rgba(255, 255, 255, 0.6);
}

.distraction-free .kit-bar-title {
  background: var(--bg-primary);
}

.distraction-free .kit-bar-title .kit-bar-left {
  color: var(--text-primary);
}

.distraction-free .kit-bar-title .kit-bar-right {
  color: var(--text-secondary);
}
`;

export const KitBar = {
  props: {
    draggable: { type: Boolean, default: false },
    variant: { type: String, default: 'default' },
  },
  emits: ['dragstart', 'drag', 'dragend'],
  template: `
    <div
      class="kit-bar"
      :class="[{ 'kit-bar-draggable': draggable }, variant !== 'default' ? 'kit-bar-' + variant : '']"
      @mousedown="onMouseDown"
    >
      <div class="kit-bar-left">
        <slot name="left"></slot>
      </div>
      <div class="kit-bar-right">
        <slot></slot>
      </div>
    </div>
  `,
  setup(props, { emit }) {
    useStyles('kit-bar', styles);
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e) => {
      if (!props.draggable) return;
      if (e.target.closest('button, a, .kit-bar-no-drag')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      emit('dragstart', { x: startX, y: startY });

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      emit('drag', { deltaX, deltaY, clientX: e.clientX, clientY: e.clientY });
    };

    const stopDrag = () => {
      isDragging = false;
      emit('dragend');
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    return { onMouseDown };
  },
};
