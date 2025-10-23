// Wallpaper App Card - Self-contained application module
const wallpaperCard = {
  id: 'wallpaper',
  title: 'Desktop Wallpaper',
  draggable: true,
  closeable: true,
  zIndex: 105,
  top: 100,
  right: 250,
  width: 320,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // HTML content
  content: `
    <div class="wallpaper-content">
      <div class="wallpaper-grid" id="wallpaper-grid">
        <div class="wallpaper-option wp-classic" data-wallpaper="classic" title="Classic"></div>
        <div class="wallpaper-option wp-solid-gray" data-wallpaper="solid-gray" title="Solid Gray"></div>
        <div class="wallpaper-option wp-solid-teal" data-wallpaper="solid-teal" title="Solid Teal"></div>
        <div class="wallpaper-option wp-solid-navy" data-wallpaper="solid-navy" title="Solid Navy"></div>
        <div class="wallpaper-option wp-gradient-blue" data-wallpaper="gradient-blue" title="Blue Sky"></div>
        <div class="wallpaper-option wp-gradient-sunset" data-wallpaper="gradient-sunset" title="Sunset"></div>
        <div class="wallpaper-option wp-checkerboard" data-wallpaper="checkerboard" title="Checkerboard"></div>
        <div class="wallpaper-option wp-diagonal" data-wallpaper="diagonal" title="Diagonal"></div>
        <div class="wallpaper-option wp-dots" data-wallpaper="dots" title="Dots"></div>
        <div class="wallpaper-option wp-mac-ii" data-wallpaper="mac-ii" title="Mac II Dither"></div>
        <div class="wallpaper-option wp-hokusai" data-wallpaper="hokusai" title="Hokusai"></div>
      </div>
    </div>
  `,

  // CSS styles for this app
  styles: `
    .wallpaper-content {
      padding: 12px;
      background: var(--window-bg);
    }

    .wallpaper-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .wallpaper-option {
      width: 100%;
      aspect-ratio: 4/3;
      border: 2px solid var(--window-border);
      cursor: pointer;
      position: relative;
    }

    .wallpaper-option:hover {
      border-color: var(--text-color);
    }

    .wallpaper-option.selected {
      border-color: teal;
      border-width: 3px;
    }

    .wallpaper-option.selected::after {
      content: '✓';
      position: absolute;
      top: 2px;
      right: 4px;
      color: teal;
      font-weight: bold;
    }

    /* Wallpaper patterns */
    .wp-classic {
      background:
        repeating-linear-gradient(0deg, transparent, transparent 1px, var(--bg-color) 1px, var(--bg-color) 2px),
        repeating-linear-gradient(90deg, transparent, transparent 1px, var(--bg-color) 1px, var(--bg-color) 2px);
      background-color: var(--bg-color);
    }

    .wp-solid-gray { background: #808080; }
    .wp-solid-teal { background: #008080; }
    .wp-solid-navy { background: #000080; }
    .wp-gradient-blue { background: linear-gradient(180deg, #87CEEB 0%, #4682B4 100%); }
    .wp-gradient-sunset { background: linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%); }
    .wp-checkerboard {
      background: repeating-conic-gradient(var(--window-border) 0% 25%, var(--window-bg) 0% 50%) 50% / 20px 20px;
    }
    .wp-diagonal {
      background: repeating-linear-gradient(45deg, var(--bg-color), var(--bg-color) 5px, var(--window-bg) 5px, var(--window-bg) 10px);
    }
    .wp-dots {
      background: radial-gradient(circle, var(--window-border) 1px, transparent 1px);
      background-size: 10px 10px;
      background-color: var(--bg-color);
    }
    .wp-mac-ii {
      background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 6px 6px;
    }
    .wp-hokusai {
      background: url('assets/hokusai.png') center/cover no-repeat;
    }
  `,

  // Storage key
  STORAGE_KEY: 'marketbuffer_wallpaper',

  // All available wallpaper classes
  wallpaperClasses: [
    'wp-classic', 'wp-solid-gray', 'wp-solid-teal', 'wp-solid-navy',
    'wp-gradient-blue', 'wp-gradient-sunset', 'wp-checkerboard',
    'wp-diagonal', 'wp-dots', 'wp-mac-ii', 'wp-hokusai'
  ],

  // Default wallpaper
  defaultWallpaper: 'hokusai',

  // Apply wallpaper to desktop
  applyWallpaper(wallpaper) {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    // Remove all wallpaper classes
    this.wallpaperClasses.forEach(cls => desktop.classList.remove(cls));
    // Add the selected one
    desktop.classList.add('wp-' + wallpaper);

    // Update selection UI if wallpaper picker is open
    this.updateSelectionUI(wallpaper);
  },

  updateSelectionUI(wallpaper) {
    document.querySelectorAll('.wallpaper-option').forEach(opt => {
      opt.classList.remove('selected');
      if (opt.dataset.wallpaper === wallpaper) {
        opt.classList.add('selected');
      }
    });
  },

  loadWallpaper() {
    const savedWallpaper = localStorage.getItem(this.STORAGE_KEY) || this.defaultWallpaper;
    this.applyWallpaper(savedWallpaper);
  },

  saveWallpaper(wallpaper) {
    localStorage.setItem(this.STORAGE_KEY, wallpaper);
  },

  // Called when app window is opened
  init() {
    const savedWallpaper = localStorage.getItem(this.STORAGE_KEY) || this.defaultWallpaper;
    this.updateSelectionUI(savedWallpaper);
  },

  // Called when app window is closed
  destroy() {
    // Cleanup if needed
  },

  // Event handlers
  handleClick(e) {
    const wallpaperOption = e.target.closest('.wallpaper-option');
    if (wallpaperOption && wallpaperOption.dataset.wallpaper) {
      const wallpaper = wallpaperOption.dataset.wallpaper;
      this.applyWallpaper(wallpaper);
      this.saveWallpaper(wallpaper);
    }
  },

  // Boot - called once when OS starts
  boot() {
    this.loadWallpaper();
  }
};
