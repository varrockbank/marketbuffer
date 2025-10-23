// Finder App Card - Self-contained application module
const finderCard = {
  id: 'finder',
  title: 'Marketbuffer HD',
  draggable: false,
  closeable: true,
  zIndex: 100,
  top: 80,
  right: 20,
  width: 400,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // HTML content
  content: `
    <div class="finder-content">
      <div class="finder-item">
        <div class="folder-icon"></div>
        <span class="finder-label">System</span>
      </div>
      <div class="finder-item">
        <div class="folder-icon"></div>
        <span class="finder-label">Applications</span>
      </div>
      <div class="finder-item">
        <div class="folder-icon"></div>
        <span class="finder-label">Documents</span>
      </div>
      <div class="finder-item">
        <div class="folder-icon"></div>
        <span class="finder-label">Utilities</span>
      </div>
      <div class="finder-item">
        <div class="document-icon"></div>
        <span class="finder-label">ReadMe</span>
      </div>
      <div class="finder-item">
        <div class="document-icon"></div>
        <span class="finder-label">Notes.txt</span>
      </div>
    </div>
  `,

  // CSS styles for this app
  styles: `
    .finder-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding: 16px;
    }

    .finder-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .finder-item:hover .finder-label {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .folder-icon {
      width: 32px;
      height: 26px;
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      position: relative;
      margin-bottom: 4px;
    }

    .folder-icon::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 2px;
      width: 14px;
      height: 6px;
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      border-bottom: none;
    }

    .document-icon {
      width: 24px;
      height: 32px;
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      position: relative;
      margin-bottom: 4px;
    }

    .document-icon::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background: var(--window-bg);
      border-left: 1px solid var(--window-border);
      border-bottom: 1px solid var(--window-border);
    }

    .finder-label {
      font-size: 10px;
      text-align: center;
      padding: 1px 3px;
    }
  `,

  // Called when app window is opened
  init() {
    // Nothing special needed
  },

  // Called when app window is closed
  destroy() {
    // Cleanup if needed
  },

  // Event handlers
  handleClick(e) {
    // Handle folder/file clicks if needed
  },

  // Boot - called once when OS starts
  boot() {
    // Nothing to do on boot
  }
};
