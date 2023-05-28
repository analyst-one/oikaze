/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

const loadOikaze = `
  @use 'sass:meta';

  @use './colors.scss' as color;
  @use './sizes.scss' as size;

  @use 'theme' as t with (
    $theme: (
      color: meta.module-variables(color),
      size: meta.module-variables(size),
    )
  );
`;

const loadPaths = ['examples/theme', 'mixins'];

describe('spread', () => {
  it('spreads a map to CSS vars', () => {
    const input = `
      ${loadOikaze}

      $set: (
        hello: "world"
      );
  
      :root {
        @include t.spread-variables($set);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --hello: "world";
      }"
    `);
  });

  it('colors are also output as rgb', () => {
    const input = `
      ${loadOikaze}

      $set: (
        red: red
      );
  
      :root {
        @include t.spread-variables($set);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --red: red;
        --red--rgb: "255,0,0";
      }"
    `);
  });

  it('sizes are also output as rem', () => {
    const input = `
      ${loadOikaze}

      $set: (
        small: 32px
      );
  
      :root {
        @include t.spread-variables($set);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --small: 32px;
        --small--em: 2;
      }"
    `);
  });

  it('sizes are also output as rem relitive to base if defined', () => {
    const input = `
      ${loadOikaze}

      $set: (
        base: 8px,
        small: 32px
      );
  
      :root {
        @include t.spread-variables($set);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --base: 8px;
        --base--em: 1;
        --small: 32px;
        --small--em: 4;
      }"
    `);
  });
});

describe('get', () => {
  it('gets an token', () => {
    const input = `
      ${loadOikaze}

      $set: (
        hello: "world"
      );

      :root {
        hello: t.get("hello", $set);
        hello: t.get("$hello", $set);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--hello, "world");
        hello: "world";
      }"
    `);
  });

  it('gets deeply nested token', () => {
    const input = `
      ${loadOikaze}

      $set: (
        customer: (
          name: (
            first: "John"
          )
        )
      );

      :root {
        hello: t.get("customer.name.first", $set);
        hello: t.get("$customer.name.first", $set);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--customer-name-first, "John");
        hello: "John";
      }"
    `);
  });
});

describe('colors', () => {
  it('gets an color and applies alpha', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: t.get("color.primary");
        hello: t.get("$color.primary");

        hello: t.with-opacity("color.primary", 0.2);
        hello: t.with-opacity("$color.primary", 0.8);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--color-primary, #93b733);
        hello: #93b733;
        hello: rgba(var(--color-primary--rgb, 147,183,51), 0.2);
        hello: rgba(147, 183, 51, 0.8);
      }"
    `);
  });
});

describe('sizes', () => {
  it('gets an sizes and rems', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: t.get("size.large");
        hello: t.get("$size.large");

        hello: t.rem("size.large");
        hello: t.rem("$size.large");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--size-large, 32px);
        hello: 32px;
        hello: calc(var(--size-large--em, 2) * 1rem);
        hello: 2rem;
      }"
    `);
  });
});
