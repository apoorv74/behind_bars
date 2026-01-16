# Micropub Server Setup for Hugo Static Sites

A lightweight Micropub server using Netlify Functions for mobile microblogging on Hugo sites.

## What It Does

- Handles **notes** and **bookmarks** (no file uploads)
- Commits directly to GitHub via Octokit
- Auto-deploys via Netlify
- Works with Quill, Indigenous, and other Micropub clients
- Supports IndieAuth authentication and user-defined tags

## Prerequisites

- Hugo static site hosted on Netlify
- GitHub repository for the site
- GitHub Personal Access Token with repo permissions

## Project Structure

```
your-site/
├── content/docs/notes/         # Micropub posts
│   └── _index.md               # Section index
├── layouts/
│   ├── _default/li.html        # List item template (shows tags)
│   └── partials/
│       ├── entry/content.html  # Shows bookmark URLs
│       └── head/extra.html     # IndieAuth discovery links
├── netlify/functions/
│   └── micropub.js             # The Micropub endpoint
├── static/css/custom.css       # Custom styling
└── package.json                # Dependencies
```

## Setup Steps

### 1. Create the Micropub Function

Copy `netlify/functions/micropub.js` from this repo and update the CONFIG section:

```javascript
const CONFIG = {
  github: {
    owner: 'YOUR_GITHUB_USERNAME',
    repo: 'YOUR_REPO_NAME',
    branch: 'main',
    contentPath: 'content/docs/notes'
  },
  site: {
    url: 'https://YOUR_SITE.netlify.app',
    author: 'Your Name'
  }
};
```

Also update the domain check in `verifyToken()`.

### 2. Create package.json

```json
{
  "name": "your-site",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@octokit/rest": "^20.0.0"
  }
}
```

### 3. Add IndieAuth Discovery Links

Create `layouts/partials/head/extra.html`:

```html
<link rel="me" href="https://github.com/YOUR_GITHUB_USERNAME">
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
<link rel="micropub" href="https://YOUR_SITE.netlify.app/.netlify/functions/micropub">
```

### 4. Create Notes Section

Create `content/docs/notes/_index.md`:

```yaml
---
title: "Notes"
description: "A microblog"
menu: main
weight: -200
---
```

### 5. Set Environment Variable in Netlify

In Netlify Dashboard → Site Settings → Environment Variables:

- `GITHUB_TOKEN`: Your GitHub Personal Access Token (repo permissions)

### 6. Optional Display Enhancements

Copy these files from this repo for better display:

- `layouts/partials/entry/content.html` - Shows bookmark source URLs
- `layouts/_default/li.html` - Shows tags on listing pages
- `static/css/custom.css` - Styling for tags and bookmarks

## Using Micropub Clients

### Quill (Web)
1. Go to https://quill.p3k.io
2. Enter your site URL
3. Authenticate via IndieAuth

### Mobile Apps
- **Indigenous** (iOS/Android)
- **IndiePass** (Android)

## Post Types

| Type | Description |
|------|-------------|
| Note | Short posts, auto-titled from first 8 words |
| Bookmark | Links with optional title and commentary |

## Limitations

- No file uploads (host images elsewhere, include URLs)
- No update/delete (edit via GitHub directly)
- 10-second function timeout

## Troubleshooting

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Check IndieAuth links in `<head>` |
| 403 Forbidden | Re-authenticate, token may be stale |
| 500 Server Error | Check GITHUB_TOKEN in Netlify env vars |
| Post not appearing | Wait 30-60s for Netlify rebuild |

## Reference Files

See these files in the repo for working examples:
- `netlify/functions/micropub.js` - Main endpoint
- `layouts/partials/head/extra.html` - Discovery links
- `layouts/partials/entry/content.html` - Bookmark display
- `layouts/_default/li.html` - Tag display
- `static/css/custom.css` - Styling
