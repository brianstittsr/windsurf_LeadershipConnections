@echo off
echo.
echo ========================================
echo  Firebase Storage CORS Fix
echo ========================================
echo.
echo This will configure CORS for Firebase Storage
echo to allow uploads from localhost.
echo.
echo Prerequisites:
echo - Google Cloud SDK must be installed
echo - You must be authenticated with gcloud
echo.
pause

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

echo.
echo Verifying CORS configuration...
gsutil cors get gs://ncleadconnect-donor.firebasestorage.app

echo.
echo ========================================
echo  CORS Configuration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Clear your browser cache
echo 2. Restart your dev server (npm run dev)
echo 3. Try uploading a photo again
echo.
pause
