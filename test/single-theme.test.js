/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

it('renders css variables for single theme', () => {
  const {css} = sass.compile('test/fixtures/single-theme.scss');
  expect(css).toMatchInlineSnapshot(`
":root {
  --color-primary-200: #aed051;
  --color-primary-200--rgb: "174,208,81";
  --color-primary-300: #c3dd7b;
  --color-primary-300--rgb: "195,221,123";
  --color-primary-400: #d7e9a6;
  --color-primary-400--rgb: "215,233,166";
  --color-primary: #93b733;
  --color-primary--rgb: "147,183,51";
  --color-primary-600: #75912b;
  --color-primary-600--rgb: "117,145,43";
  --color-primary-700: #576b21;
  --color-primary-700--rgb: "87,107,33";
  --color-primary-800: #3a4717;
  --color-primary-800--rgb: "58,71,23";
  --color-neutral: #fefefe;
  --color-neutral--rgb: "254,254,254";
  --color-neutral-600: #ffffff;
  --color-neutral-600--rgb: "255,255,255";
  --color-neutral-500: #ffffff;
  --color-neutral-500--rgb: "255,255,255";
  --color-neutral-400: #ffffff;
  --color-neutral-400--rgb: "255,255,255";
  --color-neutral-300: #fefefe;
  --color-neutral-300--rgb: "254,254,254";
  --color-neutral-200: #fefefe;
  --color-neutral-200--rgb: "254,254,254";
  --color-neutral-100: #fefefe;
  --color-neutral-100--rgb: "254,254,254";
  --color-neutral-800: #7f7f7f;
  --color-neutral-800--rgb: "127,127,127";
  --color-neutral-900: #000000;
  --color-neutral-900--rgb: "0,0,0";
  --size-root: 16px;
  --size-base: 16px;
  --size-none: 0px;
  --size-xx-small: 2px;
  --size-x-small: 4px;
  --size-small: 8px;
  --size-regular: 16px;
  --size-large: 32px;
  --size-x-large: 64px;
  --size-xx-large: 128px;
}

.test {
  color: #93b733;
  color: #93b733;
  color: #93b733;
  color: var(--color-primary, #93b733);
  color: var(--color-primary, #93b733);
  color: var(--color-primary, #93b733);
  color: var(--color-primary, #93b733);
  color: #93b733;
  color: rgba(147, 183, 51, 0.2);
  color: rgba(var(--color-primary--rgb, 147,183,51), 0.2);
  color: rgba(var(--color-primary--rgb, 147,183,51), 0.2);
  color: rgba(147, 183, 51, 0.2);
  font-size: 16px;
  font-size: var(--size-regular, 16px);
  font-size: var(--size-regular, 16px);
  font-size: 16px;
  font-size: calc(var(--size-small, 8px) / var(--size-base, 16px) * 1rem);
  font-size: calc(var(--size-small, 8px) / var(--size-base, 16px) * 1rem);
  font-size: 0.5rem;
}"
`);
});
