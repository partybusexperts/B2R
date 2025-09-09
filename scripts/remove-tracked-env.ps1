# scripts/remove-tracked-env.ps1
# Run from repository root. This will untrack .env.local and .next and commit the change.
param()

Write-Host "Untracking .env.local and .next from git, adding to .gitignore, and committing the change..."

# Ensure .env.local and .next are in .gitignore
$ignores = @('.env.local', '.next')
foreach ($i in $ignores) {
  if (-not (Select-String -Path .gitignore -Pattern ([regex]::Escape($i)) -Quiet)) {
    Add-Content -Path .gitignore -Value $i
    Write-Host "Added $i to .gitignore"
  } else {
    Write-Host "$i already in .gitignore"
  }
}

# Untrack files but keep local copies
git rm --cached .env.local -f -q 2>$null
git rm -r --cached .next -f -q 2>$null

git add .gitignore .env.local.example
git commit -m "Stop tracking .env.local and .next; add example env"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Nothing to commit or commit failed"
}

Write-Host "Done. If commit succeeded, push changes with: git push"
