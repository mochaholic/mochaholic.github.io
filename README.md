# pivot

A minimalistic personal website.

## Features

- Warm color scheme
- Smooth light/dark mode toggle
- Markdown-based blog posts
- Responsive design
- Fast loading with pure HTML/CSS/JS
- Smart advertising system with JSON-based referrals

## Structure

```
├── index.html          # Home page
├── blogs.html          # All blog posts
├── projects.html       # Project showcase
├── contact.html        # Contact page
├── styles/
│   └── main.css        # Main stylesheet
├── scripts/
│   └── main.js         # JavaScript functionality
├── data/
│   └── referrals.json  # Advertising/referral data
└── posts/
    └── welcome-to-my-blog.md
```

## Adding New Posts

1. Create a new `.md` file in the `posts/` directory
2. Add the post filename to the `postFiles` array in `scripts/main.js`
3. Include metadata in the markdown:
   ```markdown
   # Post Title
   
   Post content here...
   
   **Date:** 2024-01-15
   **Tags:** crypto, privacy, security
   ```

## Advertising System

The site uses a smart advertising system that shows relevant referrals based on blog post tags. See `ADVERTISING.md` for detailed documentation.

