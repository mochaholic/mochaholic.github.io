// Main JavaScript for the blog
class BlogApp {
    constructor() {
        this.posts = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupModal();
        this.loadPosts();
        this.setupEventListeners();
        this.setupWidgets();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Always let the browser handle navigation for .html files
                const href = link.getAttribute('href');
                if (href && href.includes('.html')) {
                    return;
                }
                
                // Only prevent default for same-page navigation (like post viewing)
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                if (targetPage) {
                    this.showPage(targetPage);
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    showPage(pageName) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    setupModal() {
        const modal = document.getElementById('crypto-modal');
        const donateBtn = document.getElementById('donate-btn');
        const closeBtn = document.getElementById('close-modal');

        donateBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Copy buttons
        const copyBtns = document.querySelectorAll('.copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const addressId = btn.getAttribute('data-address');
                const addressElement = document.getElementById(addressId);
                if (addressElement) {
                    navigator.clipboard.writeText(addressElement.textContent).then(() => {
                        btn.textContent = 'Copied!';
                        setTimeout(() => {
                            btn.textContent = 'Copy';
                        }, 2000);
                    });
                }
            });
        });
    }

    async loadPosts() {
        try {
            console.log('Loading posts...');
            // Load posts from markdown files
            const postFiles = [
                'welcome-to-my-blog'
            ];

            this.posts = [];
            
            for (const postId of postFiles) {
                try {
                    console.log(`Fetching post: ${postId}`);
                    const response = await fetch(`posts/${postId}.md`);
                    if (response.ok) {
                        const markdown = await response.text();
                        const post = this.parseMarkdownPost(markdown, postId);
                        if (post) {
                            this.posts.push(post);
                            console.log(`Loaded post: ${post.title}`);
                        }
                    } else {
                        console.warn(`Failed to fetch ${postId}: ${response.status}`);
                    }
                } catch (error) {
                    console.warn(`Could not load post: ${postId}`, error);
                }
            }

            console.log(`Total posts loaded: ${this.posts.length}`);

            // Sort posts by date (newest first)
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            this.renderPosts();
            this.renderPostsOnCurrentPage();
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    parseMarkdownPost(markdown, postId) {
        const lines = markdown.split('\n');
        const title = lines[0].replace(/^# /, '');
        
        // Extract date from markdown content
        let date = new Date().toISOString().split('T')[0];
        const dateMatch = markdown.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            date = dateMatch[1];
        }
        
        // Create excerpt from first paragraph (skip title and date)
        let excerpt = '';
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#') && !line.startsWith('**Date:**')) {
                excerpt = line;
                break;
            }
        }

        return {
            id: postId,
            title: title,
            date: date,
            excerpt: excerpt,
            content: markdown
        };
    }

    renderPosts() {
        this.renderRecentPosts();
        this.renderAllPosts();
    }

    renderRecentPosts() {
        const container = document.getElementById('recent-posts-list');
        if (!container) {
            console.log('recent-posts-list container not found');
            return;
        }

        const recentPosts = this.posts.slice(0, 3);
        console.log(`Rendering ${recentPosts.length} recent posts to recent-posts-list`);
        container.innerHTML = recentPosts.map(post => this.createPostCard(post)).join('');
        
        this.attachPostClickHandlers();
    }

    renderAllPosts() {
        const container = document.getElementById('all-posts-list');
        if (!container) {
            console.log('all-posts-list container not found');
            return;
        }

        console.log(`Rendering ${this.posts.length} posts to all-posts-list`);
        container.innerHTML = this.posts.map(post => this.createPostCard(post)).join('');
        
        this.attachPostClickHandlers();
    }

    // Method to render posts on any page
    renderPostsOnCurrentPage() {
        const currentPath = window.location.pathname;
        console.log('Current path:', currentPath);
        
        if (currentPath.includes('blogs.html') || currentPath.endsWith('/')) {
            console.log('Rendering all posts for blogs page');
            this.renderAllPosts();
        }
        
        if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
            console.log('Rendering recent posts for home page');
            this.renderRecentPosts();
        }
    }

    createPostCard(post) {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="post-card" data-post-id="${post.id}">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="post-meta">${date}</div>
            </div>
        `;
    }

    attachPostClickHandlers() {
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            card.addEventListener('click', () => {
                const postId = card.getAttribute('data-post-id');
                this.showPost(postId);
            });
        });
    }

    showPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Update page content
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-date').textContent = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Convert markdown to HTML (simple implementation)
        document.getElementById('post-content').innerHTML = this.markdownToHtml(post.content);

        // Show post page
        this.showPage('post');

        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Update URL without page reload
        history.pushState({ page: 'post', postId: postId }, '', `#post/${postId}`);
    }

    markdownToHtml(markdown) {
        // Simple markdown to HTML converter
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            // Line breaks
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');

        // Wrap in paragraphs
        html = '<p>' + html + '</p>';
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/gim, '');
        html = html.replace(/<p><br><\/p>/gim, '');

        return html;
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                if (e.state.page === 'post' && e.state.postId) {
                    this.showPost(e.state.postId);
                } else {
                    this.showPage(e.state.page);
                }
            }
        });

        // Handle hash changes for post navigation
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash;
            if (hash.startsWith('#post/')) {
                const postId = hash.replace('#post/', '');
                this.showPost(postId);
            }
        });
    }

    setupWidgets() {
        this.setupWeatherWidget();
    }

    async setupWeatherWidget() {
        try {
            const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://wttr.in/Miami?format=%t+%C&u'));
            
            if (response.ok) {
                const data = await response.json();
                const weatherData = data.contents;
                console.log('Weather data received:', weatherData);
                
                // Parse temperature and condition from wttr.in format
                const tempMatch = weatherData.match(/([+-]?\d+)°F/);
                const conditionMatch = weatherData.match(/°F\s+(.+)/);
                
                console.log('Temp match:', tempMatch);
                console.log('Condition match:', conditionMatch);
                
                if (tempMatch) {
                    let temp = tempMatch[1];
                    // Remove + sign unless it's negative
                    if (temp.startsWith('+')) {
                        temp = temp.substring(1);
                    }
                    const condition = conditionMatch ? conditionMatch[1].trim() : 'Clear';
                    const icon = this.getWeatherIcon(condition);
                    
                    document.getElementById('weather-temp').textContent = `${temp}°F`;
                    document.querySelector('.weather-widget .widget-icon').textContent = icon;
                } else {
                    console.log('Failed to parse weather data');
                    this.setWeatherError();
                }
            } else {
                console.log('Weather API response not ok:', response.status);
                this.setWeatherError();
            }
        } catch (error) {
            console.log('Weather service unavailable');
            this.setWeatherError();
        }
    }

    setWeatherError() {
        document.getElementById('weather-temp').textContent = '--°F';
        document.querySelector('.weather-widget .widget-icon').textContent = '🌤️';
    }

    getWeatherIcon(condition) {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
        if (conditionLower.includes('cloud')) return '☁️';
        if (conditionLower.includes('rain')) return '🌧️';
        if (conditionLower.includes('drizzle')) return '🌦️';
        if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
        if (conditionLower.includes('snow')) return '❄️';
        if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
        return '🌤️';
    }


}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new BlogApp();
    
    // Handle initial hash if present (only on index.html)
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
        const hash = window.location.hash;
        if (hash.startsWith('#post/')) {
            const postId = hash.replace('#post/', '');
            // Wait for posts to load, then show the post
            setTimeout(() => {
                app.showPost(postId);
            }, 100);
        }
    }
});
