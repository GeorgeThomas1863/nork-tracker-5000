#!/usr/bin/env bash
# setup-config.sh - Cross-platform script to set up configuration from a private repository
# Works on both Linux/macOS (bash) and Windows (PowerShell)

# Default to a placeholder - this should be overridden by parameters
CONFIG_REPO="${CONFIG_REPO_URL:-https://github.com/example/config-placeholder.git}"
CONFIG_DIR="config"

# Debug info
echo "Starting setup script..."
echo "Initial CONFIG_REPO value: $CONFIG_REPO"

# Detect if running in PowerShell
if [[ "$SHELL" == *"powershell"* ]] || [[ -n "$PSModulePath" ]] || [[ "$(uname -s)" == *"MINGW"* ]] || [[ "$(uname -s)" == *"MSYS"* ]]; then
    # PowerShell implementation
    echo "Detected Windows PowerShell environment"
    
    # Parse arguments - PowerShell style (more robust parsing)
    for arg in "$@"; do
        if [[ $arg == -ConfigRepo=* ]] || [[ $arg == --ConfigRepo=* ]]; then
            CONFIG_REPO="${arg#*=}"
            echo "Parameter detected: CONFIG_REPO set to $CONFIG_REPO"
        elif [[ $arg == -ConfigDir=* ]] || [[ $arg == --ConfigDir=* ]]; then
            CONFIG_DIR="${arg#*=}"
            echo "Parameter detected: CONFIG_DIR set to $CONFIG_DIR"
        fi
    done
    
    echo "Using config repository: $CONFIG_REPO"
    echo "Config will be stored in: $CONFIG_DIR"
    
    # Check if config directory exists
    if Test-Path $CONFIG_DIR 2>/dev/null; then
        echo "Config directory already exists. Updating..."
        
        # Create a temporary directory
        $TEMP_DIR="temp_config_$(Get-Random)"
        echo "Cloning to temporary directory: $TEMP_DIR"
        git clone "$CONFIG_REPO" "$TEMP_DIR"
        
        # Copy all files from temp dir to config dir (overwriting existing)
        echo "Copying files to $CONFIG_DIR"
        Copy-Item -Path "$TEMP_DIR\*" -Destination "$CONFIG_DIR" -Recurse -Force
        
        # Clean up temp dir
        echo "Cleaning up temporary directory"
        Remove-Item -Recurse -Force "$TEMP_DIR"
    else
        echo "Creating config directory..."
        New-Item -ItemType Directory -Path "$CONFIG_DIR" | Out-Null
        
        # Clone to a temp directory and move files
        $TEMP_DIR="temp_config_$(Get-Random)"
        echo "Cloning to temporary directory: $TEMP_DIR"
        git clone "$CONFIG_REPO" "$TEMP_DIR"
        
        # Copy all files from temp dir to config dir
        echo "Copying files to $CONFIG_DIR"
        Copy-Item -Path "$TEMP_DIR\*" -Destination "$CONFIG_DIR" -Recurse
        
        # Clean up temp dir
        echo "Cleaning up temporary directory"
        Remove-Item -Recurse -Force "$TEMP_DIR"
    fi
    
    echo "Configuration setup complete!"
else
    # Bash implementation
    echo "Detected Linux/macOS bash environment"
    
    # Parse arguments - Bash style (more robust parsing)
    for arg in "$@"; do
        if [[ $arg == -r=* ]] || [[ $arg == --repo=* ]]; then
            CONFIG_REPO="${arg#*=}"
            echo "Parameter detected: CONFIG_REPO set to $CONFIG_REPO"
        elif [[ $arg == -d=* ]] || [[ $arg == --dir=* ]]; then
            CONFIG_DIR="${arg#*=}"
            echo "Parameter detected: CONFIG_DIR set to $CONFIG_DIR"
        fi
    done
    
    echo "Using config repository: $CONFIG_REPO"
    echo "Config will be stored in: $CONFIG_DIR"
    
    # Check if config directory exists
    if [ -d "$CONFIG_DIR" ]; then
        echo "Config directory already exists. Updating..."
        
        # Create a temporary directory
        TEMP_DIR="temp_config_$RANDOM"
        echo "Cloning to temporary directory: $TEMP_DIR"
        git clone "$CONFIG_REPO" "$TEMP_DIR"
        
        # Copy all files from temp dir to config dir (overwriting existing)
        echo "Copying files to $CONFIG_DIR"
        cp -rf "$TEMP_DIR/"* "$CONFIG_DIR/" 2>/dev/null || true
        
        # Clean up temp dir
        echo "Cleaning up temporary directory"
        rm -rf "$TEMP_DIR"
    else
        echo "Creating config directory..."
        mkdir -p "$CONFIG_DIR"
        
        # Clone to a temp directory and move files
        TEMP_DIR="temp_config_$RANDOM"
        echo "Cloning to temporary directory: $TEMP_DIR"
        git clone "$CONFIG_REPO" "$TEMP_DIR"
        
        # Copy all files from temp dir to config dir
        echo "Copying files to $CONFIG_DIR"
        cp -rf "$TEMP_DIR/"* "$CONFIG_DIR/" 2>/dev/null || true
        
        # Clean up temp dir
        echo "Cleaning up temporary directory"
        rm -rf "$TEMP_DIR"
    fi
    
    echo "Configuration setup complete!"
fi

# Exit with success
exit 0