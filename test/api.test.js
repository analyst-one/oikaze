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
      base: (
        // Base config provides base or primitive values
        // that can be used to build other tokens.
        // It is not meant to be used directly.
        // \`enable-define: false\` prevents it from being
        // included in CSS custom properties.

        CONFIG: (
          enable-define: false
        ),
        color: (
          red-50:	#FDE1E5,
          red-100: #FBC3C9,
          red-200: #F7898F,
          red-300: #EF5659,
          red-400: #E72B26,
          red-500: #CB1200,
          red-600: #A01500,
          red-700: #841300,
          red-800: #691000,
          red-900: #4E0D00,
          red-950: #330800,
          blue-50: #E3F2FD,
          blue-100: #BBDEFB,
          blue-200: #90CAF9,
          blue-300: #64B5F6,
          blue-400: #42A5F5,
          blue-500: #2196F3,
          blue-600: #1E88E5,
          blue-700: #1976D2,
          blue-800: #1565C0,
          blue-900: #0D47A1
        ),
        size: (
          xs: 4px,
          sm: 8px,
          base: 16px,
          lg: 200%,
          xl: 4
        )
      ),
      default: (
        color: (
          primary: '{base:$color.blue-800}',
          secondary: #f2f2f2,
          warning: '{base:$color.red-500}',
        ),
        opacity: (
          20: 0.2,
          50: 50%,
          80: 80%
        ),
        padding: (
          small: "{base:$size.sm}",
          large: "{base:$size.lg}"
        ),
        font: (
          xsmall: 4px,
          small: "{base:$size.sm}",
          base: "{base:$size.base}",
          large: "{base:$size.lg}",
          xlarge: 200%,
          family: ("Helvetica Neue", "Helvetica", "Arial"),
          normal: (
            font-size: "{font.base}",
            line-height: "{font.large}",
            font-weight: 400,
            font-family: ("{$font.family}", sans-serif),
            color: "{color.primary}"
          )
        )
      ),
      alt: (
        color: (
          primary: "{default:$color.primary}",
          secondary: "{default:color.secondary}",
        ),
        font: (
          xsmall: 2px,
          small: "{base:$size.xs}",
          large: "{base:$size.xl}",
          xlarge: 400%
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
        --color-primary: #1565C0;
        --color-secondary: #f2f2f2;
        --color-warning: #CB1200;
        --opacity-20: 0.2;
        --opacity-20--em: 0.2;
        --opacity-50: 50%;
        --opacity-50--em: 0.5;
        --opacity-80: 80%;
        --opacity-80--em: 0.8;
        --padding-small: 8px;
        --padding-small--em: 0.5;
        --padding-large: 200%;
        --padding-large--em: 2;
        --font-xsmall: 4px;
        --font-xsmall--em: 0.25;
        --font-small: 8px;
        --font-small--em: 0.5;
        --font-base: 16px;
        --font-base--em: 1;
        --font-large: 200%;
        --font-large--em: 2;
        --font-xlarge: 200%;
        --font-xlarge--em: 2;
        --font-family: "Helvetica Neue", "Helvetica", "Arial";
        --font-normal-font-size: var(--font-base, 16px);
        --font-normal-font-size--em: 1;
        --font-normal-line-height: var(--font-large, 200%);
        --font-normal-line-height--em: 2;
        --font-normal-font-weight: 400;
        --font-normal-font-weight--em: 400;
        --font-normal-font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
        --font-normal-color: var(--color-primary, #1565C0);
      }"
    `);
  });

  it('spreads alternative set', () => {
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
        --color-primary: #1565C0;
        --color-secondary: #f2f2f2;
        --color-warning: #CB1200;
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
        color: var(--color-primary, #1565C0);
        background-color: #1565C0;
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

  it('falls back to default if not defined in alt', () => {
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
        color: var(--color-primary, #1565C0);
        background: #1565C0;
      }"
    `);
  });

  it('gets deeply nested token', () => {
    const input = `
      ${loadOikaze}

      :root {
        weight: tokens.get("font.normal.font-weight");
        hello: tokens.get("$font.normal.color");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        weight: var(--font-normal-font-weight, 400);
        hello: #1565C0;
      }"
    `);
  });

  it('gets a map', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.get("$font.normal")) } */
      `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* (font-size: 16px, line-height: 200%, font-weight: 400, font-family: (("Helvetica Neue", "Helvetica", "Arial"), sans-serif), color: #1565C0) */"`
    );
  });

  it('gets a list', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.get("$font.family")) } */
      `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* "Helvetica Neue", "Helvetica", "Arial" */"`
    );
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

  it('throws error when token is not found', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("size.xlarge");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      `Token 'size.xlarge' not found.`
    );
  });

  it('gets a token value even when var is not defined as a CSS custom property', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("base:$color.red-50");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: #FDE1E5;
      }"
    `);
  });

  it('throws error when token is not defined as a CSS custom property', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.get("base:color.red-50");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      "'--color-red-50' is not defined as a CSS custom property."
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
});

describe('alpha', () => {
  it('gets a color and applies fixed alpha', () => {
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
        color: color-mix(in srgb, var(--color-primary, #1565C0) 20%, transparent);
        background-color: rgba(21, 101, 192, 0.8);
        border-color: color-mix(in srgb, var(--color-primary, #1565C0) 80%, transparent);
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
        color: color-mix(in srgb, var(--color-primary, #1565C0) 20%, transparent);
        background-color: rgba(242, 242, 242, 0.8);
        border-color: color-mix(in srgb, var(--color-primary, #1565C0) calc(var(--opacity-50--em, 0.5) * 100%), transparent);
        d: rgba(242, 242, 242, 0.2);
      }"
    `);
  });

  it('throws error when trying to get alpha from non-color', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.alpha("base:size.sm");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'alpha() only works with colors'
    );
  });

  it('throws error when not defined as a CSS custom property', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.alpha("base:color.red-50");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      "'--color-red-50' is not defined as a CSS custom property."
    );
  });
});

