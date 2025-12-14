import { store, actions } from '../store.js';

const titles = {
  yap: 'Yap',
  deployments: 'Deployments',
  data: 'Data',
  stream: 'Stream',
  code: 'Code',
  publish: 'Publish',
  simulate: 'Simulate',
  agents: 'Agents',
  settings: 'Settings',
};

export const TitleBar = {
  props: {
    type: { type: String, required: true },
  },
  template: `
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
  `,
  setup(props) {
    const title = Vue.computed(() => titles[props.type] || 'Window');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    let containerHeight = 0;
    const titleBarHeight = 28; // Same height as menu bar

    const startDrag = (e) => {
      if (e.target.closest('.title-bar-close')) return;

      // Get container height for constraining
      const homeView = e.target.closest('.home-view');
      containerHeight = homeView ? homeView.offsetHeight : window.innerHeight;

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
      actions.moveWindow(props.type, initialX + deltaX, initialY + deltaY, maxY);
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
