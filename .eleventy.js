module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  
  // Collection for blog posts
  eleventyConfig.addCollection("writings", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/writings/*.md").reverse();
  });
  
  // Filter to group posts by year, then month
  eleventyConfig.addFilter("groupByYear", function(posts) {
    const grouped = {};
    posts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }
      grouped[year][month].push(post);
    });
    return grouped;
  });
  
  // RSS date filter
  eleventyConfig.addFilter("rssDate", function(date) {
    return new Date(date).toUTCString();
  });

  // Defer non-critical images so pages only download media they actually show.
  eleventyConfig.addTransform("lazyLoadImages", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    return content.replace(/<img\b([^>]*?)>/g, (match, attrs) => {
      if (
        /\bloading\s*=/.test(attrs) ||
        /\bfetchpriority\s*=/.test(attrs) ||
        /\bdata-no-lazy\b/.test(attrs)
      ) {
        return match;
      }

      let nextAttrs = attrs;

      if (!/\bdecoding\s*=/.test(nextAttrs)) {
        nextAttrs += ' decoding="async"';
      }

      nextAttrs += ' loading="lazy"';

      return `<img${nextAttrs}>`;
    });
  });
  
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
