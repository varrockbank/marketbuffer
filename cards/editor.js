// Editor App Card - Self-contained application module
const editorCard = {
  id: 'editor',
  title: 'Editor',
  tabbed: true,
  draggable: false,
  closeable: true,
  zIndex: 50,
  top: 20,
  left: 20,
  right: 20,
  bottom: 20,

  // State
  paneIdCounter: 1,
  focusedPaneId: null,
  paneRegistry: {},
  splitIdCounter: 0,
  tabs: [
    { id: 'tab-1', name: 'Tab 1', activePane: 'pane-1', panes: { id: 'pane-1', title: 'Pane 1' } }
  ],
  activeTab: 0,

  contextMenu: [
    { label: 'Split Vertical', action: 'split-vertical' },
    { label: 'Split Horizontal', action: 'split-horizontal' },
    { label: 'Close Pane', action: 'close-pane' },
    { label: 'Close', action: 'close' }
  ],

  // CSS styles for this app
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

    .pane-title {
      position: absolute;
      top: -12px;
      left: 4px;
      font-size: 9px;
      background: var(--window-bg);
      padding: 0 4px;
      color: var(--text-muted);
    }

    .pane-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .pane-content .playground.wb {
      flex: none;
      height: auto;
      border: none;
    }

    .pane-split {
      flex: 1;
      display: flex;
    }

    .pane-split-vertical {
      flex-direction: column;
    }

    .pane-split-horizontal {
      flex-direction: row;
    }
  `,

  // Default theme
  theme: 'light',

  // ============================================
  // Lifecycle methods
  // ============================================

  init(system) {
    this.theme = system?.state?.theme || 'light';
    // Restore state from window object if available
    const win = this.getWindow();
    if (win) {
      this.tabs = win.tabs || this.tabs;
      this.activeTab = win.activeTab || 0;
      if (win.tabs && win.tabs[this.activeTab]) {
        this.focusedPaneId = win.tabs[this.activeTab].activePane;
      }
    }
  },

  // Initialize default tab state for a window (called by OS when opening)
  initDefaultTab(win) {
    const defaultPaneId = this.generatePaneId();
    win.tabs = [{
      id: 'tab-1',
      name: 'Tab 1',
      activePane: defaultPaneId,
      panes: { id: defaultPaneId, title: 'Pane 1', content: this.generateEditorHtml(defaultPaneId) }
    }];
    win.activeTab = 0;
    this.focusedPaneId = defaultPaneId;
    // Sync internal state
    this.tabs = win.tabs;
    this.activeTab = win.activeTab;
  },

  destroy() {
    // Cleanup all editors
    Object.keys(this.paneRegistry).forEach(paneId => {
      delete this.paneRegistry[paneId];
    });
  },

  boot() {
    // Nothing on boot
  },

  handleClick(e) {
    // Event delegation handled in setupEventListeners
  },

  // ============================================
  // Rendering
  // ============================================

  render(win) {
    // Reset split counter for this render
    this.splitIdCounter = 0;

    // Render tabs
    const activeTab = win.activeTab || 0;
    const tabsHtml = win.tabs.map((tab, i) => {
      const isFirst = i === 0 && win.closeable;
      const classes = `tabbed-window-tab ${i === activeTab ? 'active' : ''} ${isFirst ? 'first-tab-with-close' : ''}`;
      return `<div class="${classes}" data-tab-index="${i}">${tab.name}<span class="tab-close" data-tab-index="${i}">&times;</span></div>`;
    }).join('');

    // Close button for closeable tabbed windows
    const closeBoxHtml = win.closeable
      ? `<div class="close-box tabbed-close-box" data-window-id="${win.id}"></div>`
      : '';

    // Render panes for ALL tabs (hidden unless active)
    const allTabPanesHtml = win.tabs.map((tab, tabIdx) => {
      const panesHtml = tab.panes ? this.renderPanes(tab.panes) : '';
      const isActive = tabIdx === activeTab ? 'active' : '';
      return `<div class="tab-pane-container ${isActive}" data-tab-index="${tabIdx}">${panesHtml}</div>`;
    }).join('');

    return `
      <div class="tabbed-window-inner">
        <div class="tabbed-window-tabs" id="tabbed-tabs">
          ${closeBoxHtml}
          ${tabsHtml}
          <div class="tabbed-window-tab-add" id="add-tab">+</div>
        </div>
        <div class="tabbed-window-content" id="tabbed-content">
          ${allTabPanesHtml}
        </div>
      </div>
    `;
  },

  renderPanes(pane) {
    if (pane.direction) {
      // Split pane - children are in multiple pane mode
      const splitId = `split-${this.splitIdCounter++}`;
      const dirClass = pane.direction === 'vertical' ? 'pane-split-vertical' : 'pane-split-horizontal';
      const childrenHtml = pane.children.map(child => this.renderPanes(child, true, splitId)).join('');
      return `<div class="pane-split ${dirClass}" data-split-id="${splitId}">${childrenHtml}</div>`;
    } else {
      // Leaf pane - check if multiple panes exist
      const isMultiple = arguments[1] || false;
      const parentSplitId = arguments[2] || null;
      const multiClass = isMultiple ? 'pane-multi' : '';
      const focusedClass = isMultiple && pane.id === this.focusedPaneId ? 'focused' : '';
      const titleHtml = isMultiple && pane.title ? `<div class="pane-title">${pane.title}</div>` : '';
      const parentAttr = parentSplitId ? `data-parent-split="${parentSplitId}"` : '';
      const content = pane.content || this.generateEditorHtml(pane.id);
      return `<div class="pane ${multiClass} ${focusedClass}" data-pane-id="${pane.id}" ${parentAttr}>${titleHtml}<div class="pane-content">${content}</div></div>`;
    }
  },

  renderActiveTabPanes() {
    const win = this.getWindow();
    if (!win) return;

    const activeTab = win.activeTab || 0;
    const tab = win.tabs[activeTab];
    if (!tab) return;

    const container = document.querySelector(`.tab-pane-container[data-tab-index="${activeTab}"]`);
    if (!container) return;

    // Re-render only this tab's panes
    this.splitIdCounter = 0;
    const panesHtml = tab.panes ? this.renderPanes(tab.panes) : '';
    container.innerHTML = panesHtml;

    // Re-attach pane click handlers for this container
    this.attachPaneClickHandlers(container);

    // Initialize any new editors
    this.initializeEditors();
  },

  // ============================================
  // Editor HTML and initialization
  // ============================================

  generateEditorHtml(paneId) {
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

  initializeEditors() {
    const self = this;
    // Defer initialization to ensure DOM is fully laid out
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('[id^="editor-pane-"]').forEach(editorEl => {
          if (editorEl.dataset.wbInitialized) return;

          const paneId = editorEl.id.replace('editor-', '');
          if (typeof WarrenBuf !== 'undefined') {
            editorEl.dataset.wbInitialized = 'true';
            self.paneRegistry[paneId] = {
              id: paneId,
              editorId: editorEl.id,
              editor: new WarrenBuf(editorEl, {})
            };
            // Apply current theme to new editor
            if (self.theme === 'dark') {
              editorEl.classList.add('wb-dark');
            }
          }
        });
      }, 0);
    });
  },

  // ============================================
  // Event handling
  // ============================================

  setupEventListeners() {
    const self = this;
    const tabbedWin = document.getElementById('tabbed-window');
    if (!tabbedWin) return;

    // Bring to front on mousedown
    tabbedWin.addEventListener('mousedown', (e) => {
      if (e.target.closest('.close-box')) return;
      if (typeof bringTabbedToFront === 'function') {
        bringTabbedToFront();
      }
    });

    // Close box handler for tabbed window
    const closeBox = tabbedWin.querySelector('.close-box');
    if (closeBox) {
      closeBox.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        const windowId = closeBox.dataset.windowId;
        if (typeof closeWindow === 'function') {
          closeWindow(windowId);
        }
      }, true);
      closeBox.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
      }, true);
    }

    // Tab click handlers
    document.querySelectorAll('.tabbed-window-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) return;
        const tabIndex = parseInt(tab.dataset.tabIndex);
        self.switchTab(tabIndex);
      });
    });

    // Tab close button handlers
    document.querySelectorAll('.tab-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tabIndex = parseInt(closeBtn.dataset.tabIndex);
        self.closeTab(tabIndex);
      });
    });

    // Add tab button
    const addBtn = document.getElementById('add-tab');
    if (addBtn) {
      addBtn.addEventListener('click', () => self.addTab());
    }

    // Pane click handlers
    this.attachPaneClickHandlers(tabbedWin);
  },

  attachPaneClickHandlers(container) {
    const self = this;
    container.querySelectorAll('.pane').forEach(pane => {
      pane.addEventListener('click', (e) => {
        e.stopPropagation();
        const paneId = pane.dataset.paneId;
        self.focusPane(paneId);
      });
    });
  },

  // ============================================
  // Tab management
  // ============================================

  switchTab(tabIndex) {
    const win = this.getWindow();
    if (!win) return;

    win.activeTab = tabIndex;
    const tab = win.tabs[tabIndex];

    // Restore focusedPaneId from the tab's activePane
    if (tab && tab.activePane) {
      this.focusedPaneId = tab.activePane;
    } else if (tab && tab.panes) {
      const firstLeaf = this.findFirstLeafPane(tab.panes);
      this.focusedPaneId = firstLeaf ? firstLeaf.id : null;
    }

    this.saveState();

    // Update tab UI without re-rendering
    document.querySelectorAll('.tabbed-window-tab').forEach(tabEl => {
      const idx = parseInt(tabEl.dataset.tabIndex);
      tabEl.classList.toggle('active', idx === tabIndex);
    });

    // Toggle pane container visibility
    document.querySelectorAll('.tab-pane-container').forEach(container => {
      const idx = parseInt(container.dataset.tabIndex);
      container.classList.toggle('active', idx === tabIndex);
    });

    // Update pane focus styling
    document.querySelectorAll('.pane-multi').forEach(p => {
      p.classList.toggle('focused', p.dataset.paneId === this.focusedPaneId);
    });

    // Focus the editor element
    if (this.focusedPaneId) {
      const editorEl = document.getElementById(`editor-${this.focusedPaneId}`);
      if (editorEl) editorEl.focus();
    }

    // Highlight the file in the file tree
    if (tab && tab.filePath && typeof highlightFileInTree === 'function') {
      highlightFileInTree(tab.filePath);
    }
  },

  addTab() {
    const win = this.getWindow();
    if (!win) return;

    const newIndex = win.tabs.length;
    const newPaneId = this.generatePaneId();

    win.tabs.push({
      id: `tab-${newIndex + 1}`,
      name: `Tab ${newIndex + 1}`,
      activePane: newPaneId,
      panes: { id: newPaneId, title: `Pane ${this.paneIdCounter}`, content: this.generateEditorHtml(newPaneId) }
    });
    win.activeTab = newIndex;
    this.focusedPaneId = newPaneId;

    this.saveState();

    if (typeof renderWindows === 'function') {
      renderWindows();
    }
  },

  async closeTab(tabIndex) {
    const win = this.getWindow();
    if (!win) return;

    const closingTab = win.tabs[tabIndex];

    // Clean up editor from registry
    if (closingTab && closingTab.activePane) {
      delete this.paneRegistry[closingTab.activePane];
    }

    // Remove from data model
    win.tabs.splice(tabIndex, 1);

    // If no tabs left, close the editor window
    if (win.tabs.length === 0) {
      if (typeof closeWindow === 'function') {
        closeWindow(win.id);
      }
      return;
    }

    // DOM: Remove the tab element
    const tabEl = document.querySelector(`.tabbed-window-tab[data-tab-index="${tabIndex}"]`);
    if (tabEl) tabEl.remove();

    // DOM: Remove the pane container
    const paneContainer = document.querySelector(`.tab-pane-container[data-tab-index="${tabIndex}"]`);
    if (paneContainer) paneContainer.remove();

    // Update data-tab-index for remaining tabs and containers
    document.querySelectorAll('.tabbed-window-tab').forEach(t => {
      const idx = parseInt(t.dataset.tabIndex);
      if (idx > tabIndex) {
        t.dataset.tabIndex = idx - 1;
        const closeBtn = t.querySelector('.tab-close');
        if (closeBtn) closeBtn.dataset.tabIndex = idx - 1;
      }
    });
    document.querySelectorAll('.tab-pane-container').forEach(c => {
      const idx = parseInt(c.dataset.tabIndex);
      if (idx > tabIndex) {
        c.dataset.tabIndex = idx - 1;
      }
    });

    // Determine new active tab
    let newActiveTab;
    if (win.activeTab >= win.tabs.length) {
      newActiveTab = win.tabs.length - 1;
    } else if (win.activeTab > tabIndex) {
      newActiveTab = win.activeTab - 1;
    } else if (win.activeTab === tabIndex) {
      newActiveTab = Math.min(tabIndex, win.tabs.length - 1);
    } else {
      newActiveTab = win.activeTab;
    }

    win.activeTab = newActiveTab;
    const newTab = win.tabs[newActiveTab];
    if (newTab) {
      this.focusedPaneId = newTab.activePane;
    }

    // DOM: Update active states
    document.querySelectorAll('.tabbed-window-tab').forEach(t => {
      t.classList.toggle('active', parseInt(t.dataset.tabIndex) === newActiveTab);
    });
    document.querySelectorAll('.tab-pane-container').forEach(c => {
      c.classList.toggle('active', parseInt(c.dataset.tabIndex) === newActiveTab);
    });

    this.saveState();

    // Reload content for the now-active tab if it has a file
    if (newTab && newTab.filePath) {
      await this.loadFileContent(newTab);
      if (typeof highlightFileInTree === 'function') {
        highlightFileInTree(newTab.filePath);
      }
    }

    // Focus the editor
    if (this.focusedPaneId) {
      const editorEl = document.getElementById(`editor-${this.focusedPaneId}`);
      if (editorEl) editorEl.focus();
    }
  },

  // ============================================
  // Pane management
  // ============================================

  focusPane(paneId) {
    this.focusedPaneId = paneId;

    // Save to the current tab's activePane
    const win = this.getWindow();
    if (win) {
      const activeTab = win.activeTab || 0;
      const tab = win.tabs[activeTab];
      if (tab) {
        tab.activePane = paneId;
        this.saveState();
      }
    }

    // Update UI without full re-render
    document.querySelectorAll('.pane-multi').forEach(p => {
      p.classList.toggle('focused', p.dataset.paneId === paneId);
    });
  },

  splitPane(direction) {
    const win = this.getWindow();
    if (!win || !win.tabbed) return;

    const activeTab = win.activeTab || 0;
    const tab = win.tabs[activeTab];
    if (!tab || !tab.panes) return;

    // Check pane limit (8 per tab)
    const tabPanes = [];
    this.collectPaneIds(tab.panes, tabPanes);
    if (tabPanes.length >= 8) {
      this.showUpgradeAlert();
      return;
    }

    // If no pane is focused, focus the first leaf pane
    if (!this.focusedPaneId) {
      const firstLeaf = this.findFirstLeafPane(tab.panes);
      if (firstLeaf) this.focusedPaneId = firstLeaf.id;
    }

    if (!this.focusedPaneId) return;

    // Find the focused pane element in DOM
    const paneEl = document.querySelector(`.pane[data-pane-id="${this.focusedPaneId}"]`);
    if (!paneEl) return;

    // Find the focused pane data
    const focusedPane = this.findPaneById(tab.panes, this.focusedPaneId);
    if (!focusedPane) return;

    // Generate new pane
    const newPaneId = this.generatePaneId();
    const newPaneTitle = `Pane ${this.paneIdCounter}`;
    const newPane = { id: newPaneId, title: newPaneTitle, content: this.generateEditorHtml(newPaneId) };

    // Update data model
    const replacement = {
      direction: direction,
      children: [
        { ...focusedPane },
        newPane
      ]
    };
    const result = this.findAndReplacePaneById(tab.panes, this.focusedPaneId, replacement);
    tab.panes = result.result;

    // DOM manipulation - create split container
    const splitId = `split-${this.splitIdCounter++}`;
    const splitEl = document.createElement('div');
    splitEl.className = `pane-split pane-split-${direction}`;
    splitEl.dataset.splitId = splitId;

    // Check if we're going from single pane to multiple
    const wasMultiple = paneEl.classList.contains('pane-multi');

    // Insert split container before the pane
    paneEl.parentNode.insertBefore(splitEl, paneEl);

    // Move existing pane into split container
    splitEl.appendChild(paneEl);

    // Update existing pane to multi-pane style
    paneEl.classList.add('pane-multi');
    paneEl.dataset.parentSplit = splitId;
    if (!wasMultiple) {
      // Add title if it didn't have one
      const titleEl = document.createElement('div');
      titleEl.className = 'pane-title';
      titleEl.textContent = focusedPane.title || this.focusedPaneId;
      paneEl.insertBefore(titleEl, paneEl.firstChild);
    }
    paneEl.classList.remove('focused');

    // Create new pane element
    const newPaneEl = document.createElement('div');
    newPaneEl.className = 'pane pane-multi focused';
    newPaneEl.dataset.paneId = newPaneId;
    newPaneEl.dataset.parentSplit = splitId;
    newPaneEl.innerHTML = `<div class="pane-title">${newPaneTitle}</div><div class="pane-content">${this.generateEditorHtml(newPaneId)}</div>`;

    // Add click handler to new pane
    const self = this;
    newPaneEl.addEventListener('click', (e) => {
      e.stopPropagation();
      self.focusPane(newPaneId);
    });

    // Append new pane to split container
    splitEl.appendChild(newPaneEl);

    // Focus the new pane
    this.focusedPaneId = newPaneId;
    tab.activePane = newPaneId;

    this.saveState();

    // Initialize editor for new pane only
    this.initializeEditors();
  },

  closePane() {
    const win = this.getWindow();
    if (!win || !win.tabbed) return;

    const activeTab = win.activeTab || 0;
    const tab = win.tabs[activeTab];
    if (!tab || !tab.panes) return;

    // Can't close if it's the only pane (no splits)
    if (!tab.panes.direction) return;

    if (!this.focusedPaneId) {
      const firstLeaf = this.findFirstLeafPane(tab.panes);
      if (firstLeaf) this.focusedPaneId = firstLeaf.id;
    }

    if (!this.focusedPaneId) return;

    // Find the pane element to close
    const paneEl = document.querySelector(`.pane[data-pane-id="${this.focusedPaneId}"]`);
    if (!paneEl) return;

    const parentSplitId = paneEl.dataset.parentSplit;
    if (!parentSplitId) return;

    const parentSplitEl = document.querySelector(`.pane-split[data-split-id="${parentSplitId}"]`);
    if (!parentSplitEl) return;

    // Find sibling (the element that will remain)
    let siblingEl = null;
    for (const child of parentSplitEl.children) {
      if (child !== paneEl) {
        siblingEl = child;
        break;
      }
    }
    if (!siblingEl) return;

    // Clean up the editor being closed
    if (this.paneRegistry[this.focusedPaneId]) {
      delete this.paneRegistry[this.focusedPaneId];
    }

    // Update data model
    const result = this.removePaneById(tab.panes, this.focusedPaneId);
    if (!result.removed) return;
    tab.panes = result.result;

    // DOM manipulation - replace parent split with sibling
    const grandparent = parentSplitEl.parentNode;

    // Check if we're going back to single pane
    const isGoingToSingle = grandparent.classList.contains('tab-pane-container') && !siblingEl.classList.contains('pane-split');

    if (isGoingToSingle && siblingEl.classList.contains('pane')) {
      siblingEl.classList.remove('pane-multi', 'focused');
      delete siblingEl.dataset.parentSplit;
      const titleEl = siblingEl.querySelector('.pane-title');
      if (titleEl) titleEl.remove();
    }

    // Replace split with sibling
    grandparent.insertBefore(siblingEl, parentSplitEl);
    parentSplitEl.remove();

    // Focus the first remaining pane
    const firstLeaf = this.findFirstLeafPane(tab.panes);
    this.focusedPaneId = firstLeaf ? firstLeaf.id : null;
    tab.activePane = this.focusedPaneId;

    // Update focus styling
    document.querySelectorAll('.pane-multi').forEach(p => {
      p.classList.toggle('focused', p.dataset.paneId === this.focusedPaneId);
    });

    this.saveState();
  },

  highlightParentSplit(show) {
    // Remove any existing highlights
    document.querySelectorAll('.parent-highlight, .closing-highlight, .sibling-highlight').forEach(el => {
      el.classList.remove('parent-highlight', 'closing-highlight', 'sibling-highlight');
    });

    if (show && this.focusedPaneId) {
      const paneEl = document.querySelector(`.pane[data-pane-id="${this.focusedPaneId}"]`);
      if (paneEl) {
        paneEl.classList.add('closing-highlight');

        const parentSplitId = paneEl.dataset.parentSplit;
        if (parentSplitId) {
          const parentEl = document.querySelector(`.pane-split[data-split-id="${parentSplitId}"]`);
          if (parentEl) {
            parentEl.classList.add('parent-highlight');

            // Highlight sibling panes
            const siblingPanes = parentEl.querySelectorAll(`:scope > .pane[data-parent-split="${parentSplitId}"]`);
            siblingPanes.forEach(sibling => {
              if (sibling.dataset.paneId !== this.focusedPaneId) {
                sibling.classList.add('sibling-highlight');
              }
            });

            // Also check for sibling splits
            const siblingSplits = parentEl.querySelectorAll(`:scope > .pane-split`);
            siblingSplits.forEach(split => {
              split.querySelectorAll('.pane').forEach(leaf => {
                leaf.classList.add('sibling-highlight');
              });
            });
          }
        }
      }
    }
  },

  // ============================================
  // File operations (public API)
  // ============================================

  async openFile(path) {
    const fileName = path.split('/').pop();

    // Ensure the editor window is open
    let win = this.getWindow();
    if (!win) {
      OS.openWindow(this.id);
      await new Promise(resolve => setTimeout(resolve, 100));
      win = this.getWindow();
    }
    if (!win) return;

    // Check if file is already open in a tab
    const existingTabIndex = win.tabs.findIndex(tab => tab.filePath === path);
    if (existingTabIndex !== -1) {
      this.switchTab(existingTabIndex);
      return;
    }

    // Fetch file content
    const content = await this.fetchFileContent(path);

    // Check if current tab already has a file open
    const currentTab = win.tabs[win.activeTab || 0];
    const hasFileOpen = currentTab && currentTab.filePath;

    if (hasFileOpen) {
      // Open new tab via DOM manipulation
      const newPaneId = this.generatePaneId();
      const newTabIndex = win.tabs.length;

      // Update data model
      win.tabs.push({
        id: `tab-${newTabIndex + 1}`,
        name: fileName,
        filePath: path,
        activePane: newPaneId,
        panes: { id: newPaneId, title: fileName, content: this.generateEditorHtml(newPaneId) }
      });
      win.activeTab = newTabIndex;
      this.focusedPaneId = newPaneId;

      // DOM: Remove active class from current tab
      document.querySelectorAll('.tabbed-window-tab').forEach(t => t.classList.remove('active'));

      // DOM: Add new tab button before the + button
      const addBtn = document.getElementById('add-tab');
      const newTabEl = document.createElement('div');
      newTabEl.className = 'tabbed-window-tab active';
      newTabEl.dataset.tabIndex = newTabIndex;
      newTabEl.innerHTML = `${fileName}<span class="tab-close" data-tab-index="${newTabIndex}">&times;</span>`;

      const self = this;
      newTabEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-close')) {
          self.switchTab(newTabIndex);
        }
      });
      newTabEl.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        self.closeTab(newTabIndex);
      });
      addBtn.parentNode.insertBefore(newTabEl, addBtn);

      // DOM: Hide current pane container, add new one
      document.querySelectorAll('.tab-pane-container').forEach(c => c.classList.remove('active'));

      const tabbedContent = document.getElementById('tabbed-content');
      const newPaneContainer = document.createElement('div');
      newPaneContainer.className = 'tab-pane-container active';
      newPaneContainer.dataset.tabIndex = newTabIndex;
      newPaneContainer.innerHTML = `<div class="pane" data-pane-id="${newPaneId}"><div class="pane-content">${this.generateEditorHtml(newPaneId)}</div></div>`;

      newPaneContainer.querySelector('.pane').addEventListener('click', (e) => {
        e.stopPropagation();
        self.focusPane(newPaneId);
      });

      tabbedContent.appendChild(newPaneContainer);

      this.saveState();

      // Initialize the new editor and set content
      this.initializeEditors();

      // Wait for editor to be registered (RAF + setTimeout in initializeEditors)
      await new Promise(resolve => {
        const checkRegistry = () => {
          const registry = this.paneRegistry[newPaneId];
          if (registry && registry.editor && registry.editor.Model) {
            registry.editor.Model.text = content;
            resolve();
          } else {
            setTimeout(checkRegistry, 20);
          }
        };
        setTimeout(checkRegistry, 20);
      });
    } else {
      // Use current tab - update its name and file path
      currentTab.name = fileName;
      currentTab.filePath = path;
      this.saveState();

      // Update tab name in DOM
      const tabEl = document.querySelector(`.tabbed-window-tab[data-tab-index="${win.activeTab || 0}"]`);
      if (tabEl) {
        tabEl.innerHTML = `${fileName}<span class="tab-close" data-tab-index="${win.activeTab || 0}">&times;</span>`;
      }

      // Set editor content - wait for editor to be registered if needed
      const paneId = currentTab.activePane;
      await new Promise(resolve => {
        let attempts = 0;
        const checkRegistry = () => {
          attempts++;
          const registry = this.paneRegistry[paneId];
          if (registry && registry.editor && registry.editor.Model) {
            registry.editor.Model.text = content;
            resolve();
          } else if (attempts < 50) {
            setTimeout(checkRegistry, 20);
          } else {
            resolve();
          }
        };
        checkRegistry();
      });
    }

    // Highlight file in tree
    if (typeof highlightFileInTree === 'function') {
      highlightFileInTree(path);
    }
  },

  async reloadAllFiles() {
    const win = this.getWindow();
    if (!win || !win.tabs) return;

    await new Promise(resolve => setTimeout(resolve, 100));

    for (const tab of win.tabs) {
      if (tab.filePath && tab.activePane) {
        await this.loadFileContent(tab);
      }
    }

    // Highlight the active tab's file in the tree
    const activeTab = win.tabs[win.activeTab || 0];
    if (activeTab && activeTab.filePath && typeof highlightFileInTree === 'function') {
      highlightFileInTree(activeTab.filePath);
    }
  },

  async loadFileContent(tab) {
    const content = await this.fetchFileContent(tab.filePath);
    const registry = this.paneRegistry[tab.activePane];
    if (registry && registry.editor && registry.editor.Model) {
      registry.editor.Model.text = content;
    }
  },

  async fetchFileContent(path) {
    // Check cache first
    if (typeof fileContentsCache !== 'undefined' && fileContentsCache[path]) {
      return fileContentsCache[path];
    }

    try {
      const response = await fetch(path);
      if (response.ok) {
        const content = await response.text();
        if (typeof fileContentsCache !== 'undefined') {
          fileContentsCache[path] = content;
        }
        return content;
      }
      return `// Error loading file: ${path}`;
    } catch (err) {
      return `// Error loading file: ${err.message}`;
    }
  },

  // ============================================
  // Pane tree helpers
  // ============================================

  collectPaneIds(pane, ids = []) {
    if (!pane) return ids;
    if (pane.direction) {
      pane.children.forEach(child => this.collectPaneIds(child, ids));
    } else {
      ids.push(pane.id);
    }
    return ids;
  },

  getAllActivePaneIds() {
    const allIds = [];
    const win = this.getWindow();
    if (win && win.tabs) {
      win.tabs.forEach(tab => {
        if (tab.panes) {
          this.collectPaneIds(tab.panes, allIds);
        }
      });
    }
    return allIds;
  },

  generatePaneId() {
    const activeIds = this.getAllActivePaneIds();
    while (activeIds.includes(`pane-${this.paneIdCounter}`)) {
      this.paneIdCounter++;
    }
    return `pane-${this.paneIdCounter++}`;
  },

  findPaneById(pane, id) {
    if (!pane.direction) {
      return pane.id === id ? pane : null;
    }
    for (const child of pane.children) {
      const found = this.findPaneById(child, id);
      if (found) return found;
    }
    return null;
  },

  findFirstLeafPane(pane) {
    if (!pane.direction) {
      return pane;
    }
    return this.findFirstLeafPane(pane.children[0]);
  },

  findAndReplacePaneById(pane, targetId, replacement) {
    if (!pane.direction) {
      if (pane.id === targetId) {
        return { found: true, result: replacement };
      }
      return { found: false, result: pane };
    }

    let found = false;
    const newChildren = pane.children.map(child => {
      if (found) return child;
      const result = this.findAndReplacePaneById(child, targetId, replacement);
      if (result.found) {
        found = true;
        return result.result;
      }
      return result.result;
    });

    return { found, result: { ...pane, children: newChildren } };
  },

  removePaneById(pane, targetId) {
    if (!pane.direction) {
      return { removed: false, result: pane };
    }

    const targetIndex = pane.children.findIndex(child =>
      !child.direction && child.id === targetId
    );

    if (targetIndex !== -1) {
      const siblingIndex = targetIndex === 0 ? 1 : 0;
      return { removed: true, result: pane.children[siblingIndex] };
    }

    let removed = false;
    const newChildren = pane.children.map(child => {
      if (removed) return child;
      const result = this.removePaneById(child, targetId);
      if (result.removed) {
        removed = true;
        return result.result;
      }
      return result.result;
    });

    return { removed, result: { ...pane, children: newChildren } };
  },

  // ============================================
  // State helpers
  // ============================================

  stripPaneContent(pane) {
    if (pane.direction) {
      return { ...pane, children: pane.children.map(p => this.stripPaneContent(p)) };
    }
    const { content, ...rest } = pane;
    return rest;
  },

  restorePaneContent(pane) {
    if (pane.direction) {
      return { ...pane, children: pane.children.map(p => this.restorePaneContent(p)) };
    }
    return { ...pane, content: this.generateEditorHtml(pane.id) };
  },

  getWindow() {
    if (typeof OS !== 'undefined' && OS.openWindows) {
      return OS.openWindows.find(w => w.id === this.id);
    }
    return null;
  },

  saveState() {
    if (typeof saveState === 'function') {
      saveState();
    }
  },

  showUpgradeAlert() {
    if (typeof showUpgradeAlert === 'function') {
      showUpgradeAlert();
    }
  },

  // ============================================
  // Context menu actions
  // ============================================

  executeAction(action) {
    if (action === 'split-vertical') {
      this.splitPane('vertical');
    } else if (action === 'split-horizontal') {
      this.splitPane('horizontal');
    } else if (action === 'close-pane') {
      this.closePane();
    } else if (action === 'close') {
      if (typeof closeWindow === 'function') {
        closeWindow(this.id);
      }
    }
  }
};
