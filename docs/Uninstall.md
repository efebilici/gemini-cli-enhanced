# Uninstalling Gemini CLI

This guide explains how to uninstall both the standard and enhanced versions of Gemini CLI. Follow the instructions based on your installation method.

## Uninstalling Standard Gemini CLI

### Method 1: Using npx (Temporary Installation)

If you used npx to run the CLI, clear the npx cache to remove temporary files.

The npx cache is a directory named `_npx` inside your main npm cache folder. Find your npm cache path by running `npm config get cache`.

**For macOS / Linux**

```bash
# The path is typically ~/.npm/_npx
rm -rf "$(npm config get cache)/_npx"
```

**For Windows**

_Command Prompt_

```cmd
:: The path is typically %LocalAppData%\npm-cache\_npx
rmdir /s /q "%LocalAppData%\npm-cache\_npx"
```

_PowerShell_

```powershell
# The path is typically $env:LocalAppData\npm-cache\_npx
Remove-Item -Path (Join-Path $env:LocalAppData "npm-cache\_npx") -Recurse -Force
```

### Method 2: Using npm (Global Install)

If you installed the standard CLI globally:

```bash
npm uninstall -g @google/gemini-cli
```

## Uninstalling Gemini CLI Enhanced

### Global Installation

If you installed the enhanced CLI globally:

```bash
npm uninstall -g gemini-cli-enhanced
```

### Local Development Setup

If you cloned the repository and set up a local development environment:

1. Navigate to the project root directory:
   ```bash
   cd path/to/gemini-cli-enhanced
   ```

2. Unlink the global package (if linked):
   ```bash
   npm unlink -g gemini-cli-enhanced
   ```

3. Remove global configuration files (if any):
   - **macOS/Linux**: `rm -rf ~/.config/gemini-cli-enhanced`
   - **Windows**: `rmdir /s /q %APPDATA%\gemini-cli-enhanced`

4. Optionally, remove the entire project directory:
   ```bash
   cd ..
   rm -rf gemini-cli-enhanced  # On Windows: rmdir /s /q gemini-cli-enhanced
   ```

## Verifying Uninstallation

To verify both versions are uninstalled:

```bash
gemini --version      # Should show 'command not found' or similar
gemini-enhanced --version  # Should show 'command not found' or similar
```

If you encounter any issues during uninstallation, please check the [Troubleshooting](#troubleshooting) section below.

## Troubleshooting

### "Command not found" After Uninstall

If you still see the command available after uninstalling, try these steps:

1. Close and reopen your terminal
2. Clear your terminal's command cache:
   - **Bash/Zsh**: `hash -r`
   - **Fish**: `hash -r`
   - **PowerShell**: `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")`

### Permission Issues

If you encounter permission errors during uninstallation, try running the command with `sudo` (macOS/Linux) or as Administrator (Windows).
