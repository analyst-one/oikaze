/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

it('can use angular material theme', () => {
  const { css } = sass.compile('examples/angular-material.scss', {
    loadPaths: ['node_modules/'],
  });
  expect(css).toMatchSnapshot();
});

it('can use bootstrap colors', () => {
  const { css } = sass.compile('examples/bootstrap.scss', {
    loadPaths: ['node_modules/'],
  });
  expect(css).toMatchSnapshot();
});
