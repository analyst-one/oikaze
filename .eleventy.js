const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAttrs = require('markdown-it-attrs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  const markdownLib = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAttrs);

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  // eleventyConfig.addPassthroughCopy("./src/img");

  return {
    pathPrefix: "oikaze-site",
    dir: {
      input: "src",
      output: "docs",
    },
  };
};
