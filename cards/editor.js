// Editor App Card - Self-contained application module
const editorCard = {
  id: 'tabbed-main',
  title: 'Editor',
  tabbed: true,  // Special flag for tabbed window type
  draggable: false,
  closeable: true,
  zIndex: 50,
  top: 20,
  left: 20,
  right: 20,
  bottom: 20,
  tabs: [
    { id: 'tab-1', name: 'Tab 1', activePane: 'pane-1', panes: { id: 'pane-1', title: 'Pane 1' } }
  ],
  contextMenu: [
    { label: 'Split Vertical', action: 'split-vertical' },
    { label: 'Split Horizontal', action: 'split-horizontal' },
    { label: 'Close Pane', action: 'close-pane' },
    { label: 'Close', action: 'close' }
  ],

  // Generate editor HTML for a pane
  generatePaneContent(paneId) {
    return `
      <blockquote cite="" class="playground 💪 🍜 🥷 🌕 🪜 wb no-select" tabindex="0" id="editor-${paneId}">
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
    `;
  },

  // CSS styles for this app (tabbed window styles)
  styles: `
    .tabbed-window {
      position: absolute;
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      padding: 5px;
      display: flex;
      flex-direction: column;
    }

    .tabbed-window-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--window-bg);
    }

    .tabbed-window-tabs {
      display: flex;
      background: var(--selected-bg);
      border: 2px solid var(--window-border);
      min-height: 24px;
    }

    .tabbed-window-tab {
      padding: 4px 16px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--window-border);
      font-size: 11px;
      cursor: pointer;
      position: relative;
      padding-left: 20px;
    }

    .tabbed-window-tab:hover {
      background: var(--window-bg);
    }

    .tabbed-window-tab.active {
      background: var(--window-bg);
      border-bottom: 2px solid var(--window-bg);
      margin-bottom: -2px;
    }

    .tab-close {
      display: none;
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      line-height: 1;
      cursor: pointer;
    }

    .tabbed-window-tab:hover .tab-close {
      display: block;
    }

    .tab-close:hover {
      font-weight: bold;
    }

    .tabbed-window-tab-add {
      padding: 4px 12px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--window-border);
      font-size: 11px;
      cursor: pointer;
    }

    .tabbed-window-tab-add:hover {
      background: var(--window-bg);
    }

    .tabbed-close-box {
      margin: 4px 8px 4px 8px;
      align-self: center;
    }

    .first-tab-with-close {
      border-left: 1px solid var(--window-border);
    }

    .tabbed-window-content {
      flex: 1;
      background: var(--window-bg);
      overflow: hidden;
      display: flex;
      position: relative;
    }

    .tab-pane-container {
      display: none;
      flex: 1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .tab-pane-container.active {
      display: flex;
    }

    /* Panes */
    .pane {
      flex: 1;
      display: flex;
      background: var(--pane-bg);
      overflow: auto;
      cursor: pointer;
    }

    .pane-multi {
      margin: 2px;
      border: 1px solid var(--window-border);
      position: relative;
      overflow: visible;
    }

    .pane-split-vertical > .pane-multi,
    .pane-split-vertical > .pane-split {
      margin-top: 8px;
    }

    .pane-split-vertical > .pane-multi:first-child,
    .pane-split-vertical > .pane-split:first-child {
      margin-top: 0;
    }

    .tab-pane-container > .pane-split {
      padding-top: 8px;
    }

    .pane-multi.focused {
      border: 2px solid teal;
    }

    .pane-split.parent-highlight {
      background: rgba(0, 128, 128, 0.1);
    }

    .pane-multi.closing-highlight {
      background: rgba(255, 0, 0, 0.2);
    }

    .pane-multi.sibling-highlight {
      background: rgba(0, 128, 128, 0.2);
    }
  `,

  // Called when app window is opened
  init() {
    // Initialize editors for all panes
    this.initializeEditors();
  },

  // Called when app window is closed
  destroy() {
    // Cleanup editor instances
  },

  // Initialize WarrenBuf editors for all panes
  initializeEditors() {
    document.querySelectorAll('[id^="editor-pane-"]').forEach(editorEl => {
      if (editorEl.dataset.wbInitialized) return;

      const paneId = editorEl.id.replace('editor-', '');
      if (typeof WarrenBuf !== 'undefined') {
        editorEl.dataset.wbInitialized = 'true';
        window.paneRegistry = window.paneRegistry || {};
        window.paneRegistry[paneId] = {
          id: paneId,
          editorId: editorEl.id,
          editor: new WarrenBuf(editorEl, {})
        };

        // Apply current theme to editor
        const currentTheme = localStorage.getItem('marketbuffer_theme') || 'light';
        const playground = editorEl.querySelector('.playground.wb');
        if (playground && currentTheme === 'dark') {
          playground.classList.add('wb-dark');
        }
      }
    });
  },

  // Event handlers
  handleClick(e) {
    // Pane focusing handled by OS
  },

  // Boot - called once when OS starts
  boot() {
    // Nothing to do on boot
  }
};
