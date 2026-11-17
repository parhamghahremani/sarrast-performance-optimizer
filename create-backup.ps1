$source = 'D:\Desktop\project\scripts\sarrast-performance-optimizer'
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dest = "D:\Desktop\project\scripts\sarrast-performance-optimizer\backups\full-snapshots\sarrast-performance-optimizer-$timestamp-initial-v1.2.3.zip"
$excludePatterns = @('backups\*', 'node_modules\*', 'dist\*', 'versions\*', 'test-results\*', 'playwright-report\*', '.git\*', '*.log', '.env*')

$files = Get-ChildItem -Path $source -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($source.Length + 1)
    $excluded = $false
    foreach ($pattern in $excludePatterns) {
        if ($rel -like $pattern) {
            $excluded = $true
            break
        }
    }
    -not $excluded
}

$files | Compress-Archive -DestinationPath $dest -Force
Write-Host "Created: $dest"
Write-Host "Files: $($files.Count)"

# Verify
$hash = Get-FileHash -Algorithm SHA256 $dest
Write-Host "SHA256: $($hash.Hash)"