/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require("sass");

it("renders css for single theme", () => {
  const { css } = sass.compile("test/fixtures/single-theme.scss");
  expect(css).toMatchSnapshot();
});

it("renders css for theme overrides", () => {
  const { css } = sass.compile("test/fixtures/multi-theme.scss");
  expect(css).toMatchSnapshot();
});

it("renders css with prefixes", () => {
  const { css } = sass.compile("test/fixtures/with-prefix.scss");
  expect(css).toMatchSnapshot();
});
