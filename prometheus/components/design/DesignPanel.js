import { DesignIcon } from './DesignIcon.js';

export const DesignPanel = {
  components: { DesignIcon },
  props: {
    title: { type: String, default: 'Window' },
  },
  emits: ['close', 'dragstart', 'drag', 'dragend'],
  template: `
    <div class="window">
      <div
        class="title-bar"
        @mousedown="startDrag"
      >
        <span class="title-bar-text">{{ title }}</span>
        <button class="title-bar-close" @click.stop="$emit('close')">
          <DesignIcon icon="x" :size="16" />
        </button>
      </div>
      <slot></slot>
    </div>
  `,
  setup(props, { emit }) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const startDrag = (e) => {
      if (e.target.closest('.title-bar-close')) return;

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

    return { startDrag };
  },
};
