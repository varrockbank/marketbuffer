# Marketbuffer OS

A retro Mac-inspired web desktop environment.

## Architecture

### Single Instance per App

Each card/app/window has exactly one instance. When a user opens an app that's already running, the existing instance is brought to front rather than creating a new one. This applies to all apps including the Editor.

### Apps (cards/)

Apps are self-contained modules in the `cards/` directory. Each app owns:
- Its own rendering logic
- Its own state management
- Its own event handling

The OS core (`index.html`) provides window management (position, z-index, focus) but delegates content rendering to each app's `render()` method.

### File Opening API

The OS provides `system.openFile(path)` which routes files to the appropriate app based on extension. The extension-to-app mapping is defined in `fileHandlers` in index.html.

## Version Management

The version number is defined in `default-state.json` - this is the single source of truth.

**Important:** Bump the version in `default-state.json` when making changes to core logic in `index.html`. This ensures users with cached localStorage state get a fresh state when the OS logic changes.

When the version changes, returning users will have their localStorage cleared and state reset to defaults.

## Changelog

When making changes, always update:
1. `changelog.md` - Add new version section with changes
2. `default-state.json` - Bump the version number

## Code Style

- Always use trailing commas in arrays and objects
