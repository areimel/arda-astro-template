@echo off
REM Business Landing Page Image Download Script
REM This script downloads professional testimonial avatars from Unsplash

echo Starting download of testimonial avatar images...
echo.

REM Create directories if they don't exist
if not exist "public\images\testimonials" mkdir "public\images\testimonials"
if not exist "public\images\logos" mkdir "public\images\logos"

echo Downloading testimonial avatars...

REM Download testimonial headshots from Unsplash
curl -L "https://unsplash.com/photos/caOuGgyfu8s/download" -o "public\images\testimonials\sarah-j.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded sarah-j.jpg) else (echo ✗ Failed to download sarah-j.jpg)

curl -L "https://unsplash.com/photos/v7Jja2ChN6s/download" -o "public\images\testimonials\michael-c.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded michael-c.jpg) else (echo ✗ Failed to download michael-c.jpg)

curl -L "https://unsplash.com/photos/ODrd-02Q6JI/download" -o "public\images\testimonials\lisa-r.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded lisa-r.jpg) else (echo ✗ Failed to download lisa-r.jpg)

curl -L "https://unsplash.com/photos/ZAo0cKz_IKM/download" -o "public\images\testimonials\david-m.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded david-m.jpg) else (echo ✗ Failed to download david-m.jpg)

curl -L "https://unsplash.com/photos/O3D-teBz0Bg/download" -o "public\images\testimonials\jennifer-l.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded jennifer-l.jpg) else (echo ✗ Failed to download jennifer-l.jpg)

curl -L "https://unsplash.com/photos/N8lRH2uxih4/download" -o "public\images\testimonials\robert-k.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded robert-k.jpg) else (echo ✗ Failed to download robert-k.jpg)

curl -L "https://unsplash.com/photos/bbOOTiq-EPA/download" -o "public\images\testimonials\alex-t.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded alex-t.jpg) else (echo ✗ Failed to download alex-t.jpg)

curl -L "https://unsplash.com/photos/OswNOXPNU1k/download" -o "public\images\testimonials\maria-r.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded maria-r.jpg) else (echo ✗ Failed to download maria-r.jpg)

curl -L "https://unsplash.com/photos/jBTMrR6Q334/download" -o "public\images\testimonials\james-w.jpg"
if %ERRORLEVEL% EQU 0 (echo ✓ Downloaded james-w.jpg) else (echo ✗ Failed to download james-w.jpg)

echo.
echo ========================================
echo Testimonial avatar downloads completed!
echo ========================================
echo.

echo Note: Logo/badge downloads require manual process.
echo Please refer to the image-download-plan.md for logo resources:
echo - Flaticon: https://www.flaticon.com/packs/awards
echo - IconScout: https://iconscout.com/icons/award-badge
echo - SVG Repo: https://www.svgrepo.com/collection/company-logo/
echo - Reshot: https://www.reshot.com/free-svg-icons/logo/
echo.

echo To resize images to 400x400px, you can use ImageMagick:
echo magick identify "public\images\testimonials\*.jpg"
echo magick mogrify -resize 400x400^ -gravity center -extent 400x400 "public\images\testimonials\*.jpg"
echo.

pause