@echo off
echo.
echo ========================================
echo  Dark Mode Removal Tool
echo ========================================
echo.
echo This will remove all dark mode classes from your site.
echo.
pause

powershell.exe -ExecutionPolicy Bypass -File "%~dp0remove-dark-mode.ps1"

echo.
echo ========================================
echo  Process Complete!
echo ========================================
echo.
pause
