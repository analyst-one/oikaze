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
        base-color: (
          CONFIG: (
            enable-define: false
          ),
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
          red-950: #330800
        ),
        color: (
          primary: '{$base-color.red-500}',
          secondary: #f2f2f2
        ),
        size: (
          xs: 4px,
          small: 8px,
          regular: 16px,
          large: 200%,
          xl: 4
        ),
        opacity: (
          20: 0.2,
          50: 50%,
          80: 80%
        ),
        font: (
          CONFIG: (
            enable-define: false
          ),
          family: ("Helvetica Neue", "Helvetica", "Arial"),
          normal: (
            font-size: "{size.regular}",
            line-height: "{size.large}",
            font-weight: 400,
            font-family: ("{$font.family}", sans-serif),
            color: "{color.primary}"
          )
        )
      ),
      alt: (
        main: "{$color.primary}",
        second: "{color.secondary}",
        sm: "{$size.small}",
        lg: "{size.large}"
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
        --color-primary: #CB1200;
        --color-secondary: #f2f2f2;
        --size-xs: 4px;
        --size-xs--em: 0.25;
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
        --color-primary: #CB1200;
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
        color: var(--color-primary, #CB1200);
        background-color: #CB1200;
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
        color: var(--color-primary, #CB1200);
        background: #CB1200;
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
        hello: #CB1200;
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
      `"/* (font-size: 16px, line-height: 200%, font-weight: 400, font-family: (("Helvetica Neue", "Helvetica", "Arial"), sans-serif), color: #CB1200) */"`
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
        color: color-mix(in srgb, var(--color-primary, #CB1200) 20%, transparent);
        background-color: rgba(203, 18, 0, 0.8);
        border-color: color-mix(in srgb, var(--color-primary, #CB1200) 80%, transparent);
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
        color: color-mix(in srgb, var(--color-primary, #CB1200) 20%, transparent);
        background-color: rgba(242, 242, 242, 0.8);
        border-color: color-mix(in srgb, var(--color-primary, #CB1200) calc(var(--opacity-50--em, 0.5) * 100%), transparent);
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

      :root {
        @include tokens.css-definitions('alt');
      }`;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(`
      ":root {
        --main: #CB1200;
        --second: var(--color-secondary, #f2f2f2);
        --sm: 8px;
        --sm--em: 0.5;
        --lg: var(--size-large, 200%);
        --lg--em: 2;
      }"
    `);
  });

  it('gets references', () => {
    const input = `
      ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        main: "{$color.primary}",
        second: "{color.secondary}",
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
        color: var(--main, #CB1200);
        background-color: #CB1200;
        fint-size: calc(var(--sm--em, 0.5) * 1rem);
        padding: calc(var(--lg--em, 2) * 1rem);
      }"
    `);
  });

  it('gets references with alpha by var', () => {
    const input = `
    ${loadOikaze}

    body {
      color: tokens.alpha("alt:main");
      background-color: tokens.alpha("alt:second", 0.7);
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: color-mix(in srgb, var(--main, #CB1200) 100%, transparent);
        background-color: color-mix(in srgb, var(--second, #f2f2f2) 70%, transparent);
      }"
    `);
  });

  it('gets references with alpha by abs', () => {
    const input = `
    ${loadOikaze}

    body {
      color: tokens.alpha("alt:$main", 0.3);
      background-color: tokens.alpha("alt:$second", 0.7);
    }`;

    const result = sass.compileString(input, { loadPaths });

    // TODO: Should be fixed value
    expect(result.css).toMatchInlineSnapshot(`
      "body {
        color: rgba(203, 18, 0, 0.3);
        background-color: rgba(242, 242, 242, 0.7);
      }"
    `);
  });

  it('gets references with rem by var', () => {
    const input = `
    ${loadOikaze}

    body {
      margin: tokens.rem("alt:sm");
      padding: tokens.rem("alt:lg");
    }`;

    const result = sass.compileString(input, { loadPaths });

    expect(result.css).toMatchInlineSnapshot(`
      "body {
        margin: calc(var(--sm--em, 0.5) * 1rem);
        padding: calc(var(--lg--em, 2) * 1rem);
      }"
    `);
  });

  it('gets references with rem by abs', () => {
    const input = `
    ${loadOikaze}

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

  it('gets references in lists', () => {
    const input = `
    ${loadOikaze}

      @include tokens.dangerously-add-set('alt', (
        border: (
          small: "{$size.small}" solid "{$color.primary}",
          large: "{size.large}" solid "{color.primary}"
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
        border: 8px solid #CB1200;
        border: 200% solid #CB1200;
        border: var(--border-small, 8px solid #CB1200);
        border: var(--border-large, 200% solid #CB1200);
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
        --main: #CB1200;
        --second: var(--color-secondary, #f2f2f2);
        --sm: 8px;
        --sm--em: 0.5;
        --lg: var(--size-large, 200%);
        --lg--em: 2;
        color: var(--main, #CB1200);
        background-color: #CB1200;
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
      `"/* base-color.red-50 base-color.red-100 base-color.red-200 base-color.red-300 base-color.red-400 base-color.red-500 base-color.red-600 base-color.red-700 base-color.red-800 base-color.red-900 base-color.red-950 color.primary color.secondary size.xs size.small size.regular size.large size.xl opacity.20 opacity.50 opacity.80 font.family font.normal.font-size font.normal.line-height font.normal.font-weight font.normal.font-family font.normal.color */"`
    );
  });

  it('gets all tokens by value', () => {
    const input = `
      ${loadOikaze}

      /* #{ inspect(tokens.all('$')) } */
    `;

    const result = sass.compileString(input, { loadPaths });
    expect(result.css).toMatchInlineSnapshot(
      `"/* "$base-color.red-50" "$base-color.red-100" "$base-color.red-200" "$base-color.red-300" "$base-color.red-400" "$base-color.red-500" "$base-color.red-600" "$base-color.red-700" "$base-color.red-800" "$base-color.red-900" "$base-color.red-950" "$color.primary" "$color.secondary" "$size.xs" "$size.small" "$size.regular" "$size.large" "$size.xl" "$opacity.20" "$opacity.50" "$opacity.80" "$font.family" "$font.normal.font-size" "$font.normal.line-height" "$font.normal.font-weight" "$font.normal.font-family" "$font.normal.color" */"`
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
        color: var(--color-primary, #CB1200);
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
      ".padding--size-xs {
        color: 0.25rem;
      }

      .padding--size-small {
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
        font-size: var(--size-regular, 16px);
        line-height: var(--size-large, 200%);
        font-weight: 400;
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
        color: var(--color-primary, #CB1200);
      }

      other {
        font-size: 16px;
        line-height: 200%;
        font-weight: 400;
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
        color: #CB1200;
      }"
    `);
  });
});