describe('em', () => {
  it('gets in em by value', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.em("base:$size.sm");
        hello: tokens.em("base:$size.lg");
        hello: tokens.em("base:$size.xl");
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
        hello: tokens.em("font.small");
        hello: tokens.em("font.large");
        hello: tokens.em("font.xlarge");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: calc(var(--font-small--em, 0.5) * 1em);
        hello: calc(var(--font-large--em, 2) * 1em);
        hello: calc(var(--font-xlarge--em, 2) * 1em);
      }"
    `);
  });

  it('throws error when trying to get em from non-number', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.em("color.primary");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      'em() only works with numbers'
    );
  });

  it('throws error when not defined as a CSS custom property', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.em("base:size.xs");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      "'--size-xs' is not defined as a CSS custom property."
    );
  });
});

describe('rem', () => {
  it('gets in rem by value', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.rem("$font.small");
        hello: tokens.rem("$font.large");
        hello: tokens.rem("$font.xlarge");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: 0.5rem;
        hello: 2rem;
        hello: 2rem;
      }"
    `);
  });

  it('gets in rem as var', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.rem("font.small");
        hello: tokens.rem("font.large");
        hello: tokens.rem("font.xlarge");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: calc(var(--font-small--em, 0.5) * 1rem);
        hello: calc(var(--font-large--em, 2) * 1rem);
        hello: calc(var(--font-xlarge--em, 2) * 1rem);
      }"
    `);
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

  it('throws error when not defined as a CSS custom property', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.rem("base:size.xs");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      "'--size-xs' is not defined as a CSS custom property."
    );
  });
});

describe('percentage', () => {
  it('gets in percentage by value', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.percentage("$font.small");
        hello: tokens.percentage("$font.large");
        hello: tokens.percentage("$font.xlarge");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: 50%;
        hello: 200%;
        hello: 200%;
      }"
    `);
  });

  it('gets in percent as var', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.percentage("font.small");
        hello: tokens.percentage("font.large");
        hello: tokens.percentage("font.xlarge");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        hello: calc(var(--font-small--em, 0.5) * 100%);
        hello: calc(var(--font-large--em, 2) * 100%);
        hello: calc(var(--font-xlarge--em, 2) * 100%);
      }"
    `);
  });

  it('throws error when not defined as a CSS custom property', () => {
    const input = `
      ${loadOikaze}

      :root {
        hello: tokens.percentage("base:size.xs");
      }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      "'--size-xs' is not defined as a CSS custom property."
    );
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
        --color-primary: #1565C0;
        --color-secondary: var(--color-secondary, #f2f2f2);
        --font-xsmall: 2px;
        --font-xsmall--em: 0.125;
        --font-small: 4px;
        --font-small--em: 0.25;
        --font-large: 4;
        --font-large--em: 4;
        --font-xlarge: 400%;
        --font-xlarge--em: 4;
      }"
    `);
  });

  it('gets references', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        main: "{$color.primary}",
        second: "{color.secondary}",
        sm: "{$font.small}",
        lg: "{font.large}"
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
        color: var(--main, #1565C0);
        background-color: #1565C0;
        fint-size: calc(var(--sm--em, 0.5) * 1rem);
        padding: calc(var(--lg--em, 2) * 1rem);
      }"
    `);
  });

  it('gets references with alpha by var', () => {
    const input = `
    ${loadOikaze}

    :root.alt {
      @include tokens.css-definitions('alt');
    }

    body {
      color: tokens.alpha("alt:color.primary");
      background-color: tokens.alpha("alt:color.secondary", 0.7);
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      ":root.alt {
        --color-primary: #1565C0;
        --color-secondary: var(--color-secondary, #f2f2f2);
        --font-xsmall: 2px;
        --font-xsmall--em: 0.125;
        --font-small: 4px;
        --font-small--em: 0.25;
        --font-large: 4;
        --font-large--em: 4;
        --font-xlarge: 400%;
        --font-xlarge--em: 4;
      }

      body {
        color: color-mix(in srgb, var(--color-primary, #1565C0) 100%, transparent);
        background-color: color-mix(in srgb, var(--color-secondary, #f2f2f2) 70%, transparent);
      }"
    `);
  });

  it('gets references with alpha by abs', () => {
    const input = `
    ${loadOikaze}

    body {
      color: tokens.alpha("alt:$color.primary", 0.3);
      background-color: tokens.alpha("alt:$color.secondary", 0.7);
    }`;

    const result = sass.compileString(input, { loadPaths });

    // TODO: Should be fixed value
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: rgba(21, 101, 192, 0.3);
        background-color: rgba(242, 242, 242, 0.7);
      }"
    `);
  });

  it('gets references with rem by var', () => {
    const input = `
    ${loadOikaze}

    :root.alt {
      @include tokens.css-definitions('alt');
    }

    body {
      margin: tokens.rem("alt:font.small");
      padding: tokens.rem("alt:font.large");
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      ":root.alt {
        --color-primary: #1565C0;
        --color-secondary: var(--color-secondary, #f2f2f2);
        --font-xsmall: 2px;
        --font-xsmall--em: 0.125;
        --font-small: 4px;
        --font-small--em: 0.25;
        --font-large: 4;
        --font-large--em: 4;
        --font-xlarge: 400%;
        --font-xlarge--em: 4;
      }

      body {
        margin: calc(var(--font-small--em, 0.25) * 1rem);
        padding: calc(var(--font-large--em, 4) * 1rem);
      }"
    `);
  });

  it('gets references with rem by abs', () => {
    const input = `
    ${loadOikaze}

    :root.alt {
      @include tokens.css-definitions('alt');
    }

    body {
      margin: tokens.rem("alt:$font.small");
      padding: tokens.rem("alt:$font.large");
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      ":root.alt {
        --color-primary: #1565C0;
        --color-secondary: var(--color-secondary, #f2f2f2);
        --font-xsmall: 2px;
        --font-xsmall--em: 0.125;
        --font-small: 4px;
        --font-small--em: 0.25;
        --font-large: 4;
        --font-large--em: 4;
        --font-xlarge: 400%;
        --font-xlarge--em: 4;
      }

      body {
        margin: 0.25rem;
        padding: 4rem;
      }"
    `);
  });

  it('gets references in lists', () => {
    const input = `
    ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        border: (
          small: "{base:$size.sm}" solid "{$color.primary}",
          large: "{font.large}" solid "{color.primary}"
        )
      ));

      body {
        border: tokens.get("alt:$border.small");
        border: tokens.get("alt:$border.large");
        border: tokens.get("alt:border.small");
        border: tokens.get("alt:border.large");
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        border: 8px solid #1565C0;
        border: 200% solid #1565C0;
        border: var(--border-small, 8px solid #1565C0);
        border: var(--border-large, 200% solid #1565C0);
      }"
    `);
  });

  fit('throws error when references is not found', () => {
    const input = `
        ${loadOikaze}
  
        @include tokens.dangerously-add-set('alt', (
          main: "{$color.main}"
        )
      );
  
        body {
          color: tokens.get("alt:main");
        }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      `Token 'color.main' not found.`
    );
  });

  it('throws error when references is not defined as a CSS custom property', () => {
    const input = `
        ${loadOikaze}
  
        @include tokens.dangerously-add-set('alt', (
          main: "{base:color.blue-800}"
        )
      );
  
        body {
          color: tokens.get("alt:main");
        }`;

    expect(() => sass.compileString(input, { loadPaths })).toThrow(
      `'--color-blue-800' is not defined as a CSS custom property.`
    );
  });
});

