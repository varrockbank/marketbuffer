// Settings App Card - Self-contained application module
const settingsCard = {
  id: 'settings',
  title: 'Settings',
  draggable: true,
  closeable: true,
  zIndex: 104,
  top: 80,
  right: 300,
  width: 400,
  height: 500,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // HTML content - function with no args, uses this
  content() {
    return `
    <div class="settings-content">
      <div class="settings-section">
        <div class="settings-section-title">Appearance</div>
        <div class="settings-row">
          <label class="settings-label">Theme</label>
          <select class="settings-select" id="setting-theme">
            <option value="light" ${this.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="dark" ${this.theme === 'dark' ? 'selected' : ''}>Dark</option>
          </select>
        </div>
        <div class="settings-row">
          <label class="settings-label">Font Size</label>
          <select class="settings-select" id="setting-font-size">
            <option value="small" ${this.fontSize === 'small' ? 'selected' : ''}>Small</option>
            <option value="medium" ${this.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="large" ${this.fontSize === 'large' ? 'selected' : ''}>Large</option>
          </select>
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-title">Window Management</div>
        <div class="settings-row">
          <label class="settings-label">Snap to Grid</label>
          <input type="checkbox" class="settings-checkbox" id="setting-snap-to-grid" ${this.snapToGrid ? 'checked' : ''}>
        </div>
        <div class="settings-row">
          <label class="settings-label">Grid Size: <span id="grid-size-value">${this.gridSize}px</span></label>
          <input type="range" class="settings-slider" id="setting-grid-size" min="10" max="80" step="10" value="${this.gridSize}">
        </div>
      </div>
      <div class="settings-section">
        <div class="settings-section-title"><s>Editor</s> (disabled in demo)</div>
        <div class="settings-row">
          <label class="settings-label"><s>Tab inserts spaces</s></label>
          <input type="checkbox" class="settings-checkbox" id="setting-tab-insert-spaces" ${this.tabInsertSpaces ? 'checked' : ''} disabled>
        </div>
        <div class="settings-row">
          <label class="settings-label"><s>Tab Size</s></label>
          <select class="settings-select" id="setting-tab-size" disabled>
            <option value="2">2 spaces</option>
            <option value="4" selected>4 spaces</option>
            <option value="8">8 spaces</option>
          </select>
        </div>
        <div class="settings-row">
          <label class="settings-label"><s>Word Wrap</s></label>
          <input type="checkbox" class="settings-checkbox" id="setting-word-wrap" disabled>
        </div>
        <div class="settings-row">
          <label class="settings-label"><s>Show line numbers</s></label>
          <input type="checkbox" class="settings-checkbox" id="setting-line-numbers" checked disabled>
        </div>
      </div>
    </div>
  `;
  },

  // Default values
  theme: 'light',
  fontSize: 'medium',
  snapToGrid: false,
  gridSize: 50,
  tabInsertSpaces: true,

  // CSS styles for this app
  styles: `
    .settings-content {
      padding: 12px;
      background: var(--window-bg);
      overflow-y: auto;
    }

    .settings-section {
      margin-bottom: 16px;
    }

    .settings-section:last-child {
      margin-bottom: 0;
    }

    .settings-section-title {
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--hover-bg);
    }

    .settings-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 11px;
    }

    .settings-label {
      flex: 1;
    }

    .settings-select {
      padding: 3px 6px;
      font-family: inherit;
      font-size: 10px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
      min-width: 100px;
    }

    .settings-checkbox {
      width: 14px;
      height: 14px;
      cursor: pointer;
    }

    .settings-slider {
      width: 120px;
      cursor: pointer;
    }
  `,

  // Theme management (uses global systemState)
  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Update select if it exists
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) {
      themeSelect.value = theme;
    }
    // Toggle wb-dark class on all editor elements
    document.querySelectorAll('.playground.wb').forEach(editor => {
      if (theme === 'dark') {
        editor.classList.add('wb-dark');
      } else {
        editor.classList.remove('wb-dark');
      }
    });
  },

  loadTheme() {
    const theme = (typeof systemState !== 'undefined') ? systemState.theme : 'light';
    this.applyTheme(theme);
  },

  saveTheme(theme) {
    if (typeof systemState !== 'undefined' && typeof saveSystemState === 'function') {
      systemState.theme = theme;
      saveSystemState();
    }
  },

  // Font size management
  applyFontSize(size) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add('font-' + size);
    const fontSizeSelect = document.getElementById('setting-font-size');
    if (fontSizeSelect) {
      fontSizeSelect.value = size;
    }
  },

  loadFontSize() {
    const size = (typeof systemState !== 'undefined') ? systemState.fontSize : 'medium';
    this.applyFontSize(size);
  },

  saveFontSize(size) {
    if (typeof systemState !== 'undefined' && typeof saveSystemState === 'function') {
      systemState.fontSize = size;
      saveSystemState();
    }
  },

  // Called when app window is opened - receives system object
  init(system) {
    // Extract settings from system state (use global systemState as fallback)
    const state = system?.state || (typeof systemState !== 'undefined' ? systemState : {});
    this.theme = state.theme || 'light';
    this.fontSize = state.fontSize || 'medium';
    this.snapToGrid = state.snapToGrid === true;
    this.gridSize = state.gridSize || 50;
    this.tabInsertSpaces = state.tabInsertSpaces !== false;
  },

  // Called when app window is closed
  destroy() {
    // Cleanup if needed
  },

  // Event handlers - called by the OS event delegation system
  handleChange(e) {
    if (e.target.id === 'setting-theme') {
      const theme = e.target.value;
      this.applyTheme(theme);
      this.saveTheme(theme);
    }
    if (e.target.id === 'setting-font-size') {
      const size = e.target.value;
      this.applyFontSize(size);
      this.saveFontSize(size);
    }
    if (e.target.id === 'setting-snap-to-grid') {
      const enabled = e.target.checked;
      this.snapToGrid = enabled;
      this.saveSnapToGrid(enabled);
    }
    if (e.target.id === 'setting-tab-insert-spaces') {
      const enabled = e.target.checked;
      this.tabInsertSpaces = enabled;
      this.saveTabInsertSpaces(enabled);
    }
    if (e.target.id === 'setting-grid-size') {
      const size = parseInt(e.target.value);
      this.gridSize = size;
      // Update the label
      const label = document.getElementById('grid-size-value');
      if (label) label.textContent = size + 'px';
      // Show grid overlay while sliding
      this.showGridOverlay(size);
    }
  },

  handleMouseUp(e) {
    // When user releases the slider, save and hide overlay
    if (e.target.id === 'setting-grid-size') {
      this.hideGridOverlay();
      this.saveGridSize(this.gridSize);
    }
  },

  // Grid overlay management
  showGridOverlay(size) {
    let overlay = document.getElementById('grid-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'grid-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
      `;
      document.getElementById('desktop').appendChild(overlay);
    }
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.backgroundImage = `
      linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
    `;
    overlay.style.backgroundSize = `${size}px ${size}px`;
    overlay.style.display = 'block';
    // Keep settings window above overlay
    const settingsWindow = document.querySelector('[data-window-id="settings"]');
    if (settingsWindow) {
      settingsWindow.style.zIndex = 10000;
    }
  },

  hideGridOverlay() {
    const overlay = document.getElementById('grid-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    // Restore settings window z-index
    const settingsWindow = document.querySelector('[data-window-id="settings"]');
    if (settingsWindow) {
      settingsWindow.style.zIndex = 200;
    }
  },

  // Handle input event for real-time slider updates
  handleInput(e) {
    if (e.target.id === 'setting-grid-size') {
      const size = parseInt(e.target.value);
      this.gridSize = size;
      // Update the label
      const label = document.getElementById('grid-size-value');
      if (label) label.textContent = size + 'px';
      // Show grid overlay while sliding
      this.showGridOverlay(size);
    }
  },

  // Save snap to grid setting
  saveSnapToGrid(enabled) {
    if (typeof systemState !== 'undefined' && typeof saveSystemState === 'function') {
      systemState.snapToGrid = enabled;
      saveSystemState();
    }
  },

  // Save grid size setting
  saveGridSize(size) {
    if (typeof systemState !== 'undefined' && typeof saveSystemState === 'function') {
      systemState.gridSize = size;
      saveSystemState();
    }
  },

  // Save tab insert spaces setting
  saveTabInsertSpaces(enabled) {
    if (typeof systemState !== 'undefined' && typeof saveSystemState === 'function') {
      systemState.tabInsertSpaces = enabled;
      saveSystemState();
    }
  },

  // Boot - called once when OS starts (for system-wide initialization)
  boot() {
    this.loadTheme();
    this.loadFontSize();
    // Load grid settings from systemState
    if (typeof systemState !== 'undefined') {
      this.snapToGrid = systemState.snapToGrid === true;
      this.gridSize = systemState.gridSize || 50;
      this.tabInsertSpaces = systemState.tabInsertSpaces !== false;
    }
  }
};
