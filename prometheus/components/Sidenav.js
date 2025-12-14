import { store, actions } from '../store.js';
import { SidenavItem } from './SidenavItem.js';
import { UserProfile } from './UserProfile.js';

// Type-2 apps: Only shown in Applications menu, not in sidenav
const appSubmenu = [
  { id: 'simulator', label: 'Perfect Liquidity Simulator', icon: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>' },
  { id: 'wallpaper', label: 'Desktop Wallpaper', icon: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>' },
];

export const Sidenav = {
  components: { SidenavItem, UserProfile },
  template: `
    <div class="sidenav" :class="{ collapsed: store.sidenavCollapsed }">
      <div class="sidenav-menu">
        <SidenavItem
          v-for="item in menuItems"
          :key="item.id"
          :id="item.id"
          :label="item.label"
          :icon="item.icon"
          :submenu="item.submenu"
        />
      </div>
      <UserProfile />
    </div>
  `,
  setup() {
    const menuItems = [
      { id: 'applications', label: 'Applications', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', submenu: appSubmenu },
      { id: 'yap', label: 'Yap', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
      { id: 'deployments', label: 'Deployments', icon: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>' },
      { id: 'data', label: 'Data', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>' },
      { id: 'stream', label: 'Stream', icon: '<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>' },
      { id: 'code', label: 'Code', icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
      { id: 'publish', label: 'Publish', icon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>' },
      { id: 'simulate', label: 'Simulate', icon: '<polygon points="6 3 20 12 6 21 6 3"/>' },
      { id: 'agents', label: 'Agents', icon: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>' },
    ];

    return { store, actions, menuItems };
  },
};
