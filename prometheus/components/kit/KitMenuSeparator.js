import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-menu-separator {
  background: var(--border-color);
}
`;

export const KitMenuSeparator = {
  template: `<div class="kit-menu-separator h-px my-1"></div>`,
  setup() {
    useStyles('kit-menu-separator', styles);
  },
};
