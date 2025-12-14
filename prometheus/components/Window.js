import { store, actions } from '../store.js';
import { DesignPanel } from './design/DesignPanel.js';
import { AppViewport } from './AppViewport.js';

export const Window = {
  components: { DesignPanel, AppViewport },
  props: {
    type: { type: String, required: true },
    title: { type: String, default: 'Window' },
  },
  template: `
    <DesignPanel
      :title="title"
      @close="close"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd"
    >
      <AppViewport :type="type" />
    </DesignPanel>
  `,
  setup(props) {
    let initialX = 0;
    let initialY = 0;
    let containerHeight = 0;
    let containerWidth = 0;
    const titleBarHeight = 28;

    const onDragStart = (e) => {
      const windowEl = document.querySelector('.window');
      const homeView = windowEl?.closest('.home-view');
      containerHeight = homeView ? homeView.offsetHeight : window.innerHeight;
      containerWidth = homeView ? homeView.offsetWidth : window.innerWidth;

      actions.bringToFront(props.type);
      store.isDraggingWindow = true;

      const pos = store.windowPositions[props.type];
      initialX = pos?.x || 0;
      initialY = pos?.y || 0;
    };

    const onDrag = ({ deltaX, deltaY }) => {
      const maxY = containerHeight - titleBarHeight;
      const maxX = containerWidth - store.defaultWindowWidth;
      actions.moveWindow(props.type, initialX + deltaX, initialY + deltaY, maxY, maxX);
    };

    const onDragEnd = () => {
      store.isDraggingWindow = false;
    };

    const close = () => {
      actions.closeWindow(props.type);
    };

    return { close, onDragStart, onDrag, onDragEnd };
  },
};
