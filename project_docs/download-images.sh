#!/bin/bash

# Business Landing Page Image Download Script
# This script downloads professional testimonial avatars from Unsplash

echo "Starting download of testimonial avatar images..."
echo

# Create directories if they don't exist
mkdir -p "public/images/testimonials"
mkdir -p "public/images/logos"

echo "Downloading testimonial avatars..."

# Download testimonial headshots from Unsplash with error checking
download_image() {
    local url="$1"
    local filename="$2"
    local description="$3"
    
    if curl -L "$url" -o "public/images/testimonials/$filename"; then
        echo "✓ Downloaded $filename ($description)"
    else
        echo "✗ Failed to download $filename"
    fi
}

download_image "https://unsplash.com/photos/caOuGgyfu8s/download" "sarah-j.jpg" "Sarah Johnson CEO"
download_image "https://unsplash.com/photos/v7Jja2ChN6s/download" "michael-c.jpg" "Michael Chen founder"
download_image "https://unsplash.com/photos/ODrd-02Q6JI/download" "lisa-r.jpg" "Lisa Rodriguez marketing director"
download_image "https://unsplash.com/photos/ZAo0cKz_IKM/download" "david-m.jpg" "David Martinez VP marketing"
download_image "https://unsplash.com/photos/O3D-teBz0Bg/download" "jennifer-l.jpg" "Jennifer Lee CEO"
download_image "https://unsplash.com/photos/N8lRH2uxih4/download" "robert-k.jpg" "Robert Kim head of sales"
download_image "https://unsplash.com/photos/bbOOTiq-EPA/download" "alex-t.jpg" "Alex Thompson CEO"
download_image "https://unsplash.com/photos/OswNOXPNU1k/download" "maria-r.jpg" "Maria Rodriguez CMO"
download_image "https://unsplash.com/photos/jBTMrR6Q334/download" "james-w.jpg" "James Wilson founder"

echo
echo "========================================"
echo "Testimonial avatar downloads completed!"
echo "========================================"
echo

echo "Note: Logo/badge downloads require manual process."
echo "Please refer to the image-download-plan.md for logo resources:"
echo "- Flaticon: https://www.flaticon.com/packs/awards"
echo "- IconScout: https://iconscout.com/icons/award-badge"
echo "- SVG Repo: https://www.svgrepo.com/collection/company-logo/"
echo "- Reshot: https://www.reshot.com/free-svg-icons/logo/"
echo

echo "To resize images to 400x400px, you can use ImageMagick:"
echo "identify public/images/testimonials/*.jpg"
echo "mogrify -resize 400x400^ -gravity center -extent 400x400 public/images/testimonials/*.jpg"
echo

echo "Attribution required for Unsplash images:"
echo "See image-download-plan.md for complete attribution details"