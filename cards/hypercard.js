// HyperCard App Card - Self-contained application module
const hypercardCard = {
  id: 'hypercard',
  title: 'HyperCard - Welcome Stack',
  draggable: true,
  closeable: true,
  zIndex: 102,
  top: 140,
  right: 440,
  width: 360,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // HTML content
  content: `
    <div class="hypercard-content">
      <div class="hypercard-card">
        <div class="hypercard-title">Welcome to HyperCard</div>
        <div class="hypercard-text">
          HyperCard is your gateway to creating interactive stacks of information.
        </div>
        <div class="hypercard-text">
          Click the buttons below to explore:
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <button class="hypercard-button">Browse</button>
          <button class="hypercard-button">Create</button>
          <button class="hypercard-button">Learn</button>
        </div>
      </div>
      <div class="hypercard-nav">
        <button class="hypercard-nav-btn hypercard-prev">&larr; Prev</button>
        <span class="hypercard-page">Card 1 of 3</span>
        <button class="hypercard-nav-btn hypercard-next">Next &rarr;</button>
      </div>
    </div>
  `,

  // CSS styles for this app
  styles: `
    .hypercard-content {
      padding: 0;
      background: var(--window-bg);
    }

    .hypercard-card {
      padding: 16px;
      min-height: 200px;
      border-bottom: 2px solid var(--window-border);
    }

    .hypercard-title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
      text-decoration: underline;
    }

    .hypercard-text {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .hypercard-button {
      background: var(--window-bg);
      border: 2px solid var(--window-border);
      border-radius: 6px;
      padding: 6px 16px;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      margin: 4px;
      box-shadow: 1px 1px 0 var(--window-border);
      color: var(--text-color);
    }

    .hypercard-button:active {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .hypercard-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background: var(--sidebar-bg);
      border-top: 1px solid var(--window-border);
    }

    .hypercard-nav-btn {
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      padding: 4px 12px;
      font-family: inherit;
      font-size: 11px;
      cursor: pointer;
      color: var(--text-color);
    }

    .hypercard-nav-btn:hover {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .hypercard-page {
      font-size: 10px;
    }
  `,

  // Current card index
  currentCard: 0,
  totalCards: 3,

  // Called when app window is opened
  init() {
    this.currentCard = 0;
    this.updatePageDisplay();
  },

  // Called when app window is closed
  destroy() {
    // Cleanup if needed
  },

  updatePageDisplay() {
    const pageEl = document.querySelector('.hypercard-page');
    if (pageEl) {
      pageEl.textContent = `Card ${this.currentCard + 1} of ${this.totalCards}`;
    }
  },

  // Event handlers
  handleClick(e) {
    if (e.target.closest('.hypercard-prev')) {
      if (this.currentCard > 0) {
        this.currentCard--;
        this.updatePageDisplay();
      }
    }
    if (e.target.closest('.hypercard-next')) {
      if (this.currentCard < this.totalCards - 1) {
        this.currentCard++;
        this.updatePageDisplay();
      }
    }
  },

  // Boot - called once when OS starts
  boot() {
    // Nothing to do on boot
  }
};
