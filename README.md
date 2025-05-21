# Nix Expression Copier for Chrome Extensions

A Chrome extension that copies extension ID and title as a Nix expression format.

## Features

- Works on Chrome Web Store extension pages
- Adds a button to the page for easy copying
- Provides a popup interface when clicking the extension icon
- Formats the extension ID and title as a Nix expression: `{ id = "extension-id"; } # Extension Title`

## Installation

Since this extension is not published to the Chrome Web Store, you'll need to install it in developer mode:

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

You can also use the justfile to help with installation:

```bash
just install
```

## Usage

### Method 1: Using the Content Script Button

1. Navigate to a Chrome extension page on the Chrome Web Store (e.g., https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh)
2. A "Copy as Nix Expression" button will appear in the bottom-right corner of the page
3. Click the button to copy the extension ID and title as a Nix expression to your clipboard

### Method 2: Using the Popup

1. Navigate to a Chrome extension page on the Chrome Web Store
2. Click the extension icon in the Chrome toolbar
3. The popup will display the extension ID, title, and the formatted Nix expression
4. Click the "Copy Nix Expression" button to copy the formatted text to your clipboard

### Supported URL Format

The extension works with the Chrome Web Store URL format:
- `https://chromewebstore.google.com/detail/[extension-name]/[extension-id]`

## Example Output

```
{ id = "eimadpbcbfnmbkopoojfekhnkhdbieeh"; } # Dark Reader
```

## Limitations

- Due to Chrome's security restrictions, the extension cannot directly access the chrome://extensions page
- For chrome://extensions pages, use the Chrome Web Store page of the extension instead

## Development

This project uses a justfile for common development tasks. Make sure you have [just](https://github.com/casey/just) installed.

Available commands:

```bash
# List all available commands
just

# Package the extension into a tarball
just package

# Clean up build artifacts
just clean

# Bump version (major, minor, or patch)
just bump-version [major|minor|patch]

# Open Chrome extensions page for installation
just install
```

## License

MIT
