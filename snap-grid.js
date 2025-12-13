// Snap Grid - Shared grid overlay and snapping utilities
const SnapGrid = {
  // Get grid size from system state
  getGridSize() {
    return (window.systemState && window.systemState.gridSize) || 50;
  },

  // Snap a value to the grid
  snap(value, gridSize = null) {
    const size = gridSize || this.getGridSize();
    return Math.round(value / size) * size;
  },

  // Show the grid overlay
  show(options = {}) {
    const {
      gridSize = this.getGridSize(),
      excludeElement = null,
      container = document.getElementById('desktop'),
    } = options;

    let overlay = document.getElementById('snap-grid-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'snap-grid-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
      `;
      container.appendChild(overlay);
    }

    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.backgroundImage = `
      linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
    `;
    overlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    overlay.style.display = 'block';

    // Ensure excluded element stays above overlay
    if (excludeElement) {
      excludeElement.style.zIndex = 10000;
    }

    return overlay;
  },

  // Hide the grid overlay
  hide() {
    const overlay = document.getElementById('snap-grid-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },
};
