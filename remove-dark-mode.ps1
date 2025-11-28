# PowerShell script to remove all dark mode classes from the Leadership Connections project
# This will find and remove all 'dark:' prefixed Tailwind classes from .tsx and .ts files

Write-Host "🚀 Starting dark mode removal..." -ForegroundColor Green
Write-Host ""

$baseDir = $PSScriptRoot
$filesModified = 0
$filesProcessed = 0

# Directories to process
$directories = @("app", "components")

# Pattern to match dark mode classes
$darkModePattern = '\s+dark:[a-zA-Z0-9\-_/\[\]]+'

foreach ($dir in $directories) {
    $dirPath = Join-Path $baseDir $dir
    
    if (-not (Test-Path $dirPath)) {
        Write-Host "⚠️  Directory not found: $dirPath" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "📁 Processing $dir/..." -ForegroundColor Cyan
    
    # Get all .tsx and .ts files
    $files = Get-ChildItem -Path $dirPath -Include *.tsx,*.ts -Recurse -File
    
    foreach ($file in $files) {
        $filesProcessed++
        
        try {
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            
            # Remove dark mode classes
            $content = $content -replace $darkModePattern, ''
            
            # Clean up double spaces
            $content = $content -replace '  +', ' '
            
            # Clean up spaces before closing quotes
            $content = $content -replace ' +"', '"'
            $content = $content -replace " +'", "'"
            
            # Only write if content changed
            if ($content -ne $originalContent) {
                Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
                $filesModified++
                $relativePath = $file.FullName.Replace($baseDir + "\", "")
                Write-Host "  ✅ $relativePath" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "  ❌ Error processing $($file.Name): $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✨ Dark mode removal complete!" -ForegroundColor Green
Write-Host "📊 Files processed: $filesProcessed" -ForegroundColor White
Write-Host "✏️  Files modified: $filesModified" -ForegroundColor Yellow
Write-Host "📝 Files unchanged: $($filesProcessed - $filesModified)" -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 All dark mode classes have been removed!" -ForegroundColor Green
Write-Host "💡 Your site now has a consistent light theme." -ForegroundColor White
