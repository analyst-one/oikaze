/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

const loadHelpers = `@use 'helpers' as helpers;`;
const loadPaths = ['test/fixtures/theme', './', './oikaze/'];

describe('to-rem', () => {
  it('converts units to rel', () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rel(32px, 16px);
        width: helpers.to-rel(32pt, 16px);
        width: helpers.to-rel(10pc, 16px);
  
        width: helpers.to-rel(1cm, 16px);
        width: helpers.to-rel(1mm, 16px);
        width: helpers.to-rel(1in, 16px)
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        width: 2;
        width: 2.6667;
        width: 10;
        width: 2.3622;
        width: 0.2362;
        width: 6;
      }"
    `);
  });

  it('handles different bases', () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rel(32px, 0.423333cm);
        width: helpers.to-rel(32pt, 0.423333cm);
        width: helpers.to-rel(10pc, 0.423333cm);
  
        width: helpers.to-rel(1cm, 0.423333cm);
        width: helpers.to-rel(1mm, 0.423333cm);
        width: helpers.to-rel(1in, 0.423333cm)
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        width: 2;
        width: 2.6667;
        width: 10;
        width: 2.3622;
        width: 0.2362;
        width: 6;
      }"
    `);
  });

  it("leaves units that don't convert", () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rel(1%, 16px);
        width: helpers.to-rel(1em, 16px);
        width: helpers.to-rel(1ex, 16px);
        width: helpers.to-rel(1ch, 16px);
        width: helpers.to-rel(1vw, 16px);
        width: helpers.to-rel(1vh, 16px);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
        "body {
          width: 0.01;
          width: 1;
          width: 1;
          width: 1;
          width: 1;
          width: 1;
        }"
      `);
  });

  it('special case for 0', () => {
    const input = `
      ${loadHelpers}
  
      body {
        width: helpers.to-rel(0%, 16px);
        width: helpers.to-rel(0em, 16px);
        width: helpers.to-rel(0ex, 16px);
        width: helpers.to-rel(0ch, 16px);
        width: helpers.to-rel(0vw, 16px);
        width: helpers.to-rel(0vh, 16px);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
        "body {
          width: 0;
          width: 0;
          width: 0;
          width: 0;
          width: 0;
          width: 0;
        }"
      `);
  });
});

describe('starts-with', () => {
  it('single char', () => {
    const input = `${loadHelpers} /* #{ helpers.starts-with('Hello', 'H') } */`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* true */"`);
  });

  it('multiple chars', () => {
    const input = `${loadHelpers} /* #{ helpers.starts-with('Hello', 'Hell') } */`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* true */"`);
  });

  it('false', () => {
    const input = `${loadHelpers} /* #{ helpers.starts-with('Hello', 'l') } */`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* false */"`);
  });
});

describe('ends-with', () => {
  it('single char', () => {
    const input = `${loadHelpers} /* #{ helpers.ends-with('Hello', 'o') } */`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* true */"`);
  });

  it('multiple char', () => {
    const input = `${loadHelpers} /* #{ helpers.ends-with('Hello', 'llo') } */`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* true */"`);
  });

  it('false', () => {
    const input = `${loadHelpers} /* #{ helpers.ends-with('Hellollo', 'l') } */`;
    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* false */"`);
  });
});
