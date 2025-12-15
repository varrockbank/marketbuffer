import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-vbuf-terminal {
  background: var(--tui-bg);
  color: var(--tui-fg);
  display: flex;
  flex-direction: column;
  height: 60px;
  width: 100vw;
  flex-shrink: 0;
}

.kit-tui-vbuf-terminal .wb {
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
.kit-tui-vbuf-terminal .wb:focus {
  border-color: #666;
}
.kit-tui-vbuf-terminal .no-select { user-select: none; }
.kit-tui-vbuf-terminal .wb-clipboard-bridge {
  position: fixed; left: 0; top: 1px;
  width: 0; height: 1px; opacity: 0; pointer-events: none;
}
.kit-tui-vbuf-terminal .wb .wb-lines { margin: 0 !important; padding: 0 !important; }
.kit-tui-vbuf-terminal .wb .wb-lines > pre::before { content: "\\200B"; }
.kit-tui-vbuf-terminal .wb .wb-lines pre { margin: 0; white-space: pre; }
.kit-tui-vbuf-terminal .wb .wb-selection {
  background-color: #0abab5;
  position: absolute;
}
.kit-tui-vbuf-terminal .wb .wb-status { display: none; padding: 0 !important; height: 0 !important; margin: 0 !important; }
`;

export const KitTUIVbufTerminal = {
  template: `
    <div class="kit-tui-vbuf-terminal">
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
  setup() {
    useStyles('kit-tui-vbuf-terminal', styles);

    const editorEl = Vue.ref(null);
    let editor = null;

    Vue.onMounted(() => {
      if (!editorEl.value || typeof Vbuf === 'undefined') {
        console.error('Vbuf not loaded or editor element not found');
        return;
      }

      editor = new Vbuf(editorEl.value, {
        initialViewportSize: 3,
        showGutter: false,
        showStatusLine: false,
        colorPrimary: 'var(--tui-fg)',
        colorSecondary: 'transparent',
        lineHeight: 16,
      });

      // Set initial content - make title line stretch full width
      const titleText = ' terminal ';
      const rightWidth = 300;
      const titleLine = '═'.repeat(10) + titleText + '═'.repeat(rightWidth);
      const lines = [
        titleLine,
        '',
        'root > ',
      ];
      editor.Model.text = lines.join('\n');
    });

    return { editorEl };
  },
};
