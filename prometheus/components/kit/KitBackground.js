import { useStyles } from '../../lib/useStyles.js';
import { wallpaperStyles } from '../../lib/wallpaperService.js';

// Keep CSS for ::before pseudo-element (grid) and dynamic wallpaper classes
const styles = `
.kit-background.show-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--border-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-color) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* Wallpapers - scoped to .kit-background */
${wallpaperStyles.replace(/^\.wp-/gm, '.kit-background.wp-')}
`;

/**
 * KitBackground - Desktop background with wallpaper support.
 * Props:
 *   wallpaper - Wallpaper name (classic, solid-gray, solid-teal, starfield, hokusai, gradient-sunset, checkerboard, diagonal, dots, mac-ii)
 *   showGrid  - Show alignment grid overlay
 */
export const KitBackground = {
  props: {
    wallpaper: { type: String, default: null },
    showGrid: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-background flex-1 relative overflow-hidden bg-[var(--bg-primary)]" :class="[wallpaper ? 'wp-' + wallpaper : '', { 'show-grid': showGrid }]">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-background', styles);
  },
};
