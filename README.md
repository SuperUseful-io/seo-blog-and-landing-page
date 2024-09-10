![Super Useful SEO Blog & Landing Page](https://firebasestorage.googleapis.com/v0/b/sufio-86f60.appspot.com/o/github%2Fsuper-useful-seo-blog-banner.png?alt=media&token=d901bb87-3b16-461c-bcc5-d2dc2fe25350)

[suf.io](https://suf.io)
======================================

This is an open-source blogging platform built with Eleventy, TailwindCSS, and DaisyUI. It's designed to be SEO-friendly and easily customizable.


## Built With
![Eleventy, TailwindCSS, and DaisyUI logos](https://firebasestorage.googleapis.com/v0/b/sufio-86f60.appspot.com/o/github%2Fpowered-by.png?alt=media&token=47695f58-7467-4bce-9f78-e2ed4f7f24e7)

Features
--------

*   SEO-optimized landing page and blog
*   Responsive design using TailwindCSS and DaisyUI
*   Support for both local and remote blog posts
*   Markdown support for blog content
*   Image optimization
*   RSS feed generation
*   HTML minification

Getting Started
---------------

### Deploy with in minutes
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SuperUseful-io/seo-landing-page-and-blog)



### Prerequisites

*   Node.js (v14 or later)
*   npm


### Run Locally
---
1.  Clone the repository
2.  Install dependencies:
    
        npm install

3. Run the development server:

        npm run dev

4. Open your browser and navigate to:

        http://localhost:8081



### Building for Production

To build the app for production:

    npm run build

This will generate optimized HTML, CSS, and assets in the `dist` folder.




Configuration
-------------

### Blog Source

The platform supports both local and remote blog posts. To switch between them, set the `SUPER_USEFUL_API` environment variable:

*   For local posts: Leave `SUPER_USEFUL_API` unset
*   For remote posts: Set `SUPER_USEFUL_API` to your API key


### Eleventy Configuration

The main Eleventy configuration is located in `eleventy.config.js`. Here you can modify:

*   Global data
*   Collections
*   Filters
*   Transforms
*   Plugins

### Tailwind Configuration

Tailwind CSS configuration can be found in `tailwind.config.js`. Modify this file to customize your design system.

Adding Content
--------------

### Local Blog Posts

To add a local blog post, create a new Markdown file in the `views/blog` directory. Use the following frontmatter:

    ---
    title: Your Blog Post Title
    description: A brief description of your post
    date: 2023-05-01
    tags: [tag1, tag2]
    layout: blog_post
    ---
    
    Your blog post content goes here...

### Remote Blog Posts

Remote blog posts are fetched from an API. Ensure your API returns posts in the format expected by the `blogSuperUseful` global data function.

Customization
-------------

### Templates

*   Main layout: `views/_layouts/main.liquid`
*   Blog post layout: `views/_layouts/blog_post.liquid`
*   Blog list page: `views/blog.local.liquid` or `views/blog.server.liquid`

### Styling

The main CSS file is `style/app.css`. You can add custom styles here or create new CSS files and import them.

Contributing
------------

Contributions are welcome! Please feel free to submit a Pull Request.