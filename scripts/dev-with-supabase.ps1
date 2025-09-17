<#
Prompt for Supabase creds and run Next dev with them in the process environment.
Usage: From project root PowerShell: .\scripts\dev-with-supabase.ps1
#>

function Read-Secret([string]$prompt) {
    Write-Host -NoNewline "$prompt"
    $sec = Read-Host -AsSecureString
    if (-not $sec) { return $null }
    return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
}

$url = Read-Host 'NEXT_PUBLIC_SUPABASE_URL (e.g. https://your-project.supabase.co)'
if (-not $url) { Write-Error 'SUPABASE URL required'; exit 1 }
$key = Read-Secret 'SUPABASE_SERVICE_ROLE_KEY (service role, input hidden): '
if (-not $key) { Write-Error 'Service role key required'; exit 1 }

$env:NEXT_PUBLIC_SUPABASE_URL = $url
$env:SUPABASE_SERVICE_ROLE_KEY = $key

try {
    Write-Host 'Starting Next dev. Press Ctrl+C to stop.'
    npm run dev
} finally {
    Remove-Item Env:\NEXT_PUBLIC_SUPABASE_URL -ErrorAction SilentlyContinue
    Remove-Item Env:\SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue
    Write-Host 'Cleared env vars.'
}
