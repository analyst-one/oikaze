/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

it('can use angular material theme', () => {
  const { css } = sass.compile('examples/angular-material/style.scss', {
    loadPaths: ['node_modules/'],
  });
  expect(css).toMatchSnapshot();
});

it('can use bootstrap colors', () => {
  const { css } = sass.compile('examples/bootstrap/style.scss', {
    loadPaths: ['node_modules/'],
  });
  expect(css).toMatchSnapshot();
});

it('can use style dictionary map', () => {
  const { css } = sass.compile('examples/styled-dictionary/style.scss', {
    loadPaths: ['node_modules/'],
  });
  expect(css).toMatchSnapshot();
});
