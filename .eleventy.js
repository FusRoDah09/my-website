module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  
  // Collection for blog posts
  eleventyConfig.addCollection("writings", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/writings/*.md").reverse();
  });
  
  // Filter to group posts by month/year
  eleventyConfig.addFilter("groupByMonthYear", function(posts) {
    const grouped = {};
    posts.forEach(post => {
      const date = new Date(post.date);
      const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(post);
    });
    return grouped;
  });
  
  return {
    dir: {
      input: "src",
      output: "_site"
    }
    // No pathPrefix needed for custom domain
  };
};