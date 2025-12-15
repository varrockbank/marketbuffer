import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-vbuf-sidenav {
  background: var(--tui-bg);
  color: var(--tui-fg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 25ch;
  padding: 4px;
  border-right: 1px solid var(--tui-fg);
}
.kit-tui-vbuf-sidenav.borderless {
  border-right: none;
}

.kit-tui-vbuf-sidenav .wb {
  background-color: transparent;
  color: var(--tui-fg);
  position: relative;
  outline: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 16px;
  flex: 1;
  margin: 0;
  border: 1px solid transparent;
  width: 100%;
}
.kit-tui-vbuf-sidenav .wb:focus {
  border-color: #666;
}
.kit-tui-vbuf-sidenav .no-select { user-select: none; }
.kit-tui-vbuf-sidenav .wb-clipboard-bridge {
  position: fixed; left: 0; top: 1px;
  width: 0; height: 1px; opacity: 0; pointer-events: none;
}
.kit-tui-vbuf-sidenav .wb .wb-lines { margin: 0 !important; padding: 0 !important; }
.kit-tui-vbuf-sidenav .wb .wb-lines > pre::before { content: "\\200B"; }
.kit-tui-vbuf-sidenav .wb .wb-lines pre { margin: 0; white-space: pre; }
.kit-tui-vbuf-sidenav .wb .wb-selection {
  background-color: #0abab5;
  position: absolute;
}
.kit-tui-vbuf-sidenav .wb .wb-status { display: none; padding: 0 !important; height: 0 !important; margin: 0 !important; }
`;

export const KitTUIVbufSidenav = {
  props: {
    items: { type: Array, default: () => [] },
    activeId: { type: String, default: '' },
    borderless: { type: Boolean, default: false },
  },
  emits: ['select'],
  template: `
    <div class="kit-tui-vbuf-sidenav" :class="{ borderless }">
      <blockquote class="wb no-select" tabindex="0" ref="editorEl">
        <textarea class="wb-clipboard-bridge" aria-hidden="true"></textarea>
        <div style="display: flex;">
          <div class="wb-gutter"></div>
          <div class="wb-lines"></div>
        </div>
        <div class="wb-status">
          <div class="wb-status-left"><span class="wb-linecount"></span></div>
          <div class="wb-status-right">
            <span class="wb-coordinate"></span>
            <span class="wb-indentation"></span>
          </div>
        </div>
      </blockquote>
    </div>
  `,
  setup(props, { emit }) {
    useStyles('kit-tui-vbuf-sidenav', styles);

    const editorEl = Vue.ref(null);
    const editorInstance = Vue.shallowRef(null);

    const buildMenu = (editor, items, activeId) => {
      if (!editor) return;

      // Create empty lines for the viewport
      const totalRows = items.length + 2; // items + user + spacing
      const lines = Array(totalRows).fill('');
      editor.Model.text = lines.join('\n');

      // Clear old TUI elements
      editor.TUI.clear();

      // Add TUI elements for each menu item
      items.forEach((item, index) => {
        const isActive = item.id === activeId;
        const indicator = isActive ? '>' : ' ';

        editor.TUI.addElement({
          row: index,
          col: 0,
          content: `${indicator} ${item.label}`,
          onActivate: () => {
            emit('select', item.id);
          },
        });
      });

      // Add User button
      const userRow = items.length + 1;
      const isUserActive = activeId === 'settings';
      const userIndicator = isUserActive ? '>' : ' ';
      editor.TUI.addElement({
        row: userRow,
        col: 0,
        content: `${userIndicator} [U] User`,
        onActivate: () => {
          emit('select', 'settings');
        },
      });

      editor.TUI.enabled = true;
      editor.TUI.unhighlightAll();
    };

    Vue.onMounted(() => {
      if (!editorEl.value || typeof Vbuf === 'undefined') {
        console.error('Vbuf not loaded or editor element not found');
        return;
      }

      const viewportSize = props.items.length + 2;

      const editor = new Vbuf(editorEl.value, {
        initialViewportSize: viewportSize,
        showGutter: false,
        showStatusLine: false,
        colorPrimary: 'var(--tui-fg)',
        colorSecondary: 'transparent',
        lineHeight: 16,
      });

      editorInstance.value = editor;
      buildMenu(editor, props.items, props.activeId);

      // Keyboard navigation
      editorEl.value.addEventListener('keydown', (e) => {
        if (!editor.TUI.enabled) return;

        // Within-editor navigation (arrow keys)
        if (e.key === 'Tab' || e.key === 'ArrowDown') {
          e.preventDefault();
          editor.TUI.nextElement();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const elements = editor.TUI.getElements();
          if (elements.length > 0) {
            for (let i = 0; i < elements.length - 1; i++) {
              editor.TUI.nextElement();
            }
          }
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          editor.TUI.activateElement();
        }

        // Panel navigation (wasd)
        // w: go up to topbar
        if (e.key === 'w') {
          e.preventDefault();
          const topbar = document.querySelector('.kit-tui-bar-buttons .wb');
          if (topbar) topbar.focus();
        }
        // d: go right to view sidenav or content
        if (e.key === 'd') {
          e.preventDefault();
          const next = document.querySelector('.kit-tui-vbuf-view-sidenav .wb') ||
                       document.querySelector('.kit-tui-vbuf-content .wb');
          if (next) next.focus();
        }
      });

      editorEl.value.focus();
    });

    // Watch activeId for changes
    Vue.watch(
      () => props.activeId,
      (newActiveId) => {
        if (editorInstance.value) {
          buildMenu(editorInstance.value, props.items, newActiveId);
        }
      }
    );

    // Watch items for changes
    Vue.watch(
      () => props.items,
      (newItems) => {
        if (editorInstance.value) {
          buildMenu(editorInstance.value, newItems, props.activeId);
        }
      },
      { deep: true }
    );

    return { editorEl };
  },
};
