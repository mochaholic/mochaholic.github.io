# Advertising System Documentation

## Overview

The blog uses a smart advertising system that shows relevant referral links based on blog post content. The system uses tags to match blog posts with appropriate advertisements.

## How It Works

### 1. Homepage Advertising
- Shows **one random referral** on the homepage
- No cycling or rotation - just a single random selection per page load
- Appears in the "Recommendations" section

### 2. Blog Post Advertising
- Shows **relevant referrals** at the bottom of each blog post
- Uses tag matching to determine which ads to show
- Falls back to random selection if no tags match

## Tag System

### Referral Tags
Each referral has specific tags that define when it should be shown:

```javascript
{
    title: "Kraken",
    tags: ["crypto", "trading", "finance"]
},
{
    title: "Proton Mail", 
    tags: ["privacy", "email", "security"]
},
{
    title: "Cryps",
    tags: ["cannabis", "wellness", "premium"]
}
```

### Blog Post Tags
Add tags to your blog posts using this format in the markdown:

```markdown
# My Blog Post Title

This is my blog post content...

**Date:** 2024-01-15
**Tags:** crypto, trading, defi
```

## How to Add/Modify Referrals

### Adding New Referrals
Edit the `referrals` array in `data/referrals.json`:

**For referrals with copyable codes:**
```json
{
  "id": "unique-identifier",
  "title": "Your Service Name",
  "description": "Description of what you're recommending",
  "code": "REFERRAL_CODE",
  "link": "https://your-referral-link.com",
  "icon": "🦑",
  "tags": ["tag1", "tag2", "tag3"]
}
```

**For referrals with tracking links only:**
```json
{
  "id": "unique-identifier",
  "title": "Your Service Name",
  "description": "Description of what you're recommending",
  "code": null,
  "link": "https://your-referral-link.com",
  "icon": "🦑",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Modifying Existing Referrals
Update the existing objects in `data/referrals.json`:
- Change `title`, `description`, `code`, `link`, `icon`, or `tags`
- Tags determine when the referral will be shown
- The `id` field should be unique for each referral
- Set `code` to `null` for tracking-link-only referrals
- Set `code` to a string for referrals with copyable codes

## Tag Matching Logic

### Smart Matching
1. **Exact Match**: If blog post tags match referral tags, show that referral
2. **Random Fallback**: If no matches, show a random referral
3. **Multiple Matches**: If multiple referrals match, randomly pick one

### Example Scenarios

**Blog Post with `crypto, trading` tags:**
- Will show Kraken (matches `crypto`, `trading`)
- Won't show Proton Mail or Cryps

**Blog Post with `privacy, security` tags:**
- Will show Proton Mail (matches `privacy`, `security`)
- Won't show Kraken or Cryps

**Blog Post with `general, introduction` tags:**
- Will show random referral (no matches)
- Could show any of the three referrals

## File Structure

```
data/referrals.json     # Referral data (JSON format)
scripts/main.js         # Referral logic and rendering
styles/main.css         # Styling for referral widgets
index.html             # Homepage with referral widget
posts/*.md             # Blog posts with tags
```

## Styling

### Referral Widget Classes
- `.referral-widget` - Main container
- `.referral-content` - Content wrapper
- `.referral-header` - Title and icon
- `.referral-description` - Description text
- `.referral-actions` - Buttons and code section
- `.referral-link` - Main CTA button
- `.referral-code` - Code display and copy button

### Customization
Modify the CSS in `styles/main.css` to change:
- Colors, fonts, spacing
- Glass-morphism effects
- Hover animations
- Responsive behavior

## Best Practices

### Tag Naming
- Use lowercase tags
- Be specific but not too narrow
- Use common categories like: `crypto`, `privacy`, `security`, `trading`, `finance`, `wellness`, `premium`

### Referral Content
- Keep descriptions concise but informative
- Use clear, action-oriented language
- Include relevant emojis for visual appeal
- Test all referral links regularly

### Blog Post Tags
- Add 2-4 relevant tags per post
- Use consistent tag names across posts
- Consider your audience and what they might be interested in

## Troubleshooting

### Referral Not Showing
1. Check if tags match between blog post and referral
2. Verify referral object syntax in `data/referrals.json`
3. Check browser console for JavaScript errors
4. Ensure JSON file is valid and accessible

### Styling Issues
1. Check CSS class names match HTML structure
2. Verify CSS variables are defined
3. Test responsive behavior on different screen sizes

### Copy Functionality
- Requires HTTPS for clipboard API
- Falls back gracefully if clipboard access is denied
- Shows visual feedback (✓) when copy succeeds

## Future Enhancements

Potential improvements:
- Analytics tracking for referral clicks
- A/B testing different referral content
- Dynamic referral rotation based on performance
- Admin interface for managing referrals
- Integration with external referral APIs
