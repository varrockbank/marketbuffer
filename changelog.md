# Changelog

## 0.4.0-alpha.2 - December 2, 2025
- Workspaces now preserve window positions when switching tabs
- Window state (position, size, tabs) restored when returning to a workspace

## 0.4.0-alpha.1 - December 2, 2025
- Added workspaces feature with multiple tabs
- Each workspace maintains its own set of open windows
- Click + button to create new workspace
- Click tabs to switch between workspaces
- Workspace state persists in localStorage

## 0.3.0-alpha.6 - December 2, 2025
- Terminal prompt is now part of flex layout instead of floating
- Desktop viewport and terminal prompt share space properly
- Sidebar toggle with animated collapse/expand

## 0.3.0-alpha.5 - December 2, 2025
- Refactored window management logic into os.js module
- Added sidebar toggle button (<<<) with animation
- Fixed settings content height issue

## 0.3.0-alpha.4 - December 2, 2025
- Added Stocks app with Historical and Live tabs
- Live tab integrates with Alpaca API for real-time intraday data
- Candlestick charts with configurable candle sizes (1m, 5m, 15m, 30m, 1h)
- Zoom controls for chart viewing
- Scrollable charts with dynamic Y-axis scaling
- Pin stocks to sidebar for quick access
- Added Window Management settings section
- Snap to Grid feature for window dragging
- Configurable grid size (10-80px) with live preview overlay

## 0.3.0-alpha.3 - November 29, 2025
- Added Tamagotchi virtual pet app
- Added Triple Triad card game

## 0.3.0-alpha.2 - November 29, 2025
- Added Release Notes app with WarrenBuf editor
- Added system.close() API for unified window closing
- Added "Close All Windows" option in Applications menu
- Fixed window close from context menu
- Empty window state now persists on refresh
- Logout menu shows demo alert
- Default windows on fresh load (editor, about) instead of all apps

## 0.3.0-alpha.1 - October 28, 2025
- Added AI terminal prompt at bottom of screen
- Terminal expands on focus with smooth animation
- Help menu now demonstrates terminal usage
- Improved terminal styling and colors

## 0.2.5 - October 27, 2025
- Added terminal application
- Support for basic shell commands
- Command history with arrow keys

## 0.2.4 - October 26, 2025
- Major refactor: apps are now self-contained modules
- Each app owns its own rendering and state
- Added OS file opening API with extension mapping

## 0.2.3 - October 23, 2025
- Cards are now modularized in separate files
- Improved code organization

## 0.2.2 - October 22, 2025
- Added wallpaper settings app
- Choose from multiple desktop backgrounds

## 0.2.1 - September 21, 2025
- Added font size setting (small, medium, large)

## 0.2.0 - September 19, 2025
- Added settings app
- Light and dark mode support

## 0.1.5 - September 18, 2025
- Performance: only repaint focused window

## 0.1.4 - September 17, 2025
- Added demo Git app with diff viewer

## 0.1.3 - September 16, 2025
- Fixed editor content restoration on load
- Fixed bug with tab contents disappearing

## 0.1.2 - September 15, 2025
- Added mock directory files
- Load files into editor on click

## 0.1.1 - September 14, 2025
- Added sidebar with file explorer

## 0.1.0 - September 13, 2025
- Added text editor to panes
- Basic code editing support

## 0.0.5 - September 12, 2025
- Close pane functionality
- Visual indication of sibling takeover

## 0.0.4 - September 11, 2025
- Recursively splittable panes in tabs

## 0.0.3 - September 10, 2025
- Tab closing support
- Window and tab state persistence in localStorage

## 0.0.2 - September 09, 2025
- Added tabbed windows
- Application launching support

## 0.0.1 - September 08, 2025
- Basic window management

## 0.0.0 - September 07, 2025
- Initial release
- Skeleton website structure
