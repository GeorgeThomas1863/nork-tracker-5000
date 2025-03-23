#!/usr/bin/env bash
# setup-config.sh - Cross-platform script to set up configuration from a private repository
# Works on both Linux/macOS (bash) and Windows (PowerShell)

# Get config repo from environment variable or use the command line parameter
# This allows users to set CONFIG_REPO_URL in their environment for security
# Default to a placeholder if neither is provided
CONFIG_REPO="${CONFIG_REPO_URL:-https://github.com/example/config-placeholder.git}"
CONFIG_DIR="config"

# Detect if running in PowerShell
if [[ "$SHELL" == *"powershell"* ]] || [[ -n "$PSModulePath" ]] || [[ "$(uname -s)" == *"MINGW"* ]] || [[ "$(uname -s)" == *"MSYS"* ]]; then
    # PowerShell implementation
    echo "Detected Windows PowerShell environment"
    
    # Parse arguments - PowerShell style
    for i in "$@"; do
        case $i in
            -ConfigRepo=*|--ConfigRepo=*)
            CONFIG_REPO="${i#*=}"
            shift
            ;;
            -ConfigDir=*|--ConfigDir=*)
            CONFIG_DIR="${i#*=}"
            shift
            ;;
        esac
    done
    
    echo "Using config repository: $CONFIG_REPO"
    echo "Config will be stored in: $CONFIG_DIR"
    
    # Check if config directory exists
    if Test-Path $CONFIG_DIR 2>/dev/null; then
        echo "Config directory already exists. Updating..."
        Push-Location $CONFIG_DIR
        git pull
        Pop-Location
    else
        echo "Cloning config repository..."
        git clone $CONFIG_REPO $CONFIG_DIR
    fi
    
    echo "Configuration setup complete!"
else
    # Bash implementation
    echo "Detected Linux/macOS bash environment"
    
    # Parse arguments - Bash style
    for i in "$@"; do
        case $i in
            -r=*|--repo=*)
            CONFIG_REPO="${i#*=}"
            shift
            ;;
            -d=*|--dir=*)
            CONFIG_DIR="${i#*=}"
            shift
            ;;
        esac
    done
    
    echo "Using config repository: $CONFIG_REPO"
    echo "Config will be stored in: $CONFIG_DIR"
    
    # Check if config directory exists
    if [ -d "$CONFIG_DIR" ]; then
        echo "Config directory already exists. Updating..."
        pushd $CONFIG_DIR > /dev/null
        git pull
        popd > /dev/null
    else
        echo "Cloning config repository..."
        git clone $CONFIG_REPO $CONFIG_DIR
    fi
    
    echo "Configuration setup complete!"
fi

# Exit with success
exit 0