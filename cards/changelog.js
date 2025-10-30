// Changelog App Card - Shows release history from changelog.md using WarrenBuf
const changelogCard = {
  id: 'changelog',
  title: 'Release Notes',
  draggable: true,
  closeable: true,
  zIndex: 104,
  top: 80,
  right: 50,
  width: 800,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // WarrenBuf editor instance
  editor: null,

  async loadChangelog() {
    try {
      const response = await fetch('changelog.md');
      const markdown = await response.text();
      if (this.editor && this.editor.Model) {
        this.editor.Model.text = markdown;
      }
    } catch (err) {
      console.error('Failed to load changelog:', err);
    }
  },

  content() {
    return `
    <div class="changelog-wrapper">
      <blockquote cite="" class="playground 💪 🍜 🥷 🌕 🪜 wb no-select" tabindex="0" id="changelog-editor">
        <textarea class="wb-clipboard-bridge" aria-hidden="true"></textarea>
        <div class="💪">
          <div class="wb-gutter"></div>
          <div class="wb-lines 🌳 🥷"></div>
        </div>
        <div class="💪 wb-status 🦠">
          <div class="wb-status-left 💪">
            <span class="wb-linecount"></span>
          </div>
          <div class="wb-status-right 💪">
            <span class="wb-coordinate"></span>
            <span>|</span>
            <span class="wb-indentation"></span>
          </div>
        </div>
      </blockquote>
    </div>
  `;
  },

  styles: `
    .changelog-wrapper {
      display: flex;
      flex-direction: column;
      height: 400px;
    }

    .changelog-editor {
      flex: 1;
      overflow: hidden;
    }
  `,

  init(system) {
    setTimeout(() => {
      const editorEl = document.getElementById('changelog-editor');
      if (editorEl && typeof WarrenBuf !== 'undefined') {
        this.editor = new WarrenBuf(editorEl, {});
        // Apply dark theme if needed
        if (document.body.classList.contains('dark-mode')) {
          editorEl.classList.add('wb-dark');
        }
        this.loadChangelog();
      }
    }, 0);
  },

  destroy() {
    this.editor = null;
  },

  handleClick(e) {
    // No click handlers needed
  },

  boot() {
    // Nothing to do on boot
  }
};
