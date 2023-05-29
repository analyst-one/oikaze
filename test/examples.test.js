/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');
const loadPaths = ['./'];

it('renders css for single theme', () => {
  const { css } = sass.compile('examples/custom/single.scss', { loadPaths });
  expect(css).toMatchSnapshot();
});

it('renders css for theme overrides', () => {
  const { css } = sass.compile('examples/custom/multi.scss', { loadPaths });
  expect(css).toMatchSnapshot();
});

it('renders css with prefixes', () => {
  const { css } = sass.compile('examples/custom/prefix.scss', { loadPaths });
  expect(css).toMatchSnapshot();
});
