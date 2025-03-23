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
        
        # Create a temporary directory
        $TEMP_DIR="temp_config_$(Get-Random)"
        git clone $CONFIG_REPO $TEMP_DIR
        
        # Copy all files from temp dir to config dir (overwriting existing)
        Copy-Item -Path "$TEMP_DIR\*" -Destination $CONFIG_DIR -Recurse -Force
        
        # Clean up temp dir
        Remove-Item -Recurse -Force $TEMP_DIR
    else
        echo "Creating config directory..."
        New-Item -ItemType Directory -Path $CONFIG_DIR | Out-Null
        
        # Clone to a temp directory and move files
        $TEMP_DIR="temp_config_$(Get-Random)"
        git clone $CONFIG_REPO $TEMP_DIR
        
        # Copy all files from temp dir to config dir
        Copy-Item -Path "$TEMP_DIR\*" -Destination $CONFIG_DIR -Recurse
        
        # Clean up temp dir
        Remove-Item -Recurse -Force $TEMP_DIR
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
        
        # Create a temporary directory
        TEMP_DIR="temp_config_$RANDOM"
        git clone $CONFIG_REPO $TEMP_DIR
        
        # Copy all files from temp dir to config dir (overwriting existing)
        cp -rf $TEMP_DIR/* $CONFIG_DIR/ 2>/dev/null || true
        
        # Clean up temp dir
        rm -rf $TEMP_DIR
    else
        echo "Creating config directory..."
        mkdir -p $CONFIG_DIR
        
        # Clone to a temp directory and move files
        TEMP_DIR="temp_config_$RANDOM"
        git clone $CONFIG_REPO $TEMP_DIR
        
        # Copy all files from temp dir to config dir
        cp -rf $TEMP_DIR/* $CONFIG_DIR/ 2>/dev/null || true
        
        # Clean up temp dir
        rm -rf $TEMP_DIR
    fi
    
    echo "Configuration setup complete!"
fi

# Exit with success
exit 0