/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

const loadOikaze = `
  @use 'sass:meta';

  @use 'theme' as tokens with (
    $sets: (
      default: (
        color: (
          primary: #93b733,
          secondary: #f2f2f2
        ),
        size: (
          small: 8px,
          regular: 16px,
          large: 32px
        )
      )
    )
  );
`;

const loadPaths = ['examples/custom/tokens', './', './oikaze/'];

describe('spread', () => {
  it('spreads default', () => {
    const input = `
      ${loadOikaze}
  
      :root {
        @include tokens.spread-variables();
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --color-primary: #93b733;
        --color-primary--rgb: "147,183,51";
        --color-secondary: #f2f2f2;
        --color-secondary--rgb: "242,242,242";
        --size-small: 8px;
        --size-small--em: 0.5;
        --size-regular: 16px;
        --size-regular--em: 1;
        --size-large: 32px;
        --size-large--em: 2;
      }"
    `);
  });

  it('spreads alternative', () => {
    const input = `
      ${loadOikaze}

      @include tokens.add-set('alt', (
        hello: "world"
      ));
  
      :root {
        @include tokens.spread-variables('alt');
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

      @include tokens.add-set('alt', (
        red: red
      ));
  
      :root {
        @include tokens.spread-variables('alt');
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --red: red;
        --red--rgb: "255,0,0";
      }"
    `);
  });

  it('sizes are also output as --em', () => {
    const input = `
      ${loadOikaze}

      @include tokens.add-set('alt', (
        small: 32px
      ));
  
      :root {
        @include tokens.spread-variables('alt');
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --small: 32px;
        --small--em: 2;
      }"
    `);
  });

  it('sizes are also output as --em relative to base if defined', () => {
    const input = `
      ${loadOikaze}

      @include tokens.add-set('alt', (
        CONFIG: (
          base: 8px
        ),
        small: 32px
      ));
  
      :root {
        @include tokens.spread-variables(alt);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --small: 32px;
        --small--em: 4;
      }"
    `);
  });
});

describe('get', () => {
  it('gets an token from default set', () => {
    const input = `
      ${loadOikaze}

      .element {
        color: tokens.get("color.primary");
        background-color: tokens.get("$color.primary");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ".element {
        color: var(--color-primary, #93b733);
        background-color: #93b733;
      }"
    `);
  });

  it('gets an token from alt set', () => {
    const input = `
      ${loadOikaze}

      @include tokens.add-set('alt', (
        hello: "world"
      ));

      :root {
        hello: tokens.get("hello", 'alt');
        hello: tokens.get("$hello", 'alt');
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

      @include tokens.add-set('alt', (
        customer: (
          name: (
            first: "John"
          )
        )
      ));

      :root {
        hello: tokens.get("customer.name.first", alt);
        hello: tokens.get("$customer.name.first", alt);
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
        hello: tokens.get("color.primary");
        hello: tokens.get("$color.primary");

        hello: tokens.with-opacity("color.primary", 0.2);
        hello: tokens.with-opacity("$color.primary", 0.8);
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
  it('gets px, rems and ems from default set', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("size.large");
        hello: tokens.get("$size.large");

        hello: tokens.rem("size.large");
        hello: tokens.rem("$size.large");

        hello: tokens.em("size.large");
        hello: tokens.em("$size.large");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--size-large, 32px);
        hello: 32px;
        hello: calc(var(--size-large--em, 2) * 1rem);
        hello: 2rem;
        hello: calc(var(--size-large--em, 2) * 1em);
        hello: 2em;
      }"
    `);
  });
});
