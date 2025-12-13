import { store, actions } from '../store.js';

export const Terminal = {
  template: `
    <div class="terminal" :class="{ expanded: store.terminalExpanded }">
      <div class="terminal-header" @click="actions.toggleTerminal">
        <span>Terminal</span>
      </div>
      <div class="terminal-content">
        <div style="color: var(--text-secondary);">$ ready</div>
      </div>
    </div>
  `,
  setup() {
    return { store, actions };
  },
};
