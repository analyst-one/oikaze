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
          large: 200%,
          xl: 4
        ),
        opacity: (
          20: 0.2,
          50: 50%,
          80: 80%
        )
      )
    )
  );
`;

const loadPaths = ['examples/custom/tokens', './', './oikaze/'];

describe('css-definitions', () => {
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
        --color-secondary: #f2f2f2;
        --size-small: 8px;
        --size-small--em: 0.5;
        --size-regular: 16px;
        --size-regular--em: 1;
        --size-large: 200%;
        --size-large--em: 2;
        --size-xl: 4;
        --size-xl--em: 4;
        --opacity-20: 0.2;
        --opacity-20--em: 0.2;
        --opacity-50: 50%;
        --opacity-50--em: 0.5;
        --opacity-80: 80%;
        --opacity-80--em: 0.8;
      }"
    `);
  });

  it('spreads alternative', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
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

  it('sizes are also output as --em', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
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

      @include tokens.dangerously-add-set('alt', (
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

  it('spreads on a sub map', () => {
    const input = `
      ${loadOikaze}
  
      :root {
        @include tokens.css-definitions('default:color');
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --color-primary: #93b733;
        --color-secondary: #f2f2f2;
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

      @include tokens.dangerously-add-set('alt', (
        hello: "world"
      ));

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

  it('falls back to defaiult if not defined in alt', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt2', ());

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

      @include tokens.dangerously-add-set('alt', (
            main: "{$color.primary}",
            second: "{color.secondary}",
            hello: "world",
            customer: (
              name: (
                first: "John"
              )
            ),
            sm: "{$size.small}",
            lg: "{size.large}"
          )
        );

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

      @include tokens.dangerously-add-set('alt', (
        main: "{$color.primary}",
        second: "{color.secondary}",
        hello: "world",
        customer: (
          name: (
            first: "John"
          )
        ),
        sm: "{$size.small}",
        lg: "{size.large}"
      )
    );

      /* #{ inspect(tokens.get("alt:$customer.name")) } */
      `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`"/* (first: "John") */"`);
  });

  it('gets the root', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        hello: "world",
        small: 32px,
        primary: red,
      ));

      /* #{ inspect(tokens.get("alt:$")) } */
      `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* (hello: "world", small: 32px, primary: red) */"`
    );
  });
});

describe('alpha', () => {
  it('gets an color and applies fixed alpha', () => {
    const input = `
      ${loadOikaze}

      :root {
        color: tokens.alpha("color.primary", 0.2);
        background-color: tokens.alpha("$color.primary", 0.8);
        border-color: tokens.alpha("color.primary", 80%);
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        color: color-mix(in srgb, var(--color-primary, #93b733) 20%, transparent);
        background-color: rgba(147, 183, 51, 0.8);
        border-color: color-mix(in srgb, var(--color-primary, #93b733) 80%, transparent);
      }"
    `);
  });

  it('gets an color and applies alpha by token', () => {
    const input = `
      ${loadOikaze}

      :root {
        color: tokens.alpha("color.primary", "$opacity.20");
        background-color: tokens.alpha("$color.secondary", "$opacity.80");
        border-color: tokens.alpha("color.primary", "opacity.50");
        d: tokens.alpha("$color.secondary", "$opacity.20");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        color: color-mix(in srgb, var(--color-primary, #93b733) 20%, transparent);
        background-color: rgba(242, 242, 242, 0.8);
        border-color: color-mix(in srgb, var(--color-primary, #93b733) calc(var(--opacity-50--em, 0.5) * 100%), transparent);
        d: rgba(242, 242, 242, 0.2);
      }"
    `);
  });
});

describe('sizes', () => {
  it('gets in rem by value', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.rem("$size.small");
        hello: tokens.rem("$size.large");
        hello: tokens.rem("$size.xl");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: 0.5rem;
        hello: 2rem;
        hello: 4rem;
      }"
    `);
  });

  it('gets in rem as var', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.rem("size.small");
        hello: tokens.rem("size.large");
        hello: tokens.rem("size.xl");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: calc(var(--size-small--em, 0.5) * 1rem);
        hello: calc(var(--size-large--em, 2) * 1rem);
        hello: calc(var(--size-xl--em, 4) * 1rem);
      }"
    `);
  });

  it('gets in em by value', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.em("$size.small");
        hello: tokens.em("$size.large");
        hello: tokens.em("$size.xl");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: 0.5em;
        hello: 2em;
        hello: 4em;
      }"
    `);
  });

  it('gets in em as var', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.em("size.small");
        hello: tokens.em("size.large");
        hello: tokens.em("size.xl");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: calc(var(--size-small--em, 0.5) * 1em);
        hello: calc(var(--size-large--em, 2) * 1em);
        hello: calc(var(--size-xl--em, 4) * 1em);
      }"
    `);
  });

  it('gets in percentage by value', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.percentage("$size.small");
        hello: tokens.percentage("$size.large");
        hello: tokens.percentage("$size.xl");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: 50%;
        hello: 200%;
        hello: 400%;
      }"
    `);
  });

  it('gets in percent as var', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.percentage("size.small");
        hello: tokens.percentage("size.large");
        hello: tokens.percentage("size.xl");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: calc(var(--size-small--em, 0.5) * 100%);
        hello: calc(var(--size-large--em, 2) * 100%);
        hello: calc(var(--size-xl--em, 4) * 100%);
      }"
    `);
  });
});

