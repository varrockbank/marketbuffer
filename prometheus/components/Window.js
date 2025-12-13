import { store } from '../store.js';
import { TitleBar } from './TitleBar.js';
import { WindowViewport } from './WindowViewport.js';

export const Window = {
  components: { TitleBar, WindowViewport },
  props: {
    type: { type: String, required: true },
  },
  template: `
    <div class="window">
      <TitleBar :type="type" />
      <WindowViewport :type="type" />
    </div>
  `,
  setup(props) {
    return { store };
  },
};
