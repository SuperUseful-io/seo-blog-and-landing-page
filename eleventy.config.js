const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const htmlmin = require("html-minifier-terser");
const path = require('path');

module.exports = function(eleventyConfig) {

  // Pick between local or server blog source
  eleventyConfig.ignores.add(`views/blog.${process.env.SUPER_USEFUL_API ? 'local' : 'server'}.liquid`);

  // Add global data
  eleventyConfig.addGlobalData("NODE_ENV", process.env.NODE_ENV);

  // Pass through assets
  eleventyConfig.addPassthroughCopy("assets");


  // Add support for RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // Add support for TailWind
  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postcss([
      require('postcss-import'),
      tailwindcss(require('./tailwind.config.js')),
      autoprefixer()
    ])
      .process(cssCode, { from: 'style/app.css' })
      .then(
        (r) => done(null, r.css),
        (e) => done(e, null)
      );
  });

  // Compress HTML
  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Set up markdown library
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  // Customize markdown-it's image renderer
  markdownLibrary.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const src = token.attrGet('src');
    const alt = token.content;
    const title = token.attrGet('title');
    return `__IMAGE_PLACEHOLDER__${src}__${alt}__${title}__`;
  };

  eleventyConfig.setLibrary("md", markdownLibrary);

  // Add markdownify filter
  eleventyConfig.addAsyncFilter("markdownify", async function(content) {
    if (typeof content !== 'string') {
      console.warn('markdownify filter received non-string input:', content);
      return '';
    }
    
    // Convert Markdown image syntax to {% image %} tags
    content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '{% image "$2", "$1" %}');
    
    let renderedContent = markdownLibrary.render(content);

    // Process {% image %} tags
    const imageTagRegex = /{%\s*image\s*([^%]+)%}/g;
    const promises = [];
    renderedContent = renderedContent.replace(imageTagRegex, (match, args) => {
      const placeholder = `__IMAGE_${promises.length}__`;
      const [src, alt] = args.split(',').map(arg => arg.trim().replace(/^["']|["']$/g, ''));
      promises.push(processImage(src, alt));
      return placeholder;
    });

    // Process __IMAGE_PLACEHOLDER__ tags
    const imagePlaceholderRegex = /__IMAGE_PLACEHOLDER__(.+?)__(.+?)__(.+?)__/g;
    renderedContent = renderedContent.replace(imagePlaceholderRegex, (match, src, alt, title) => {
      const placeholder = `__IMAGE_${promises.length}__`;
      promises.push(processImage(src, alt));
      return placeholder;
    });

    // Wait for all image processing to complete
    const imageResults = await Promise.all(promises);

    // Replace placeholders with processed images
    renderedContent = renderedContent.replace(/__IMAGE_(\d+)__/g, (match, index) => {
      return imageResults[parseInt(index)];
    });

    return renderedContent;
  });
  

  // Image processing function
  async function processImage(src, alt, classes = "", widths = "192, 384, 768, 1536", sizes = "100vw") {

    let imageOptions = {
      widths: widths.split(',').map(w => parseInt(w.trim(), 10)),
      formats: ['webp', 'jpeg'],
      outputDir: './dist/img/',
      urlPath: '/img/',
    };

    try {
      let metadata = await Image(src, imageOptions);
      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      };
      return Image.generateHTML(metadata, imageAttributes);
    } catch (error) {
      console.warn(`Failed to process image ${src}: ${error.message}`);
      return `<img src="${src}" alt="${alt}" class="${classes}" loading="lazy">`;
    }
  }

  // Image processing shortcode
  eleventyConfig.addShortcode("image", processImage);

  // Add image shortcode for Nunjucks
  eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, classes = "", widths = "192, 384, 768, 1536", sizes = "100vw") {
    // Remove quotes if they exist (from the Markdown conversion)
    src = src.replace(/^["'](.+)["']$/, '$1');
    alt = alt.replace(/^["'](.+)["']$/, '$1');

    let imageOptions = {
      widths: widths.split(',').map(w => parseInt(w.trim(), 10)),
      formats: ['webp', 'jpeg'],
      outputDir: './dist/img/',
      urlPath: '/img/',
    };

    try {
      let metadata = await Image(src, imageOptions);
      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      };
      return Image.generateHTML(metadata, imageAttributes);
    } catch (error) {
      console.warn(`Failed to process image ${src}: ${error.message}`);
      return `<img src="${src}" alt="${alt}" class="${classes}" loading="lazy">`;
    }
  });

  return {
    dir: {
      input: "views",
      output: "dist",
      includes: './_includes',
      layouts: './_layouts'
    }
  };
};
