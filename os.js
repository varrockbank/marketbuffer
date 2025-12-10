// OS - System-level utilities for Marketbuffer
// This module provides core OS APIs that cards and other modules can use

const OS = {
  // Version and state (loaded from default-state.json)
  version: null,
  state: null,

  // Storage keys
  STATE_KEY: 'marketbuffer_state',
  PINNED_FILES_KEY: 'marketbuffer_pinned_files',

  // Root state configuration
  rootStates: {
    yap: { tabular: false, apps: [] },
    operate: { tabular: false, apps: [] },
    deploy: { tabular: false, apps: [] },
    data: { tabular: false, apps: [] },
    feed: { tabular: false, apps: [] },
    author: { tabular: false, apps: [] },
    code: { tabular: false, apps: [] },
    git: { tabular: false, apps: [] },
    simulate: { tabular: false, apps: [] },
    agents: { tabular: false, apps: [] },
    work: { tabular: true, apps: ['editor', 'finder', 'about', 'hypercard', 'git', 'settings', 'wallpaper', 'changelog', 'neogotchi', 'trinale', 'stocks', 'simulator'] },
  },
  activeRootState: 'work',  // Current root state

  // Window state
  initialWindows: [],    // All available window cards
  openWindows: [],       // Currently open windows (for current workspace)
  activeWindowId: null,  // ID of the focused window
  activeWindow: null,    // DOM element being dragged
  dragOffsetX: 0,
  dragOffsetY: 0,

  // Workspace state
  workspaces: [],           // Array of workspace objects { id, name, openApps: [] }
  activeWorkspaceId: null,  // ID of the current workspace
  nextWorkspaceId: 1,       // Counter for generating workspace IDs

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
    'algo': 'simulator',
  },

  // Pinned files state
  pinnedFiles: [],

  // Callbacks registered by index.html after DOM functions are defined
  _callbacks: {
    closeWindow: null,
    openApplication: null,
    renderPinnedFiles: null,
    renderFileTree: null,
    renderWorkspaceTabs: null,
    switchWorkspace: null,
    getWindowState: null,  // Get serialized window state for saving
    onRootStateChange: null,  // Called when root state changes
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
    const card = this.getCard(appId);
    if (card && typeof card.openFile === 'function') {
      card.openFile(path);
    }
  },

  // ============================================
  // Window Management
  // ============================================

  // Apply window position and size styles
  applyWindowStyles(windowEl, win) {
    // top takes precedence, otherwise use bottom if specified
    if (win.top !== undefined) {
      windowEl.style.top = win.top + 'px';
    } else if (win.bottom !== undefined) {
      windowEl.style.bottom = win.bottom + 'px';
    }
    windowEl.style.right = win.right + 'px';
    if (win.width) windowEl.style.width = win.width + 'px';
    if (win.height) windowEl.style.height = win.height + 'px';
    windowEl.style.zIndex = win.zIndex;
  },

  // Apply tabbed window styles
  applyTabbedWindowStyles(windowEl, win) {
    windowEl.style.zIndex = win.zIndex;
    windowEl.style.top = win.top + 'px';
    windowEl.style.left = win.left + 'px';
    windowEl.style.right = win.right + 'px';
    windowEl.style.bottom = win.bottom + 'px';
  },

  // Helper to snap value to grid (delegates to SnapGrid)
  snapToGrid(value, gridSize) {
    return SnapGrid.snap(value, gridSize);
  },

  // Grid overlay for dragging (delegates to SnapGrid)
  showDragGridOverlay(gridSize, excludeWindow) {
    SnapGrid.show({ gridSize, excludeElement: excludeWindow });
  },

  hideDragGridOverlay() {
    SnapGrid.hide();
  },

  // Create window element HTML
  createWindowHTML(win, closeBoxHtml, contentHtml) {
    return `
      <div class="window-title-bar">
        ${closeBoxHtml}
        <span class="window-title">${win.title}</span>
      </div>
      ${contentHtml}
    `;
  },

  // Get close box HTML
  getCloseBoxHTML(win) {
    return win.closeable
      ? `<div class="close-box" data-window-id="${win.id}"></div>`
      : '';
  },

  // Register initial windows (cards)
  registerWindows(windows) {
    this.initialWindows = windows;
  },

  // Get a card by ID
  getCard(id) {
    return this.initialWindows.find(c => c.id === id);
  },

  // Get open window by ID
  getOpenWindow(id) {
    return this.openWindows.find(w => w.id === id);
  },

  // Check if window is open
  isWindowOpen(id) {
    return this.openWindows.some(w => w.id === id);
  },

  // Add window to open windows
  addOpenWindow(win) {
    if (!this.isWindowOpen(win.id)) {
      this.openWindows.push(win);
    }
  },

  // Remove window from open windows
  removeOpenWindow(id) {
    this.openWindows = this.openWindows.filter(w => w.id !== id);
  },

  // Bring window to front (update z-indices)
  bringToFront(windowId) {
    const win = this.getOpenWindow(windowId);
    if (!win) return;

    // Update zIndex in openWindows array
    this.openWindows.forEach(w => {
      w.zIndex = w.tabbed ? 50 : 100;
    });
    win.zIndex = 200;

    // Update DOM
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 100);
    const tabbedWin = document.getElementById('tabbed-window');
    if (tabbedWin) tabbedWin.style.zIndex = 50;
    const windowEl = document.querySelector(`[data-window-id="${windowId}"]`);
    if (windowEl) windowEl.style.zIndex = 200;

    // Set active window
    this.activeWindowId = windowId;
  },

  // Bring tabbed window to front
  bringTabbedToFront() {
    const tabbedWindow = this.openWindows.find(w => w.tabbed);
    this.openWindows.forEach(w => {
      w.zIndex = w.tabbed ? 200 : 100;
    });

    // Update DOM
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 100);
    const tabbedWin = document.getElementById('tabbed-window');
    if (tabbedWin) tabbedWin.style.zIndex = 200;

    // Set active window
    if (tabbedWindow) {
      this.activeWindowId = tabbedWindow.id;
    }
  },

  // Get the topmost window
  getTopWindow() {
    if (this.openWindows.length === 0) return null;
    return this.openWindows.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
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

  // ============================================
  // Workspace Management
  // ============================================

  // Initialize workspaces (called on boot)
  initWorkspaces() {
    // Load from state or create default workspace
    if (this.state?.workspaces && this.state.workspaces.length > 0) {
      this.workspaces = this.state.workspaces;
      this.activeWorkspaceId = this.state.activeWorkspaceId || this.workspaces[0].id;
      this.nextWorkspaceId = Math.max(...this.workspaces.map(w => w.id)) + 1;
    } else {
      // Create default workspace
      this.workspaces = [{
        id: 1,
        name: 'Workspace 1',
        openApps: [],
      }];
      this.activeWorkspaceId = 1;
      this.nextWorkspaceId = 2;
    }
    return this.workspaces;
  },

  // Get active workspace
  getActiveWorkspace() {
    return this.workspaces.find(w => w.id === this.activeWorkspaceId);
  },

  // Get workspace by ID
  getWorkspace(id) {
    return this.workspaces.find(w => w.id === id);
  },

  // Create new workspace
  createWorkspace(name) {
    const workspace = {
      id: this.nextWorkspaceId++,
      name: name || `Workspace ${this.nextWorkspaceId - 1}`,
      openApps: [],
    };
    this.workspaces.push(workspace);
    this.saveWorkspaces();
    if (this._callbacks.renderWorkspaceTabs) {
      this._callbacks.renderWorkspaceTabs();
    }
    return workspace;
  },

  // Delete workspace
  deleteWorkspace(id) {
    if (this.workspaces.length <= 1) return false; // Can't delete last workspace
    const index = this.workspaces.findIndex(w => w.id === id);
    if (index === -1) return false;

    this.workspaces.splice(index, 1);

    // If we deleted the active workspace, switch to first available
    if (this.activeWorkspaceId === id) {
      this.switchToWorkspace(this.workspaces[0].id);
    }

    this.saveWorkspaces();
    if (this._callbacks.renderWorkspaceTabs) {
      this._callbacks.renderWorkspaceTabs();
    }
    return true;
  },

  // Rename workspace
  renameWorkspace(id, newName) {
    const workspace = this.getWorkspace(id);
    if (workspace) {
      workspace.name = newName;
      this.saveWorkspaces();
      if (this._callbacks.renderWorkspaceTabs) {
        this._callbacks.renderWorkspaceTabs();
      }
    }
  },

  // Switch to workspace
  switchToWorkspace(id) {
    if (this.activeWorkspaceId === id) return;

    const workspace = this.getWorkspace(id);
    if (!workspace) return;

    // Save current workspace's window state (positions, etc.)
    const currentWorkspace = this.getActiveWorkspace();
    if (currentWorkspace) {
      if (this._callbacks.getWindowState) {
        currentWorkspace.windowState = this._callbacks.getWindowState();
      } else {
        currentWorkspace.windowState = this.openWindows.map(w => ({
          id: w.id,
          top: w.top,
          left: w.left,
          right: w.right,
          bottom: w.bottom,
          zIndex: w.zIndex,
        }));
      }
    }

    // Switch to new workspace
    this.activeWorkspaceId = id;

    // Trigger callback to handle the actual window switching
    if (this._callbacks.switchWorkspace) {
      this._callbacks.switchWorkspace(workspace);
    }

    this.saveWorkspaces();
    if (this._callbacks.renderWorkspaceTabs) {
      this._callbacks.renderWorkspaceTabs();
    }
  },

  // Update current workspace's window state
  updateWorkspaceApps() {
    const workspace = this.getActiveWorkspace();
    if (workspace) {
      if (this._callbacks.getWindowState) {
        workspace.windowState = this._callbacks.getWindowState();
      } else {
        workspace.windowState = this.openWindows.map(w => ({
          id: w.id,
          top: w.top,
          left: w.left,
          right: w.right,
          bottom: w.bottom,
          zIndex: w.zIndex,
        }));
      }
      this.saveWorkspaces();
    }
  },

  // Save workspaces to state
  saveWorkspaces() {
    if (this.state) {
      this.state.workspaces = this.workspaces;
      this.state.activeWorkspaceId = this.activeWorkspaceId;
      this.saveSystemState();
    }
  },

  // ============================================
  // Root State Management
  // ============================================

  // Get current root state config
  getRootState() {
    return this.rootStates[this.activeRootState];
  },

  // Check if current root state is tabular
  isTabular() {
    return this.getRootState()?.tabular ?? false;
  },

  // Get apps for current root state
  getAppsForRootState() {
    const rootState = this.getRootState();
    if (!rootState) return [];
    return this.initialWindows.filter(w => rootState.apps.includes(w.id));
  },

  // Switch root state
  setRootState(stateName) {
    if (!this.rootStates[stateName]) return;
    if (this.activeRootState === stateName) return;

    this.activeRootState = stateName;

    // Save to state
    if (this.state) {
      this.state.activeRootState = stateName;
      this.saveSystemState();
    }

    // Trigger callback
    if (this._callbacks.onRootStateChange) {
      this._callbacks.onRootStateChange(stateName);
    }
  },

  // Initialize root state from saved state
  initRootState() {
    if (this.state?.activeRootState && this.rootStates[this.state.activeRootState]) {
      this.activeRootState = this.state.activeRootState;
    }
    return this.activeRootState;
  },
};

// Create backward-compatible aliases
const system = OS;
let pinnedFiles = OS.pinnedFiles;
const togglePinFile = (path) => OS.togglePinFile(path);
const unpinFile = (path) => OS.unpinFile(path);
