import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-bar,
.kit-tui-bar * {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 16px;
}

.kit-tui-bar {
  background: var(--tui-bg);
  color: var(--tui-fg);
  letter-spacing: 0;
}

.kit-tui-bar-brand {
  font-weight: bold;
}

.kit-tui-bar-tips {
  color: var(--tui-fg);
  opacity: 0.6;
  font-size: 14px;
}

.kit-tui-bar-buttons {
  line-height: 0;
}

.kit-tui-bar-buttons .wb {
  background-color: transparent;
  color: var(--tui-fg);
  position: relative;
  outline: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 16px;
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid transparent;
  height: 18px;
}
.kit-tui-bar-buttons .wb:focus {
  border-color: #666;
}
.kit-tui-bar-buttons .wb-clipboard-bridge {
  position: fixed; left: 0; top: 1px;
  width: 0; height: 1px; opacity: 0; pointer-events: none;
}
.kit-tui-bar-buttons .wb .wb-lines { margin: 0 !important; padding: 0 !important; line-height: 16px !important; }
.kit-tui-bar-buttons .wb .wb-lines > pre::before { content: "\\200B"; }
.kit-tui-bar-buttons .wb .wb-lines pre { margin: 0; white-space: pre; line-height: 16px; }
.kit-tui-bar-buttons .wb .wb-selection {
  background-color: #0abab5;
  position: absolute;
}
.kit-tui-bar-buttons .wb .wb-status { display: none; padding: 0 !important; height: 0 !important; }
.kit-tui-bar-buttons .wb .wb-gutter { display: none; padding: 0 !important; }
.kit-tui-bar-buttons .wb > div[style*="flex"] { margin: 0 !important; padding: 0 !important; }
`;

export const KitTUIBar = {
  props: {
    brand: { type: String, default: 'SYSTEM' },
    buttons: { type: Array, default: () => [] },
    distractionFree: { type: Boolean, default: false },
    borderless: { type: Boolean, default: false },
  },
  emits: ['button-click'],
  template: `
    <div class="kit-tui-bar h-7 flex items-center shrink-0 pl-[1ch] pr-2" style="gap: 2ch;">
      <div v-if="!distractionFree" class="kit-tui-bar-brand">[{{ brand.toUpperCase() }}]</div>
      <div v-if="!distractionFree" class="kit-tui-bar-tips">a←  d→  w↑bar  s↓nav  ↑↓←→ in editor</div>
      <div class="kit-tui-bar-buttons flex-1 flex justify-end">
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
    </div>
  `,
  setup(props, { emit }) {
    useStyles('kit-tui-bar', styles);

    const editorEl = Vue.ref(null);
    let editor = null;
    let currentIndex = 0;
    let elementIds = {};

    const buildButtons = () => {
      if (!editor || props.buttons.length === 0) return;

      // Build a single line with all buttons
      // Hidden buttons become spaces, visible buttons show [char] with * or space suffix
      // Each button content is 4 chars: "[X] " or "[X]*"
      const buttonText = props.buttons.map(b => {
        if (b.hidden) return '    '; // 4 spaces to match "[X] "
        return b.active ? `[${b.char}]*` : `[${b.char}] `;
      }).join(' ');
      editor.Model.text = buttonText;

      // Clear old TUI elements
      editor.TUI.clear();
      elementIds = {};

      // Add TUI elements only for visible buttons
      // Each button slot is 5 chars (4 content + 1 separator from join)
      let col = 0;
      props.buttons.forEach((btn, index) => {
        if (!btn.hidden) {
          const content = btn.active ? `[${btn.char}]*` : `[${btn.char}] `;
          const id = editor.TUI.addElement({
            row: 0,
            col: col,
            content: content,
            onActivate: () => {
              emit('button-click', btn.id, btn);
            },
          });
          elementIds[btn.id] = id;
        }
        col += 5; // 4 chars content + 1 char separator
      });

      editor.TUI.enabled = true;
      editor.TUI.unhighlightAll();
    };

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

      buildButtons();

      // Keyboard navigation
      editorEl.value.addEventListener('keydown', (e) => {
        if (!editor.TUI.enabled) return;
        const elements = editor.TUI.getElements();
        const numElements = elements.length;

        if (e.key === 'Tab' || e.key === 'd' || e.key === 'ArrowRight') {
          e.preventDefault();
          currentIndex = (currentIndex + 1) % numElements;
          editor.TUI.nextElement();
        }
        if (e.key === 'a' || e.key === 'ArrowLeft') {
          e.preventDefault();
          currentIndex = (currentIndex - 1 + numElements) % numElements;
          // Go backwards by going forward n-1 times
          for (let i = 0; i < numElements - 1; i++) {
            editor.TUI.nextElement();
          }
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          // Call onActivate directly without moving cursor
          // Use visible buttons only (currentIndex tracks position among TUI elements)
          const visibleButtons = props.buttons.filter(b => !b.hidden);
          const btn = visibleButtons[currentIndex];
          if (btn) {
            emit('button-click', btn.id, btn);
          }
        }
        // s to move down to sidenav
        if (e.key === 's' || e.key === 'ArrowDown') {
          e.preventDefault();
          const sidenav = document.querySelector('.kit-tui-vbuf-sidenav .wb');
          if (sidenav) sidenav.focus();
        }
      });
    });

    Vue.watch(() => props.buttons, (newButtons, oldButtons) => {
      if (editor) {
        const hadFocus = document.activeElement === editorEl.value;
        // Detect focus mode toggle by checking if hidden states changed
        const oldFocusBtn = oldButtons?.find(b => b.id === 'focus');
        const newFocusBtn = newButtons.find(b => b.id === 'focus');
        const focusModeChanged = oldFocusBtn?.active !== newFocusBtn?.active;

        const visibleButtons = newButtons.filter(b => !b.hidden);
        const focusIndexInVisible = visibleButtons.findIndex(b => b.id === 'focus');

        // Update currentIndex immediately when focus mode changes
        if (focusModeChanged) {
          currentIndex = focusIndexInVisible;
        }

        buildButtons();
        // Use setTimeout to ensure focus is restored after all DOM updates
        setTimeout(() => {
          // When focus mode changes, highlight [F] button
          if (focusModeChanged) {
            editorEl.value?.focus();
            // Navigate to [F]
            editor.TUI.nextElement(); // Select first element
            for (let i = 0; i < focusIndexInVisible; i++) {
              editor.TUI.nextElement();
            }
          } else if (hadFocus) {
            editorEl.value?.focus();
          }
        }, 0);
      }
    }, { deep: true });

    return { editorEl };
  },
};
