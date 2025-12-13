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
};

export const TitleBar = {
  props: {
    type: { type: String, required: true },
  },
  template: `
    <div class="title-bar">
      <span class="title-bar-text">{{ title }}</span>
      <button class="title-bar-close" @click="close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  `,
  setup(props) {
    const title = Vue.computed(() => titles[props.type] || 'Window');

    const close = () => {
      actions.closeWindow(props.type);
    };

    return { title, close };
  },
};