describe('scope', () => {
  it('gets and spreads references in scope', () => {
    const input = `
      ${loadOikaze}

      @include tokens.scope('alt') {
        :root.alt {
          @include tokens.css-definitions();
        }

        body {
          color: tokens.get('color.primary');
          background-color: tokens.get('$color.secondary');
        }
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root.alt {
        --color-primary: #1565C0;
        --color-secondary: var(--color-secondary, #f2f2f2);
        --font-xsmall: 2px;
        --font-xsmall--em: 0.125;
        --font-small: 4px;
        --font-small--em: 0.25;
        --font-large: 4;
        --font-large--em: 4;
        --font-xlarge: 400%;
        --font-xlarge--em: 4;
      }

      body {
        color: var(--color-primary, #1565C0);
        background-color: #f2f2f2;
      }"
    `);
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
});

describe('all', () => {
  it('gets all tokens by var', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all()) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* color.primary color.secondary color.warning opacity.20 opacity.50 opacity.80 padding.small padding.large font.xsmall font.small font.base font.large font.xlarge font.family font.normal.font-size font.normal.line-height font.normal.font-weight font.normal.font-family font.normal.color */"`
    );
  });

  it('gets all tokens by value', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all('$')) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* "$color.primary" "$color.secondary" "$color.warning" "$opacity.20" "$opacity.50" "$opacity.80" "$padding.small" "$padding.large" "$font.xsmall" "$font.small" "$font.base" "$font.large" "$font.xlarge" "$font.family" "$font.normal.font-size" "$font.normal.line-height" "$font.normal.font-weight" "$font.normal.font-family" "$font.normal.color" */"`
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
        color: var(--color-primary, #1565C0);
      }

      .color--color-secondary {
        color: var(--color-secondary, #f2f2f2);
      }

      .color--color-warning {
        color: var(--color-warning, #CB1200);
      }"
    `);
  });

  it('can iterate by value', () => {
    const input = `
      ${loadOikaze}

      @each $token in tokens.all('$padding') {
        $var: tokens.basename($token);

        .padding-#{$var} {
          color: tokens.rem($token);
        }
      }
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ".padding-small {
        color: 0.5rem;
      }

      .padding-large {
        color: 2rem;
      }"
    `);
  });
});

describe('complex tokens', () => {
  it('can apply a complex token', () => {
    const input = `
    ${loadOikaze}
  
    element {
      @include tokens.apply('font.normal');
    }
    
    other {
      @include tokens.apply('$font.normal');
    }
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      "element {
        font-size: var(--font-base, 16px);
        line-height: var(--font-large, 200%);
        font-weight: 400;
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
        color: var(--color-primary, #1565C0);
      }

      other {
        font-size: 16px;
        line-height: 200%;
        font-weight: 400;
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
        color: #1565C0;
      }"
    `);
  });
});
