import { store, actions } from '../store.js';
import { WindowViewport } from './WindowViewport.js';

const titles = {
  simulator: 'Perfect Liquidity Simulator',
  wallpaper: 'Desktop Wallpaper',
};

export const Window = {
  components: { WindowViewport },
  props: {
    type: { type: String, required: true },
  },
  template: `
    <div class="window">
      <div
        class="title-bar"
        @mousedown="startDrag"
      >
        <span class="title-bar-text">{{ title }}</span>
        <button class="title-bar-close" @click.stop="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      <WindowViewport :type="type" />
    </div>
  `,
  setup(props) {
    const title = Vue.computed(() => titles[props.type] || 'Window');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    let containerHeight = 0;
    let containerWidth = 0;
    const titleBarHeight = 28;

    const startDrag = (e) => {
      if (e.target.closest('.title-bar-close')) return;

      const homeView = e.target.closest('.home-view');
      containerHeight = homeView ? homeView.offsetHeight : window.innerHeight;
      containerWidth = homeView ? homeView.offsetWidth : window.innerWidth;

      actions.bringToFront(props.type);
      isDragging = true;
      store.isDraggingWindow = true;
      startX = e.clientX;
      startY = e.clientY;
      const pos = store.windowPositions[props.type];
      initialX = pos?.x || 0;
      initialY = pos?.y || 0;

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const maxY = containerHeight - titleBarHeight;
      const maxX = containerWidth - store.defaultWindowWidth;
      actions.moveWindow(props.type, initialX + deltaX, initialY + deltaY, maxY, maxX);
    };

    const stopDrag = () => {
      isDragging = false;
      store.isDraggingWindow = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    const close = () => {
      actions.closeWindow(props.type);
    };

    return { title, close, startDrag };
  },
};
