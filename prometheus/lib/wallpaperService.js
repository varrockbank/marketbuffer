// Wallpaper CSS definitions - shared between KitBackground and AppWallpaper

export const wallpaperStyles = `
.wp-classic {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px);
  background-color: var(--bg-tertiary);
}

.wp-solid-gray {
  background: #808080;
}

.wp-solid-teal {
  background: #008080;
}

.wp-starfield {
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

.wp-hokusai {
  background: url('/assets/hokusai.png') center/cover no-repeat;
}

.wp-gradient-sunset {
  background: linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%);
}

.wp-checkerboard {
  background: repeating-conic-gradient(var(--border-color) 0% 25%, var(--bg-secondary) 0% 50%) 50% / 20px 20px;
}

.wp-diagonal {
  background: repeating-linear-gradient(45deg, var(--bg-tertiary), var(--bg-tertiary) 5px, var(--bg-secondary) 5px, var(--bg-secondary) 10px);
}

.wp-dots {
  background: radial-gradient(circle, var(--border-color) 1px, transparent 1px);
  background-size: 10px 10px;
  background-color: var(--bg-tertiary);
}

.wp-mac-ii {
  background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 6px 6px;
}
`;

// Smaller scale versions for thumbnails/previews
export const wallpaperPreviewStyles = `
.wp-classic {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px);
  background-color: var(--bg-tertiary);
}

.wp-solid-gray {
  background: #808080;
}

.wp-solid-teal {
  background: #008080;
}

.wp-starfield {
  background:
    radial-gradient(ellipse at center, rgba(122, 104, 170, 0.3) 0%, rgba(60, 40, 100, 0.15) 40%, transparent 70%),
    radial-gradient(1px 1px at 10px 15px, white, transparent),
    radial-gradient(1px 1px at 20px 35px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 25px 50px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 45px 20px, white, transparent),
    #0a0a1a;
}

.wp-hokusai {
  background: url('/assets/hokusai.png') center/cover no-repeat;
}

.wp-gradient-sunset {
  background: linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%);
}

.wp-checkerboard {
  background: repeating-conic-gradient(var(--border-color) 0% 25%, var(--bg-secondary) 0% 50%) 50% / 10px 10px;
}

.wp-diagonal {
  background: repeating-linear-gradient(45deg, var(--bg-tertiary), var(--bg-tertiary) 3px, var(--bg-secondary) 3px, var(--bg-secondary) 6px);
}

.wp-dots {
  background: radial-gradient(circle, var(--border-color) 1px, transparent 1px);
  background-size: 5px 5px;
  background-color: var(--bg-tertiary);
}

.wp-mac-ii {
  background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 4px 4px;
}
`;
