import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-terminal {
  color: var(--text-secondary);
}
`;

export const KitTerminal = {
  template: `
    <div class="kit-terminal py-2 px-3 font-mono text-xs">
      <div>$ ready</div>
    </div>
  `,
  setup() {
    useStyles('kit-terminal', styles);
  },
};
