import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-vbuf-content {
  background: var(--tui-bg);
  color: var(--tui-fg);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.kit-tui-vbuf-content .wb {
  background-color: transparent;
  color: var(--tui-fg);
  position: relative;
  outline: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 16px;
  flex: 1;
  margin: 0;
  width: 100%;
  border: 1px solid transparent;
}
.kit-tui-vbuf-content .wb:focus {
  border-color: #666;
}
.kit-tui-vbuf-content .no-select { user-select: none; }
.kit-tui-vbuf-content .wb-clipboard-bridge {
  position: fixed; left: 0; top: 1px;
  width: 0; height: 1px; opacity: 0; pointer-events: none;
}
.kit-tui-vbuf-content .wb .wb-lines { margin: 0 !important; padding: 0 !important; }
.kit-tui-vbuf-content .wb .wb-lines > pre::before { content: "\\200B"; }
.kit-tui-vbuf-content .wb .wb-lines pre { margin: 0; white-space: pre; }
.kit-tui-vbuf-content .wb .wb-selection {
  background-color: #0abab5;
  position: absolute;
}
.kit-tui-vbuf-content .wb .wb-status { display: none; padding: 0 !important; height: 0 !important; margin: 0 !important; }
`;

export const KitTUIVbufContent = {
  props: {
    // Array of lines to display
    lines: { type: Array, default: () => [] },
    // Show line numbers in gutter
    showGutter: { type: Boolean, default: false },
    // Optional interactive elements: [{ row, col, content, onActivate }]
    elements: { type: Array, default: () => [] },
  },
  emits: ['activate'],
  template: `
    <div class="kit-tui-vbuf-content">
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
    useStyles('kit-tui-vbuf-content', styles);

    const editorEl = Vue.ref(null);
    let editor = null;

    const updateContent = () => {
      if (!editor) return;

      // Set text directly using regular editor mode
      editor.Model.text = props.lines.join('\n');

      // Clear and add TUI elements if any
      editor.TUI.clear();

      if (props.elements.length > 0) {
        props.elements.forEach((el, index) => {
          editor.TUI.addElement({
            row: el.row,
            col: el.col || 0,
            content: el.content,
            onActivate: () => {
              if (el.onActivate) {
                el.onActivate(el);
              }
              emit('activate', el, index);
            },
          });
        });
      }

      // Enable TUI mode when there are interactive elements
      if (props.elements.length > 0) {
        editor.TUI.enabled = true;
        editor.TUI.unhighlightAll();
      } else {
        editor.TUI.enabled = false;
      }
    };

    Vue.onMounted(() => {
      if (!editorEl.value || typeof Vbuf === 'undefined') {
        console.error('Vbuf not loaded or editor element not found');
        return;
      }

      const viewportSize = Math.max(props.lines.length, 20);

      editor = new Vbuf(editorEl.value, {
        initialViewportSize: viewportSize,
        showGutter: props.showGutter,
        showStatusLine: false,
        colorPrimary: 'var(--tui-fg)',
        colorSecondary: 'transparent',
        lineHeight: 16,
      });

      updateContent();

      // Keyboard navigation
      editorEl.value.addEventListener('keydown', (e) => {
        // Panel navigation (wasd)
        // a: go left to view sidenav or main sidenav
        if (e.key === 'a') {
          e.preventDefault();
          const prev = document.querySelector('.kit-tui-vbuf-view-sidenav .wb') ||
                       document.querySelector('.kit-tui-vbuf-sidenav .wb');
          if (prev) prev.focus();
          return;
        }

        // TUI element navigation (only when TUI enabled with elements)
        if (editor.TUI.enabled) {
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
        }
      });
    });

    // Watch for changes
    Vue.watch(() => [props.lines, props.elements], () => {
      if (editor) {
        updateContent();
      }
    }, { deep: true });

    return { editorEl };
  },
};
