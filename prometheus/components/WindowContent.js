import { store } from '../store.js';

const content = {
  applications: {
    title: 'Applications',
    text: 'Browse and manage your installed applications.',
  },
  yap: {
    title: 'Yap',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  deployments: {
    title: 'Deployments',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  data: {
    title: 'Data',
    text: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
  },
  stream: {
    title: 'Stream',
    text: 'Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor ultrices ligula neque pretium.',
  },
  code: {
    title: 'Code',
    text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci posuere cubilia curae.',
  },
  publish: {
    title: 'Publish',
    text: 'Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit.',
  },
  simulate: {
    title: 'Simulate',
    text: 'Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus donec consectetuer.',
  },
  agents: {
    title: 'Agents',
    text: 'Morbi luctus, wisi viverra faucibus pretium, nibh est placerat odio, nec commodo wisi enim eget quam. Quisque libero justo, consectetuer a feugiat vitae nisl.',
  },
  settings: {
    title: 'Settings',
    text: 'Configure your preferences and account settings here.',
  },
};

export const WindowContent = {
  props: {
    type: { type: String, default: null },
  },
  template: `
    <div class="window-content">
      <div class="window-content-inner">
        <h1 class="window-content-title">{{ currentContent.title }}</h1>
        <p class="window-content-text">{{ currentContent.text }}</p>
      </div>
    </div>
  `,
  setup(props) {
    const currentContent = Vue.computed(() => {
      const key = props.type || store.activeMenuItem;
      return content[key] || { title: 'Unknown', text: '' };
    });
    return { store, currentContent };
  },
};
