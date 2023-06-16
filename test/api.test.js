/**
 * @jest-environment jest-environment-node-single-context
 */

const sass = require('sass');

const loadOikaze = `
  @use 'sass:meta';
  @use "sass:map";
  @use "sass:list";
  @use "sass:string";
  @use "helpers" as *;

  @use 'oikaze' as tokens with (
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
      ),
      alt: (
        main: "{$color.primary}",
        second: "{color.secondary}",
        hello: "world",
        customer: (
          name: (
            first: "John"
          )
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
        @include tokens.css-definitions();
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
        @include tokens.css-definitions('alt');
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
        'red': red
      ));

      :root {
        @include tokens.css-definitions('alt');
      }
      
      `;

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
        @include tokens.css-definitions('alt');
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
        @include tokens.css-definitions(alt);
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

      :root {
        hello: tokens.get("alt:hello");
        hello: tokens.get("alt:$hello");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--hello, "world");
        hello: "world";
      }"
    `);
  });

  it('falls back to defalut if not defined in alt', () => {
    const input = `
      ${loadOikaze}

      @include tokens.add-set('alt2', ());

      :root {
        color: tokens.get("alt2:color.primary");
        background: tokens.get("alt2:$color.primary");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        color: var(--color-primary, #93b733);
        background: #93b733;
      }"
    `);
  });

  it('gets deeply nested token', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("alt:customer.name.first");
        hello: tokens.get("alt:$customer.name.first");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: var(--customer-name-first, "John");
        hello: "John";
      }"
    `);
  });

  it('gets a map', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.get("alt:$customer.name")) } */
      `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* (first: "John") */"`);
  });

  it('gets the root', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.get("alt:$")) } */
      `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* (main: "{$color.primary}", second: "{color.secondary}", hello: "world", customer: (name: (first: "John"))) */"`
    );
  });
});

describe('colors', () => {
  it('gets an color and applies alpha', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("color.primary");
        hello: tokens.get("$color.primary");

        hello: tokens.alpha("color.primary", 0.2);
        hello: tokens.alpha("$color.primary", 0.8);
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

describe('references', () => {
  it('spreads references', () => {
    const input = `
      ${loadOikaze}

      :root {
        @include tokens.css-definitions('alt');
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --main: #93b733;
        --main--rgb: "147,183,51";
        --second: var(--color-secondary, #f2f2f2);
        --second--rgb: var(--color-secondary--rgb, "242,242,242");
        --hello: "world";
        --customer-name-first: "John";
      }"
    `);
  });

  it('gets references', () => {
    const input = `
      ${loadOikaze}

      body {
        color: tokens.get("alt:main");
        background-color: tokens.get("alt:$main")
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: var(--main, #93b733);
        background-color: #93b733;
      }"
    `);
  });

  it('gets references with alpha', () => {
    const input = `
    ${loadOikaze}

    body {
      color: tokens.alpha("alt:main");
      background-color: tokens.alpha("alt:$main", 0.7)
    }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: rgba(var(--main--rgb, 147,183,51), 1);
        background-color: rgba(147, 183, 51, 0.7);
      }"
    `);
  });
});

describe('scope', () => {
  it('gets an spreads references in scope', () => {
    const input = `
      ${loadOikaze}

      @include tokens.scope('alt') {
        body {
          @include tokens.css-definitions();
  
          color: tokens.get('main');
          background-color: tokens.get('$main')
        }
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        --main: #93b733;
        --main--rgb: "147,183,51";
        --second: var(--color-secondary, #f2f2f2);
        --second--rgb: var(--color-secondary--rgb, "242,242,242");
        --hello: "world";
        --customer-name-first: "John";
        color: var(--main, #93b733);
        background-color: #93b733;
      }"
    `);
  });
});

describe('tokens', () => {
  it('gets all tokens by var', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all()) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* color.primary color.secondary size.small size.regular size.large */"`
    );
  });

  it('gets all tokens by value', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all('$')) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* "$color.primary" "$color.secondary" "$size.small" "$size.regular" "$size.large" */"`
    );
  });

  it('can iterate by var', () => {
    const input = `
      ${loadOikaze}

      @each $token in tokens.all('color') {
        $var: tokens.prop($token);

        .color#{$var} {
          color: tokens.get($token);
        }
      }
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ".color--color-primary {
        color: var(--color-primary, #93b733);
      }

      .color--color-secondary {
        color: var(--color-secondary, #f2f2f2);
      }"
    `);
  });

  it('can iterate by value', () => {
    const input = `
      ${loadOikaze}

      @each $token in tokens.all('$size') {
        $var: tokens.prop($token);

        .padding#{$var} {
          color: tokens.rem($token);
        }
      }
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ".padding--size-small {
        color: 0.5rem;
      }

      .padding--size-regular {
        color: 1rem;
      }

      .padding--size-large {
        color: 2rem;
      }"
    `);
  });
});
