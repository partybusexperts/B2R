<#
Interactive helper to run the export script with prompts for Supabase creds.
Usage: From project root PowerShell: .\scripts\pull-tools.ps1

Behavior:
 - Prompts for SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (masked input for key).
 - Optionally prompts for NEXT_PUBLIC_SUPABASE_ANON_KEY if you prefer anon access.
 - Exports them into the current process environment for `npm run pull:tools`.
 - Clears the env vars after the command completes.
#>

param()

function Read-Secret([string]$prompt) {
    Write-Host -NoNewline "$prompt"
    $sec = Read-Host -AsSecureString
    if (-not $sec) { return $null }
    return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
}

# Prompt user
$url = Read-Host 'SUPABASE_URL (e.g. https://your-project.supabase.co)'
if (-not $url) { Write-Error 'SUPABASE_URL is required'; exit 1 }
$key = Read-Secret 'SUPABASE_SERVICE_ROLE_KEY (service role, input hidden): '

if (-not $key) {
  Write-Host 'No service role provided. You can provide an anon key instead or cancel.'
  $anon = Read-Secret 'Optional NEXT_PUBLIC_SUPABASE_ANON_KEY (input hidden): '
  if (-not $anon) { Write-Error 'No credentials provided; aborting.'; exit 1 }
}

# Set env vars for this process
$env:SUPABASE_URL = $url
if ($key) { $env:SUPABASE_SERVICE_ROLE_KEY = $key }
if ($anon) { $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = $anon }

try {
  Write-Host "Running: npm run pull:tools"
  npm run pull:tools
} finally {
  # Clear env vars from process
  Remove-Item Env:\SUPABASE_URL -ErrorAction SilentlyContinue
  Remove-Item Env:\SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue
  Remove-Item Env:\NEXT_PUBLIC_SUPABASE_ANON_KEY -ErrorAction SilentlyContinue
  Write-Host 'Cleaned up environment variables.'
}
