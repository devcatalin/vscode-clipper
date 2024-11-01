#!/bin/bash

# Exit on any error
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to get current version
get_current_version() {
    node -p "require('./package.json').version"
}

# Function to bump patch version
bump_version() {
    # Read current version
    current_version=$(get_current_version)
    
    # Split version into parts
    IFS='.' read -r major minor patch <<< "$current_version"
    
    # Increment patch version
    new_patch=$((patch + 1))
    new_version="$major.$minor.$new_patch"
    
    # Update package.json with new version
    # Using temp file to preserve formatting and comments
    jq ".version = \"$new_version\"" package.json > tmp.json && mv tmp.json package.json
    
    echo "$new_version"
}

# Main execution
main() {
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        log "Error: package.json not found in current directory"
        exit 1
    fi
    
    # Check if required commands exist
    for cmd in node jq npm code; do
        if ! command -v $cmd &> /dev/null; then
            log "Error: Required command '$cmd' not found"
            exit 1
        fi
    done
    
    # Get current version before bump
    current_version=$(get_current_version)
    log "Current version: $current_version"
    
    # Bump version and store new version
    new_version=$(bump_version)
    log "Bumped version to $new_version"
    
    # Run package command
    log "Running npm package command..."
    npm run package
    
    # Install the extension
    vsix_file="clipper-${new_version}.vsix"
    log "Looking for VSIX file: $vsix_file"
    
    if [ ! -f "$vsix_file" ]; then
        log "Error: Built extension file $vsix_file not found"
        log "Contents of directory:"
        ls -la
        exit 1
    fi
    
    log "Installing extension..."
    code --install-extension "$vsix_file"
    
}

main