const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItContainer = require('markdown-it-container');
const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  const markdownLib = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  })
    .use(markdownItAttrs)
    .use(markdownItContainer, 'div');

  eleventyConfig.setLibrary('md', markdownLib);

  eleventyConfig.addWatchTarget('./src/sass/');
  eleventyConfig.addWatchTarget('./examples/');

  eleventyConfig.addPassthroughCopy('./src/css');
  eleventyConfig.addPassthroughCopy('./src/js');
  eleventyConfig.addPassthroughCopy('./src/img');
  eleventyConfig.addPassthroughCopy('.nojekyll');
  eleventyConfig.addPassthroughCopy('favicon.ico');

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  return {
    pathPrefix: 'oikaze',
    dir: {
      input: 'src',
      output: 'docs',
    },
  };
};
