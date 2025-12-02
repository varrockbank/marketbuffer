// OS - System-level utilities for Marketbuffer
// This module provides core OS APIs that cards and other modules can use

const OS = {
  // Version and state (loaded from default-state.json)
  version: null,
  state: null,

  // Storage keys
  STATE_KEY: 'marketbuffer_state',
  PINNED_FILES_KEY: 'marketbuffer_pinned_files',

  // File type handlers - maps extensions to app IDs
  fileHandlers: {
    'js': 'editor',
    'jsx': 'editor',
    'ts': 'editor',
    'tsx': 'editor',
    'css': 'editor',
    'html': 'editor',
    'json': 'editor',
    'md': 'editor',
    'txt': 'editor',
    'py': 'editor',
    'rb': 'editor',
    'go': 'editor',
    'rs': 'editor',
    'c': 'editor',
    'cpp': 'editor',
    'h': 'editor',
    'sh': 'editor',
    'yaml': 'editor',
    'yml': 'editor',
    'xml': 'editor',
    'svg': 'editor',
    'stock': 'stocks',
  },

  // Pinned files state
  pinnedFiles: [],

  // Callbacks registered by index.html after DOM functions are defined
  _callbacks: {
    closeWindow: null,
    openApplication: null,
    getCard: null,
    renderPinnedFiles: null,
    renderFileTree: null,
  },

  // Register callbacks from index.html
  registerCallbacks(callbacks) {
    Object.assign(this._callbacks, callbacks);
  },

  // ============================================
  // System API
  // ============================================

  close(windowId) {
    if (this._callbacks.closeWindow) {
      this._callbacks.closeWindow(windowId);
    }
  },

  openWindow(windowId) {
    if (this._callbacks.openApplication) {
      this._callbacks.openApplication(windowId);
    }
  },

  openFile(path) {
    const ext = path.split('.').pop().toLowerCase();
    const appId = this.fileHandlers[ext] || 'editor';
    const card = this._callbacks.getCard ? this._callbacks.getCard(appId) : null;
    if (card && typeof card.openFile === 'function') {
      card.openFile(path);
    }
  },

  // ============================================
  // State Management
  // ============================================

  async loadDefaultState() {
    const response = await fetch('default-state.json');
    return response.json();
  },

  async loadSystemState() {
    const defaultState = await this.loadDefaultState();
    this.version = defaultState.version;

    const saved = localStorage.getItem(this.STATE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Version mismatch - clear and reload
        if (parsed.version !== this.version) {
          console.log(`OS version mismatch: ${parsed.version} !== ${this.version}. Resetting state.`);
          localStorage.clear();
          location.reload();
          return;
        }
        this.state = { ...defaultState, ...parsed };
      } catch (e) {
        console.error('Failed to parse system state:', e);
        localStorage.clear();
        location.reload();
        this.state = { ...defaultState };
      }
    } else {
      // First-time user: use default state
      this.state = { ...defaultState };
    }
    return this.state;
  },

  saveSystemState() {
    this.state.version = this.version;
    localStorage.setItem(this.STATE_KEY, JSON.stringify(this.state));
  },

  // ============================================
  // Pinned Files
  // ============================================

  loadPinnedFiles() {
    const saved = localStorage.getItem(this.PINNED_FILES_KEY);
    if (saved) {
      this.pinnedFiles = JSON.parse(saved);
    } else {
      // Use defaults from state (loaded from default-state.json)
      this.pinnedFiles = [...(this.state?.defaultPinnedFiles || ['demo/README.md'])];
      this.savePinnedFiles();
    }
    return this.pinnedFiles;
  },

  savePinnedFiles() {
    localStorage.setItem(this.PINNED_FILES_KEY, JSON.stringify(this.pinnedFiles));
  },

  togglePinFile(path) {
    const index = this.pinnedFiles.indexOf(path);
    if (index === -1) {
      this.pinnedFiles.push(path);
    } else {
      this.pinnedFiles.splice(index, 1);
    }
    this.savePinnedFiles();
    if (this._callbacks.renderPinnedFiles) {
      this._callbacks.renderPinnedFiles();
    }
    if (this._callbacks.renderFileTree) {
      this._callbacks.renderFileTree();
    }
  },

  unpinFile(path) {
    const index = this.pinnedFiles.indexOf(path);
    if (index !== -1) {
      this.pinnedFiles.splice(index, 1);
      this.savePinnedFiles();
      if (this._callbacks.renderPinnedFiles) {
        this._callbacks.renderPinnedFiles();
      }
      if (this._callbacks.renderFileTree) {
        this._callbacks.renderFileTree();
      }
    }
  },

  isPinned(path) {
    return this.pinnedFiles.includes(path);
  },

  getPinnedFiles() {
    return this.pinnedFiles;
  },
};

// Create backward-compatible aliases
const system = OS;
let pinnedFiles = OS.pinnedFiles;
const togglePinFile = (path) => OS.togglePinFile(path);
const unpinFile = (path) => OS.unpinFile(path);
