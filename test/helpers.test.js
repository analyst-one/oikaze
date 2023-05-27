/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require("sass");

// const loadOikaze = `
//   @use 'sass:meta';

//   @use './colors.scss' as color;
//   @use './sizes.scss' as size;

//   @use 'theme' as ok with (
//     $theme: (
//       ok--color: meta.module-variables(color),
//       ok--size: meta.module-variables(size),
//     )
//   );
// `;

const loadHelpers = `@use 'helpers' as helpers;`;
const loadPaths = ["test/fixtures/theme", "mixins"];

describe("to-rem", () => {
  it("converts some units to rem", () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rem(32px, 16px);
        width: helpers.to-rem(32pt, 16px);
        width: helpers.to-rem(10pc, 16px);
  
        width: helpers.to-rem(1cm, 16px);
        width: helpers.to-rem(1mm, 16px);
        width: helpers.to-rem(1in, 16px)
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
"body {
  width: 2rem;
  width: 2.6667rem;
  width: 10rem;
  width: 2.3622rem;
  width: 0.2362rem;
  width: 6rem;
}"
`);
  });

  it("handles different bases", () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rem(32px, 0.423333cm);
        width: helpers.to-rem(32pt, 0.423333cm);
        width: helpers.to-rem(10pc, 0.423333cm);
  
        width: helpers.to-rem(1cm, 0.423333cm);
        width: helpers.to-rem(1mm, 0.423333cm);
        width: helpers.to-rem(1in, 0.423333cm)
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
"body {
  width: 2rem;
  width: 2.6667rem;
  width: 10rem;
  width: 2.3622rem;
  width: 0.2362rem;
  width: 6rem;
}"
`);
  });

  it("leaves units that don't convert", () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rem(1%, 16px);
        width: helpers.to-rem(1em, 16px);
        width: helpers.to-rem(1ex, 16px);
        width: helpers.to-rem(1ch, 16px);
        width: helpers.to-rem(1vw, 16px);
        width: helpers.to-rem(1vh, 16px);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
  "body {
    width: 1%;
    width: 1em;
    width: 1ex;
    width: 1ch;
    width: 1vw;
    width: 1vh;
  }"
  `);
  });

  it("special case for 0", () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rem(0%, 16px);
        width: helpers.to-rem(0em, 16px);
        width: helpers.to-rem(0ex, 16px);
        width: helpers.to-rem(0ch, 16px);
        width: helpers.to-rem(0vw, 16px);
        width: helpers.to-rem(0vh, 16px);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
  "body {
    width: 0rem;
    width: 0rem;
    width: 0rem;
    width: 0rem;
    width: 0rem;
    width: 0rem;
  }"
  `);
  });
});

describe("to-rgb", () => {
  it("converts colors to rbg", () => {
    const input = `
      ${loadHelpers}
  
      body {
        --color: rgb(#{helpers.to-rgb(#ff0000)});
        --color: rgb(#{helpers.to-rgb(rgb(0, 255, 0))});
        --color: rgb(#{helpers.to-rgb(blue)});
      }`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
"body {
  --color: rgb(255,0,0);
  --color: rgb(0,255,0);
  --color: rgb(0,0,255);
}"
`);
  });
});
