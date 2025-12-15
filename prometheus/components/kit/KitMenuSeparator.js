import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-menu-separator {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}
`;

export const KitMenuSeparator = {
  template: `<div class="kit-menu-separator"></div>`,
  setup() {
    useStyles('kit-menu-separator', styles);
  },
};
