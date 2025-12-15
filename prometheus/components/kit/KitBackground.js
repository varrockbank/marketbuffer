import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-background {
  flex: 1;
  position: relative;
  background: var(--bg-primary);
  overflow: hidden;
}

.kit-background.show-grid {
  background-image:
    linear-gradient(to right, var(--border-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-color) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Wallpapers */
.kit-background.wp-classic {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px);
  background-color: var(--bg-tertiary);
}

.kit-background.wp-solid-gray {
  background: #808080;
}

.kit-background.wp-solid-teal {
  background: #008080;
}

.kit-background.wp-starfield {
  background:
    radial-gradient(ellipse at center, rgba(122, 104, 170, 0.3) 0%, rgba(60, 40, 100, 0.15) 40%, transparent 70%),
    radial-gradient(1px 1px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 160px 120px, white, transparent),
    #0a0a1a;
  background-size: 100% 100%, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 100% 100%;
}

.kit-background.wp-hokusai {
  background: url('../assets/hokusai.png') center/cover no-repeat;
}

.kit-background.wp-gradient-sunset {
  background: linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%);
}

.kit-background.wp-checkerboard {
  background: repeating-conic-gradient(var(--border-color) 0% 25%, var(--bg-secondary) 0% 50%) 50% / 20px 20px;
}

.kit-background.wp-diagonal {
  background: repeating-linear-gradient(45deg, var(--bg-tertiary), var(--bg-tertiary) 5px, var(--bg-secondary) 5px, var(--bg-secondary) 10px);
}

.kit-background.wp-dots {
  background: radial-gradient(circle, var(--border-color) 1px, transparent 1px);
  background-size: 10px 10px;
  background-color: var(--bg-tertiary);
}

.kit-background.wp-mac-ii {
  background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 6px 6px;
}
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
    <div class="kit-background" :class="[wallpaper ? 'wp-' + wallpaper : '', { 'show-grid': showGrid }]">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-background', styles);
  },
};
