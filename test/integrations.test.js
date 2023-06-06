/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

const loadPaths = ['./', 'node_modules/'];

it('can use angular material theme', () => {
  const { css } = sass.compile('examples/angular-material/style.scss', {
    loadPaths,
  });
  expect(css).toMatchSnapshot();
});

it('can use bootstrap colors', () => {
  const { css } = sass.compile('examples/bootstrap/style.scss', { loadPaths });
  expect(css).toMatchSnapshot();
});

it('can use style dictionary map', () => {
  const { css } = sass.compile('examples/style-dictionary/style.scss', {
    loadPaths,
  });
  expect(css).toMatchSnapshot();
});