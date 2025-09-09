<#
PowerShell helper: interactively create a .env.local at the repo root.
Usage: from the project root in PowerShell run:
  .\scripts\create-env.ps1

If execution policy blocks, run:
  powershell -ExecutionPolicy Bypass -File .\scripts\create-env.ps1

Security notes:
- The script will write plain-text secrets to .env.local so Next.js can read them. Keep that file out of git.
- The script will add .env.local to .gitignore if it's not already present.
#>

Write-Host "Create .env.local (interactive). This will write plain-text keys to .env.local in the current folder."

$cwd = Get-Location
$envPath = Join-Path -Path $cwd -ChildPath ".env.local"

$SUPABASE_URL = Read-Host "SUPABASE_URL (e.g. https://your-project.supabase.co)"

# Read service role and anon keys as secure strings, then convert to plain text for file write
$serviceRoleSecure = Read-Host -Prompt "SUPABASE_SERVICE_ROLE (service role key) - input will be hidden" -AsSecureString
$anonKeySecure = Read-Host -Prompt "NEXT_PUBLIC_SUPABASE_ANON_KEY (anon key) - input will be hidden" -AsSecureString

function SecureStringToPlainText($s) {
  if ($null -eq $s) { return "" }
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$SUPABASE_SERVICE_ROLE = SecureStringToPlainText $serviceRoleSecure
$NEXT_PUBLIC_SUPABASE_ANON_KEY = SecureStringToPlainText $anonKeySecure
$NEXT_PUBLIC_SUPABASE_URL = $SUPABASE_URL

$content = @"
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_ROLE=$SUPABASE_SERVICE_ROLE
NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
"@

Set-Content -Path $envPath -Value $content -Encoding utf8
Write-Host ".env.local created at $envPath"

# Ensure .env.local is in .gitignore
$gitignorePath = Join-Path -Path $cwd -ChildPath ".gitignore"
if (Test-Path $gitignorePath) {
  $has = Select-String -Path $gitignorePath -Pattern '^\s*\.env.local\s*$' -Quiet
  if (-not $has) {
    Add-Content -Path $gitignorePath -Value "`n.env.local"
    Write-Host ".env.local added to .gitignore"
  } else {
    Write-Host ".env.local already in .gitignore"
  }
} else {
  Set-Content -Path $gitignorePath -Value ".env.local"
  Write-Host "Created .gitignore and added .env.local"
}

Write-Host "Restart your dev server so Next.js picks up the new env vars."