describe('references', () => {
  it('spreads references', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        main: "{$color.primary}",
        second: "{color.secondary}",
        hello: "world",
        customer: (
          name: (
            first: "John"
          )
        ),
        sm: "\${size.small}",
        lg: "{size.large}"
      )
    );

      :root {
        @include tokens.css-definitions('alt');
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --main: #93b733;
        --second: var(--color-secondary, #f2f2f2);
        --hello: "world";
        --customer-name-first: "John";
        --sm: 8px;
        --sm--em: 0.5;
        --lg: var(--size-large, 200%);
        --lg--em: var(--size-large--em, 2);
      }"
    `);
  });

  it('gets references', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        main: "{$color.primary}",
        second: "{color.secondary}",
        hello: "world",
        customer: (
          name: (
            first: "John"
          )
        ),
        sm: "{$size.small}",
        lg: "{size.large}"
      )
    );

      body {
        color: tokens.get("alt:main");
        background-color: tokens.get("alt:$main");

        fint-size: tokens.rem("alt:sm");
        padding: tokens.rem("alt:lg");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: var(--main, #93b733);
        background-color: #93b733;
        fint-size: calc(var(--sm--em, 0.5) * 1rem);
        padding: calc(var(--lg--em, var(--size-large--em, 2)) * 1rem);
      }"
    `);
  });

  it('gets references with alpha by var', () => {
    const input = `
    ${loadOikaze}

    @include tokens.dangerously-add-set('alt', (
      main: "{$color.primary}",
      second: "{color.secondary}",
    )
  );

    body {
      color: tokens.alpha("alt:main");
      background-color: tokens.alpha("alt:second", 0.7);
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: color-mix(in srgb, var(--main, #93b733) 100%, transparent);
        background-color: color-mix(in srgb, var(--second, var(--color-secondary, #f2f2f2)) 70%, transparent);
      }"
    `);
  });

  it('gets references with alpha by abs', () => {
    const input = `
    ${loadOikaze}

    @include tokens.dangerously-add-set('alt', (
      main: "{$color.primary}",
      second: "{color.secondary}",
    )
  );

    body {
      color: tokens.alpha("alt:$main", 0.3);
      background-color: tokens.alpha("alt:$second", 0.7);
    }`;

    const result = sass.compileString(input, { loadPaths });

    // TODO: Should be fixed value
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: rgba(147, 183, 51, 0.3);
        background-color: rgba(242, 242, 242, 0.7);
      }"
    `);
  });

  it('gets references with rem by var', () => {
    const input = `
    ${loadOikaze}

    @include tokens.dangerously-add-set('alt', (
      sm: "{$size.small}",
      lg: "{size.large}"
    )
  );

    body {
      margin: tokens.rem("alt:sm");
      padding: tokens.rem("alt:lg");
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      "body {
        margin: calc(var(--sm--em, 0.5) * 1rem);
        padding: calc(var(--lg--em, var(--size-large--em, 2)) * 1rem);
      }"
    `);
  });

  it('gets references with rem by abs', () => {
    const input = `
    ${loadOikaze}

    @include tokens.dangerously-add-set('alt', (
      sm: "{$size.small}",
      lg: "{size.large}"
    )
  );

    body {
      margin: tokens.rem("alt:$sm");
      padding: tokens.rem("alt:$lg");
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      "body {
        margin: 0.5rem;
        padding: 2rem;
      }"
    `);
  });
});

describe('scope', () => {
  it('gets an spreads references in scope', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        main: "{$color.primary}",
        second: "{color.secondary}",
        hello: "world",
        customer: (
          name: (
            first: "John"
          )
        ),
        sm: "{$size.small}",
        lg: "{size.large}"
      )
    );

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
        --second: var(--color-secondary, #f2f2f2);
        --hello: "world";
        --customer-name-first: "John";
        --sm: 8px;
        --sm--em: 0.5;
        --lg: var(--size-large, 200%);
        --lg--em: var(--size-large--em, 2);
        color: var(--main, #93b733);
        background-color: #93b733;
      }"
    `);
  });
});

describe('all', () => {
  it('gets all tokens by var', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all()) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* color.primary color.secondary size.small size.regular size.large size.xl opacity.20 opacity.50 opacity.80 */"`
    );
  });

  it('gets all tokens by value', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all('$')) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* "$color.primary" "$color.secondary" "$size.small" "$size.regular" "$size.large" "$size.xl" "$opacity.20" "$opacity.50" "$opacity.80" */"`
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
      }

      .padding--size-xl {
        color: 4rem;
      }"
    `);
  });
});

describe('errors', () => {
  it('throws error when token is not found', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("size.xlarge");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'Token not found: size.xlarge'
    );
  });

  it('throws error when a set is not found', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("other:size.xlarge");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'Set not found: other'
    );
  });

  it('throws error when trying to get alpha from non-color', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.alpha("size.small");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'alpha() only works with colors'
    );
  });

  it('throws error when trying to get rem from non-number', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.rem("color.primary");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'em() only works with numbers'
    );
  });

  it('throws error when trying to get rem from non-number', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.em("color.primary");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'em() only works with numbers'
    );
  });
});
