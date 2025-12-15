import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-terminal {
  padding: 8px 12px;
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
}
`;

export const KitTerminal = {
  template: `
    <div class="kit-terminal">
      <div>$ ready</div>
    </div>
  `,
  setup() {
    useStyles('kit-terminal', styles);
  },
};
