<#
setup-dev.ps1

Usage examples:
  # interactive: will prompt to install Node (via winget) if missing, run npm ci, run tsc, but will not start dev server
  .\setup-dev.ps1

  # install deps and start dev server at the end
  .\setup-dev.ps1 -StartDev

  # attempt to install Node via winget if missing, then continue
  .\setup-dev.ps1 -InstallNode -StartDev
#>

param(
    [switch]$InstallNode,
    [switch]$StartDev
)

function Test-HasCommand($name) {
    try {
        $null = & $name --version 2>$null
        return $true
    } catch {
        return $false
    }
}

Write-Host "Running setup-dev.ps1 from:" (Get-Location).Path

# Check node/npm availability
if (-not (Test-HasCommand 'node')) {
    Write-Warning "Node.js is not available in PATH."
    if ($InstallNode -or (Read-Host "Install Node.js LTS via winget now? (y/N)").ToLower() -eq 'y') {
        if (Test-HasCommand 'winget') {
            Write-Host "Installing Node.js LTS via winget..."
            Start-Process -FilePath winget -ArgumentList 'install','-e','--id','OpenJS.NodeJS.LTS' -NoNewWindow -Wait
            # reload PATH from machine+user env; new processes may still need a restart
            $env:PATH = [System.Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH','User')
            Write-Host "Reloaded PATH for this session. Please open a new PowerShell if 'node' still isn't found."
        } else {
            Write-Warning "winget not found. Please install Node.js from https://nodejs.org/ and re-run this script."
            exit 1
        }
    } else {
        Write-Error "Node is required. Exiting."; exit 1
    }
}

if (-not (Test-HasCommand 'npm')) {
    Write-Warning "npm not found after Node install. Please re-open PowerShell and re-run this script."; exit 1
}

# Ensure we are in the repo app folder (one level up from scripts)
try {
    $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
    Push-Location (Join-Path $scriptRoot '..') | Out-Null
} catch {
    Write-Warning "Couldn't change directory; continuing in current location."
}

Write-Host "Working directory:" (Get-Location).Path

# Install deps
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies with npm ci..."
    npm ci
} else {
    Write-Host "node_modules exists — skipping install. Use -ForceInstall to override in a future version."
}

# TypeScript check
if (Test-Path ".\node_modules\.bin\tsc") {
    Write-Host "Running local tsc --noEmit"
    .\node_modules\.bin\tsc --noEmit
} else {
    Write-Host "Running tsc via npm exec"
    npm exec --package typescript tsc -- --noEmit
}

if ($StartDev) {
    Write-Host "Starting dev server (npm run dev) — use Ctrl+C to stop"
    npm run dev
}

Pop-Location 2>$null

Write-Host "setup-dev.ps1 finished."
