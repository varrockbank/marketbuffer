import { useStyles } from '../../useStyles.js';

const styles = `
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.667em;
  padding: 0.667em;
  border-radius: 0.5em;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s ease-out;
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
}

.nav-item:hover {
  background: #000;
  color: var(--text-primary);
}

.theme-light .nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* When inside a footer, center the buttons */
.kit-sidebar-footer .nav-item {
  flex: 1;
  justify-content: center;
}
`;

export const KitButton = {
  template: `
    <button class="nav-item">
      <slot></slot>
    </button>
  `,
  setup() {
    useStyles('kit-button', styles);
  },
};
