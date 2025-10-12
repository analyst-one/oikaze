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

it('renders css with references', () => {
  const { css } = sass.compile('examples/three-tier/style.scss', { loadPaths });
  expect(css).toMatchSnapshot();
});

it('can generate classes', () => {
  const { css } = sass.compile('examples/custom/utilities.scss', { loadPaths });
  expect(css).toMatchSnapshot();
});

it('can generate utility class variants', () => {
  const { css } = sass.compile('examples/variants/utilities.scss', {
    loadPaths,
  });
  expect(css).toMatchSnapshot();
});

it('can include utility mixins', () => {
  const { css } = sass.compile('examples/utilities/utilities.scss', {
    loadPaths,
  });
  expect(css).toMatchSnapshot();
});
