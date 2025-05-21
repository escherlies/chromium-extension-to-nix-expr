# Justfile for Nix Expression Copier Chrome Extension

# List available commands
default:
    @just --list

# Package the extension into a tarball
package:
    tar -czf nix-expression-copier.tar.gz manifest.json content.js background.js popup.html popup.js icons/ README.md

# Clean up build artifacts
clean:
    rm -f nix-expression-copier.tar.gz

# Bump version (usage: just bump-version [major|minor|patch])
bump-version type="patch":
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Get current version from manifest.json
    CURRENT_VERSION=$(grep '"version":' manifest.json | sed -E 's/.*"version": "([0-9]+\.[0-9]+)".*/\1/')
    MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
    MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
    
    # Calculate new version
    if [ "{{type}}" = "major" ]; then
        NEW_VERSION="$((MAJOR + 1)).0"
    elif [ "{{type}}" = "minor" ]; then
        NEW_VERSION="$MAJOR.$((MINOR + 1))"
    else
        NEW_VERSION="$MAJOR.$MINOR"
    fi
    
    # Update manifest.json
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" manifest.json
    
    # Update package.json
    sed -i "s/\"version\": \"$CURRENT_VERSION.0\"/\"version\": \"$NEW_VERSION.0\"/" package.json
    
    echo "Version bumped from $CURRENT_VERSION to $NEW_VERSION"

# Install the extension in Chrome (opens the extensions page)
install:
    @echo "To install the extension:"
    @echo "1. Open Chrome and navigate to chrome://extensions/"
    @echo "2. Enable 'Developer mode' by toggling the switch in the top-right corner"
    @echo "3. Click 'Load unpacked' and select this directory"
