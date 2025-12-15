import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-vbuf-title {
  padding: 4px 4px 0 0;
  line-height: 0;
}

.kit-tui-vbuf-title .wb {
  background-color: transparent;
  color: var(--tui-fg);
  position: relative;
  outline: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 16px;
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid transparent;
}
.kit-tui-vbuf-title .wb:focus {
  border-color: #666;
}
.kit-tui-vbuf-title .wb-clipboard-bridge {
  position: fixed; left: 0; top: 1px;
  width: 0; height: 1px; opacity: 0; pointer-events: none;
}
.kit-tui-vbuf-title .wb .wb-lines { margin: 0 !important; padding: 0 !important; line-height: 16px !important; }
.kit-tui-vbuf-title .wb .wb-lines > pre::before { content: "\\200B"; }
.kit-tui-vbuf-title .wb .wb-lines pre { margin: 0; white-space: pre; line-height: 16px; }
.kit-tui-vbuf-title .wb .wb-selection { display: none; }
.kit-tui-vbuf-title .wb .wb-status { display: none; padding: 0 !important; height: 0 !important; }
.kit-tui-vbuf-title .wb .wb-gutter { display: none; padding: 0 !important; }
.kit-tui-vbuf-title .wb > div[style*="flex"] { margin: 0 !important; padding: 0 !important; }
`;

export const KitTUIVbufTitle = {
  props: {
    text: { type: String, default: '' },
  },
  template: `
    <div class="kit-tui-vbuf-title">
      <blockquote class="wb no-select" ref="editorEl">
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
  setup(props) {
    useStyles('kit-tui-vbuf-title', styles);

    const editorEl = Vue.ref(null);
    let editor = null;

    Vue.onMounted(() => {
      if (!editorEl.value || typeof Vbuf === 'undefined') return;

      editor = new Vbuf(editorEl.value, {
        initialViewportSize: 1,
        showGutter: false,
        showStatusLine: false,
        colorPrimary: 'var(--tui-fg)',
        colorSecondary: 'transparent',
        lineHeight: 16,
        editorPaddingPX: 0,
      });

      editor.Model.text = props.text || '';
      editor.TUI.enabled = true;
    });

    Vue.watch(() => props.text, (newText) => {
      if (editor) {
        editor.Model.text = newText || '';
      }
    });

    return { editorEl };
  },
};
