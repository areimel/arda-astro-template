# Logo Templates and Resources

## Quick Logo Templates (SVG)

### Award Badge Template
```svg
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
  <polygon points="50,20 55,35 70,35 58,45 63,60 50,50 37,60 42,45 30,35 45,35" fill="white"/>
  <text x="50" y="80" text-anchor="middle" fill="white" font-size="8" font-weight="bold">AWARD</text>
</svg>
```

### Tech Company Logo Template
```svg
<svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="30" height="30" fill="#4f46e5" rx="5"/>
  <rect x="10" y="10" width="20" height="20" fill="white" rx="2"/>
  <text x="45" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151">TechCorp</text>
</svg>
```

### Publication Logo Template
```svg
<svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="140" height="40" fill="#1f2937" rx="4"/>
  <text x="70" y="26" text-anchor="middle" font-family="serif" font-size="16" font-weight="bold" fill="white">BUSINESS</text>
</svg>
```

## Recommended Free Resources

### 1. Flaticon (Awards & Badges)
- URL: https://www.flaticon.com/packs/awards
- License: Free with attribution, Premium available
- Formats: SVG, PNG, ICO, ICNS
- Best for: award-g2.svg, award-capterra.svg, award-trustpilot.svg, cert-soc2.svg

### 2. IconScout (Business Icons)
- URL: https://iconscout.com/icons/award-badge
- License: Free tier available
- Formats: SVG, PNG, AI, PDF
- Best for: Professional award badges

### 3. SVG Repo (Company Logos)
- URL: https://www.svgrepo.com/collection/company-logo/
- License: Open source, no attribution required
- Formats: SVG only
- Best for: client-microsoft.svg, client-google.svg, etc.

### 4. Simple Icons (Brand Icons)
- URL: https://simpleicons.org/
- License: CC0, free for commercial use
- Formats: SVG
- Best for: Simplified brand-style icons

### 5. Heroicons (UI Icons)
- URL: https://heroicons.com/
- License: MIT, completely free
- Formats: SVG, React, Vue components
- Best for: General UI icons and badges

## Manual Download Instructions

### For Award Badges:
1. Visit Flaticon awards collection
2. Search for terms: "award badge", "certification", "trust badge"
3. Download SVG format
4. Rename files according to plan:
   - award-g2.svg
   - award-capterra.svg
   - award-trustpilot.svg
   - cert-soc2.svg

### For Company Logos:
1. Visit SVG Repo or Simple Icons
2. Search for generic alternatives to major brands
3. Download SVG files
4. Rename files according to plan:
   - client-microsoft.svg → Use "Windows" or "Office" style icon
   - client-google.svg → Use "Search" or "Chrome" style icon
   - client-amazon.svg → Use "Shopping" or "Cloud" style icon
   - client-salesforce.svg → Use "CRM" or "Sales" style icon
   - client-hubspot.svg → Use "Marketing" or "Growth" style icon

### For Publication Logos:
1. Create custom SVG text-based logos
2. Use the templates provided above
3. Modify colors to match your theme
4. Save as:
   - featured-techcrunch.svg
   - featured-forbes.svg
   - featured-inc.svg
   - featured-entrepreneur.svg

## Color Customization

To match your theme system, modify SVG colors:
- Use CSS custom properties: `fill="var(--color-theme-button)"`
- Or use neutral colors: `#374151` (gray), `#2563eb` (blue), `#1f2937` (dark)

## Quick Creation Commands

### Create a simple award badge:
```bash
cat > public/images/logos/award-g2.svg << 'EOF'
<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="35" fill="#2563eb"/>
  <polygon points="40,18 44,28 55,28 47,35 50,45 40,40 30,45 33,35 25,28 36,28" fill="white"/>
  <text x="40" y="65" text-anchor="middle" fill="white" font-size="8" font-weight="bold">G2</text>
</svg>
EOF
```

### Create a simple company logo:
```bash
cat > public/images/logos/client-microsoft.svg << 'EOF'
<svg width="100" height="40" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="8" width="12" height="12" fill="#f25022"/>
  <rect x="19" y="8" width="12" height="12" fill="#00a4ef"/>
  <rect x="5" y="22" width="12" height="12" fill="#7fba00"/>
  <rect x="19" y="22" width="12" height="12" fill="#ffb900"/>
  <text x="40" y="25" font-family="Arial" font-size="12" fill="#5e5e5e">Microsoft</text>
</svg>
EOF
```

This approach gives you complete control over the logo designs while ensuring they match your theme and licensing requirements.