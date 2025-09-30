# mocha blog ☕

A minimalistic personal blog.

## Features

- Warm color scheme
- Smooth light/dark mode toggle
- Markdown-based blog posts
- Responsive design
- Fast loading with pure HTML/CSS/JS

## Structure

```
├── index.html          # Home page
├── blogs.html          # All blog posts
├── contact.html        # Contact page
├── styles/
│   └── main.css        # Main stylesheet
├── scripts/
│   └── main.js         # JavaScript functionality
└── posts/
    ├── welcome-to-my-blog.md
    └── building-this-blog.md
```

## Adding New Posts

1. Create a new `.md` file in the `posts/` directory
2. Add the post metadata to the `posts` array in `scripts/main.js`
3. The post will automatically appear on the blog
