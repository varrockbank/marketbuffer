import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-vbuf-view-sidenav {
  background: var(--tui-bg);
  color: var(--tui-fg);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 4px;
  width: 100%;
  border-right: 1px solid var(--tui-fg);
}
.kit-tui-vbuf-view-sidenav.borderless {
  border-right: none;
}

.kit-tui-vbuf-view-sidenav .wb {
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
  overflow: hidden;
}
.kit-tui-vbuf-view-sidenav .wb:focus {
  border-color: #666;
}
.kit-tui-vbuf-view-sidenav .no-select { user-select: none; }
.kit-tui-vbuf-view-sidenav .wb-clipboard-bridge {
  position: fixed; left: 0; top: 1px;
  width: 0; height: 1px; opacity: 0; pointer-events: none;
}
.kit-tui-vbuf-view-sidenav .wb .wb-lines { margin: 0 !important; padding: 0 !important; }
.kit-tui-vbuf-view-sidenav .wb .wb-lines > pre::before { content: "\\200B"; }
.kit-tui-vbuf-view-sidenav .wb .wb-lines pre { margin: 0; white-space: pre; }
.kit-tui-vbuf-view-sidenav .wb .wb-selection {
  background-color: #0abab5;
  position: absolute;
}
.kit-tui-vbuf-view-sidenav .wb .wb-status { display: none; padding: 0 !important; height: 0 !important; margin: 0 !important; }
`;

export const KitTUIVbufViewSidenav = {
  props: {
    sections: { type: Array, default: () => [] },
    activeId: { type: String, default: '' },
    borderless: { type: Boolean, default: false },
  },
  emits: ['select'],
  template: `
    <div class="kit-tui-vbuf-view-sidenav" :class="{ borderless }">
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
    useStyles('kit-tui-vbuf-view-sidenav', styles);

    const editorEl = Vue.ref(null);
    const editorInstance = Vue.shallowRef(null);

    const buildMenu = (editor, sections, activeId) => {
      if (!editor) return;

      // Build lines array with headers as text
      const lines = [];
      sections.forEach(section => {
        lines.push(`══ ${section.header} ════════════════════`);
        section.items.forEach(() => lines.push(''));
      });

      editor.Model.text = lines.join('\n');

      // Clear old TUI elements
      editor.TUI.clear();

      // Add TUI elements only for items (not headers)
      let currentRow = 0;
      sections.forEach(section => {
        currentRow++; // Skip header row

        section.items.forEach(item => {
          const isActive = item.id === activeId;
          const indicator = isActive ? '>' : ' ';
          const prefix = item.prefix || '';
          const suffix = item.suffix || '';
          const label = `${indicator} ${prefix}${item.label}${suffix ? ' ' + suffix : ''}`;

          editor.TUI.addElement({
            row: currentRow,
            col: 0,
            content: label,
            onActivate: () => {
              emit('select', item.id, item);
            },
          });
          currentRow++;
        });
      });

      editor.TUI.enabled = true;
      editor.TUI.unhighlightAll();
    };

    Vue.onMounted(() => {
      if (!editorEl.value || typeof Vbuf === 'undefined') {
        console.error('Vbuf not loaded or editor element not found');
        return;
      }

      // Calculate viewport size
      let totalRows = 0;
      props.sections.forEach(section => {
        totalRows += 1 + section.items.length;
      });

      const editor = new Vbuf(editorEl.value, {
        initialViewportSize: Math.max(totalRows, 10),
        showGutter: false,
        showStatusLine: false,
        colorPrimary: 'var(--tui-fg)',
        colorSecondary: 'transparent',
        lineHeight: 16,
      });

      editorInstance.value = editor;
      buildMenu(editor, props.sections, props.activeId);

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
        // a: go left to main sidenav
        if (e.key === 'a') {
          e.preventDefault();
          const prev = document.querySelector('.kit-tui-vbuf-sidenav .wb');
          if (prev) prev.focus();
        }
        // d: go right to content
        if (e.key === 'd') {
          e.preventDefault();
          const next = document.querySelector('.kit-tui-vbuf-content .wb');
          if (next) next.focus();
        }
      });
    });

    // Watch activeId separately for simple value changes
    Vue.watch(
      () => props.activeId,
      (newActiveId) => {
        if (editorInstance.value) {
          buildMenu(editorInstance.value, props.sections, newActiveId);
        }
      }
    );

    // Watch sections for structural changes
    Vue.watch(
      () => props.sections,
      (newSections) => {
        if (editorInstance.value) {
          buildMenu(editorInstance.value, newSections, props.activeId);
        }
      },
      { deep: true }
    );

    return { editorEl };
  },
};
