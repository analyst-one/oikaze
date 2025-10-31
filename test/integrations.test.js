const sass = require('sass');

const sassConfig = {
  loadPaths: ['./', 'node_modules/'],
  importers: [new sass.NodePackageImporter()],
  silenceDeprecations: ['import', 'color-functions', 'global-builtin'],
};

it('can use angular material theme', () => {
  const { css } = sass.compile(
    'examples/angular-material/style.scss',
    sassConfig
  );
  expect(css).toMatchSnapshot();
});

it('can use bootstrap colors', () => {
  const { css } = sass.compile('examples/bootstrap/style.scss', sassConfig);
  expect(css).toMatchSnapshot();
});

it('can use style dictionary map', () => {
  const { css } = sass.compile(
    'examples/style-dictionary/style.scss',
    sassConfig
  );
  expect(css).toMatchSnapshot();
});
