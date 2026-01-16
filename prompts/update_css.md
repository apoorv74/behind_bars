# CSS Update Instructions

Use this prompt to update the CSS styling of the website.

## Site Information

- **Framework**: Hugo with Minimo theme
- **Custom CSS file**: `static/css/custom.css`
- **Theme CSS**: `themes/minimo/static/assets/css/main.ab98e12b.css` (don't modify)

## How to Update CSS

1. Read the current custom CSS file at `static/css/custom.css`
2. Make changes only to `static/css/custom.css` (never modify theme files)
3. Custom CSS overrides theme styles

## Current Custom CSS Structure

The custom CSS file contains:

- **Font imports** - Font Awesome icons
- **`.bookmark-source`** - Styling for bookmark source links on note pages
- **`.item-tags`** - Styling for tags on listing pages

## Key Layout Files

If CSS changes require template context:

- `layouts/_default/li.html` - List item template (has `.item`, `.item-tags`, `.tag` classes)
- `layouts/partials/entry/content.html` - Post content (has `.bookmark-source` class)
- `themes/minimo/layouts/` - Theme templates (reference only, don't modify)

## CSS Guidelines

1. **Only modify** `static/css/custom.css`
2. **Use specific selectors** to override theme styles
3. **Test responsiveness** - site is mobile-friendly
4. **Keep it minimal** - only add what's needed

## Common Tasks

### Change colors
```css
.selector {
  color: #hexcode;
  background-color: #hexcode;
}
```

### Change fonts
```css
body {
  font-family: 'Font Name', sans-serif;
}
```

### Adjust spacing
```css
.selector {
  margin: 1em;
  padding: 0.5em;
}
```

### Hide elements
```css
.selector {
  display: none;
}
```

## After Making Changes

Commit and push to deploy:
```bash
git add static/css/custom.css
git commit -m "Update CSS: [describe change]"
git push origin main
```

Site rebuilds automatically on Netlify (~30-60 seconds).
