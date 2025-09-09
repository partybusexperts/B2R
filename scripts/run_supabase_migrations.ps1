<#
Run Supabase/Postgres migrations from the repo against your remote DB.

Usage (PowerShell):
  # set env var first (recommended, do NOT commit this)
  $env:SUPABASE_DB_URL = 'postgresql://user:password@host:5432/dbname'
  ./scripts/run_supabase_migrations.ps1

  # or run interactively and paste the connection string when prompted
  ./scripts/run_supabase_migrations.ps1

Requirements:
- psql CLI must be installed and on PATH (Postgres client). On Windows, install Postgres or psql via Chocolatey.
- A Postgres connection string with credentials (do not commit credentials).

This script executes SQL files found in `supabase/migrations` in filename sort order.
#>

Set-StrictMode -Version Latest

function Get-ConnectionString {
    if ($env:SUPABASE_DB_URL -and $env:SUPABASE_DB_URL.Trim() -ne '') {
        return $env:SUPABASE_DB_URL.Trim()
    }
    Write-Host "No SUPABASE_DB_URL env var found. Paste the Postgres connection string (postgresql://user:pass@host:port/db):"
    $conn = Read-Host "Connection string"
    if (-not $conn) { throw "Connection string required" }
    return $conn.Trim()
}

try {
    $conn = Get-ConnectionString

    # verify psql available
    $psqlPath = (Get-Command psql -ErrorAction SilentlyContinue)?.Source
    if (-not $psqlPath) {
        Write-Error "psql CLI not found on PATH. Install Postgres client or add psql to PATH."; exit 2
    }

    $migrationsDir = Join-Path $PSScriptRoot "..\supabase\migrations" | Resolve-Path -ErrorAction Stop
    $files = Get-ChildItem -Path $migrationsDir -Filter '*.sql' | Sort-Object Name
    if ($files.Count -eq 0) { Write-Host "No migration files found in $migrationsDir"; exit 0 }

    Write-Host "Found $($files.Count) migration(s). Running in order..." -ForegroundColor Cyan

    foreach ($f in $files) {
        Write-Host "-> Running $($f.Name)" -NoNewline
        $full = $f.FullName
        $cmd = "psql '$conn' -f `"$full`""
        # Use & to invoke psql with the connection string as first arg
        $proc = Start-Process -FilePath psql -ArgumentList @($conn, '-f', $full) -NoNewWindow -PassThru -Wait -ErrorAction Stop
        if ($proc.ExitCode -ne 0) {
            Write-Host " FAILED (exit $($proc.ExitCode))" -ForegroundColor Red
            throw "Migration $($f.Name) failed"
        }
        Write-Host " OK" -ForegroundColor Green
    }

    Write-Host "All migrations applied." -ForegroundColor Green
} catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}
