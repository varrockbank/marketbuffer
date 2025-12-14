import { store, actions } from '../../store.js';
import { useStyles } from '../../useStyles.js';
import { KitDrawer } from './KitDrawer.js';

const styles = `
.kit-terminal {
  padding: 8px 12px;
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
}
`;

export const KitTerminal = {
  components: { KitDrawer },
  template: `
    <KitDrawer title="Terminal" :expanded="store.terminalExpanded" @toggle="actions.toggleTerminal">
      <div class="kit-terminal">
        <div>$ ready</div>
      </div>
    </KitDrawer>
  `,
  setup() {
    useStyles('kit-terminal', styles);

    return { store, actions };
  },
};
