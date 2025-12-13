import { store } from '../store.js';

export const Brand = {
  template: `
    <div class="brand">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="brand-icon">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      </svg>
      <span class="brand-name">Marketbuffer</span>
      <span class="brand-version">v{{ store.version }}</span>
    </div>
  `,
  setup() {
    return { store };
  },
};
