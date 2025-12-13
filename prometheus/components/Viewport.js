import { store } from '../store.js';

export const Viewport = {
  template: `
    <div class="viewport">
      <div style="padding: 12px; color: var(--text-secondary);">Viewport</div>
    </div>
  `,
  setup() {
    return { store };
  },
};
