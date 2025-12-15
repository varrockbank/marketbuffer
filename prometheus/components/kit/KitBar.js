import { useStyles } from '../../lib/useStyles.js';

/**
 * KitBar - Horizontal bar with left and right slots.
 *
 * Props:
 *   draggable - Enables drag events for window title bars
 *
 * Slots:
 *   #left    - Left side content (title, brand, etc.)
 *   default  - Right side content (buttons, menus, etc.)
 *
 * Events:
 *   dragstart, drag, dragend - Emitted when draggable is true
 */

// Keep CSS for .no-contrast and .distraction-free parent selectors
const styles = `
.no-contrast .kit-bar,
.distraction-free .kit-bar {
  background: var(--bg-primary);
  border-bottom-color: transparent;
}
`;

export const KitBar = {
  props: {
    draggable: { type: Boolean, default: false },
  },
  emits: ['dragstart', 'drag', 'dragend'],
  template: `
    <div
      class="kit-bar h-7 flex items-center justify-between shrink-0 pl-3 pr-0.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] text-[var(--text-primary)]"
      :class="{ 'cursor-grab active:cursor-grabbing': draggable }"
      @mousedown="onMouseDown"
    >
      <div class="flex items-center gap-1">
        <slot name="left"></slot>
      </div>
      <div class="flex items-center gap-0.5">
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
