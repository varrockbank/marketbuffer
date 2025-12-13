// App Launcher - Mac-style app drawer
const AppLauncher = {
  // Lucide SVG icons for each app
  icons: {
    editor: '<svg viewBox="0 0 24 24"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>',
    finder: '<svg viewBox="0 0 24 24"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
    about: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    hypercard: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    git: '<svg viewBox="0 0 24 24"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    wallpaper: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    changelog: '<svg viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
    neogotchi: '<svg viewBox="0 0 24 24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    trinale: '<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    stocks: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
    simulator: '<svg viewBox="0 0 24 24"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>',
  },

  // Default icon for apps without a specific icon
  defaultIcon: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>',

  // Callbacks registered by index.html
  _callbacks: {
    getWindows: null,
    isWindowOpen: null,
    openApplication: null,
  },

  // Register callbacks from index.html
  registerCallbacks(callbacks) {
    Object.assign(this._callbacks, callbacks);
  },

  // Render the app launcher grid
  render() {
    const grid = document.getElementById('app-launcher-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const windows = this._callbacks.getWindows ? this._callbacks.getWindows() : [];

    windows.forEach(win => {
      const isOpen = this._callbacks.isWindowOpen ? this._callbacks.isWindowOpen(win.id) : false;
      const item = document.createElement('div');
      item.className = `app-launcher-item ${isOpen ? 'active' : ''}`;
      item.dataset.windowId = win.id;

      const icon = document.createElement('div');
      icon.className = 'app-launcher-icon';
      icon.innerHTML = this.icons[win.id] || this.defaultIcon;

      const label = document.createElement('div');
      label.className = 'app-launcher-label';
      label.textContent = win.title;

      item.appendChild(icon);
      item.appendChild(label);

      item.addEventListener('click', () => {
        if (this._callbacks.openApplication) {
          this._callbacks.openApplication(win.id);
        }
        this.close();
      });

      grid.appendChild(item);
    });
  },

  // Toggle the launcher open/closed
  toggle() {
    const launcher = document.getElementById('app-launcher');
    if (!launcher) return;

    const isOpen = launcher.classList.contains('open');
    if (isOpen) {
      this.close();
    } else {
      this.render();
      launcher.classList.add('open');
      // Wait for animation to complete before checking overflow
      setTimeout(() => {
        this.checkOverflow();
        this.setupScrollListener();
      }, 500);
    }
  },

  // Close the launcher
  close() {
    const launcher = document.getElementById('app-launcher');
    if (launcher) {
      launcher.classList.remove('open');
    }
    const leftIndicator = document.getElementById('app-launcher-overflow-left');
    const rightIndicator = document.getElementById('app-launcher-overflow-right');
    if (leftIndicator) leftIndicator.classList.remove('visible');
    if (rightIndicator) rightIndicator.classList.remove('visible');
  },

  // Check if there's overflow and show/hide indicators
  checkOverflow() {
    const launcher = document.getElementById('app-launcher');
    const leftIndicator = document.getElementById('app-launcher-overflow-left');
    const rightIndicator = document.getElementById('app-launcher-overflow-right');
    if (!launcher) return;

    const hasOverflow = launcher.scrollWidth > launcher.clientWidth;
    const isScrolledToStart = launcher.scrollLeft <= 10;
    const isScrolledToEnd = launcher.scrollLeft + launcher.clientWidth >= launcher.scrollWidth - 10;

    const rect = launcher.getBoundingClientRect();
    const topPos = (rect.top + rect.height / 2 - 24) + 'px';

    // Left indicator (show when scrolled right)
    if (leftIndicator) {
      if (hasOverflow && !isScrolledToStart) {
        leftIndicator.style.top = topPos;
        leftIndicator.classList.add('visible');
      } else {
        leftIndicator.classList.remove('visible');
      }
    }

    // Right indicator (show when more content on right)
    if (rightIndicator) {
      if (hasOverflow && !isScrolledToEnd) {
        rightIndicator.style.top = topPos;
        rightIndicator.classList.add('visible');
      } else {
        rightIndicator.classList.remove('visible');
      }
    }
  },

  // Setup scroll listener
  setupScrollListener() {
    const launcher = document.getElementById('app-launcher');
    if (!launcher) return;

    launcher.addEventListener('scroll', () => this.checkOverflow());

    // Click left indicator to scroll left
    const leftIndicator = document.getElementById('app-launcher-overflow-left');
    if (leftIndicator) {
      leftIndicator.onclick = (e) => {
        e.stopPropagation();
        launcher.scrollBy({ left: -200, behavior: 'smooth' });
      };
    }

    // Click right indicator to scroll right
    const rightIndicator = document.getElementById('app-launcher-overflow-right');
    if (rightIndicator) {
      rightIndicator.onclick = (e) => {
        e.stopPropagation();
        launcher.scrollBy({ left: 200, behavior: 'smooth' });
      };
    }
  },

  // Check if launcher is open
  isOpen() {
    const launcher = document.getElementById('app-launcher');
    return launcher ? launcher.classList.contains('open') : false;
  },
};
