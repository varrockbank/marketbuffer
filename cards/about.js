// About App Card - Self-contained application module
const aboutCard = {
  id: 'about',
  title: 'About This Marketbuffer',
  draggable: true,
  closeable: true,
  zIndex: 101,
  top: 250,
  right: 40,
  width: 340,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // HTML content
  content: `
    <div class="about-content">
      <div class="macket-icon">
        <div class="macket-screen"></div>
        <div class="macket-base"></div>
      </div>
      <div class="about-title">Marketbuffer System</div>
      <div class="about-text">
        System Software 7.0<br>
        &copy; Marketbuffer Computer, Inc. 2025-2026
      </div>
      <hr class="about-divider">
      <div class="about-text">
        Built-in Memory: 4,096K<br>
        Total Memory: 8,192K
      </div>
      <br>
      <button class="macket-button about-ok-btn">OK</button>
    </div>
  `,

  // CSS styles for this app
  styles: `
    .about-content {
      text-align: center;
      padding: 24px;
    }

    .macket-icon {
      width: 64px;
      height: 80px;
      margin: 0 auto 16px;
      border: 2px solid var(--window-border);
      background: var(--window-bg);
      position: relative;
    }

    .macket-screen {
      width: 48px;
      height: 36px;
      border: 2px solid var(--window-border);
      margin: 8px auto 4px;
      background: var(--bg-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .macket-screen::before {
      content: ':-)';
      font-size: 10px;
    }

    .macket-base {
      width: 56px;
      height: 8px;
      background: var(--window-bg);
      border-top: 2px solid var(--window-border);
      margin: 0 auto;
    }

    .about-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .about-text {
      font-size: 11px;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .about-divider {
      border: none;
      border-top: 1px solid var(--window-border);
      margin: 12px 0;
    }

    .macket-button {
      background: var(--window-bg);
      border: 2px solid var(--window-border);
      border-radius: 8px;
      padding: 4px 16px;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 2px 2px 0 var(--window-border);
      color: var(--text-color);
    }

    .macket-button:active {
      background: var(--text-color);
      color: var(--window-bg);
      box-shadow: none;
      transform: translate(2px, 2px);
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
    // Handle OK button - close window
    if (e.target.closest('.about-ok-btn')) {
      if (typeof closeWindow === 'function') {
        closeWindow(this.id);
      }
    }
  },

  // Boot - called once when OS starts
  boot() {
    // Nothing to do on boot
  }
};
