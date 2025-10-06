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
  
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};