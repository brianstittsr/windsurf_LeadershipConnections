@echo off
echo.
echo ========================================
echo  Fix Production CORS for Image Uploads
echo ========================================
echo.
echo This will configure Firebase Storage CORS
echo to allow uploads from:
echo - localhost:3000
echo - localhost:3001
echo - https://www.ncleadconnect.org
echo - https://ncleadconnect.org
echo.
echo IMPORTANT: This script must be run as Administrator!
echo.
pause

echo.
echo Checking for Administrator privileges...
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: This script must be run as Administrator!
    echo.
    echo Right-click this file and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo Checking gcloud installation...
where gsutil >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Google Cloud SDK not found!
    echo.
    echo Please install it from:
    echo https://cloud.google.com/sdk/docs/install
    echo.
    pause
    exit /b 1
)

echo.
echo Setting project...
gcloud config set project ncleadconnect-donor

echo.
echo Applying CORS configuration...
gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! CORS Configuration Applied
    echo ========================================
    echo.
    echo Verifying configuration...
    gsutil cors get gs://ncleadconnect-donor.firebasestorage.app
    echo.
    echo ========================================
    echo  Next Steps:
    echo ========================================
    echo 1. Wait 1-2 minutes for changes to propagate
    echo 2. Clear your browser cache
    echo 3. Hard refresh the page (Ctrl+Shift+R)
    echo 4. Try uploading a photo again
    echo.
    echo Your production site should now work!
    echo ========================================
) else (
    echo.
    echo ERROR: Failed to apply CORS configuration
    echo.
    echo Try using Google Cloud Console Cloud Shell instead:
    echo 1. Go to: https://console.cloud.google.com/
    echo 2. Select project: ncleadconnect-donor
    echo 3. Open Cloud Shell (terminal icon)
    echo 4. Upload cors.json
    echo 5. Run: gsutil cors set cors.json gs://ncleadconnect-donor.firebasestorage.app
    echo.
)

pause
