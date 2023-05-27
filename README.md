# Oikaze

> _To live with a following wind_

## What is Oikaze?

Oikaze is a simple and lightweight solution for managing design tokens in SCSS. It is built on top of SCSS and CSS variables, so it is easy to integrate in any project. Oikaze doesn't impose any specific design system or opinion on the tokens, allowing you to use it with any design system of your choice. It also provides easy customization and encourages the use of CSS variable cascading by default.

Unlike other solutions, Oikaze is not a utility-first framework packed with classes that directly correspond to CSS styles. Instead, it offers a set of mixins that you can utilize to build your own classes.

## Why Oikaze?

Oikaze offers the following advantages:

- Built on top of SCSS.
- CSS variables first, SCSS variables as a fallback when needed.
- Provides mixins to generate CSS variables using safe SCSS functions.
- Provides mixins to retrieve the value of a token for use with other CSS/SCSS systems.
- Tokens and their related values are stored together in token sets.

### Why tokens not Utility Classes

Other tools provide a set of utility classes that you can use to style your components. This approach has some drawbacks:

- Learning a new set of classes in addition to CSS.
- Utility classes can become a domain-specific language (DSL) on top of CSS, which can be difficult to read and maintain.
- Moves the styling logic from CSS to HTML, making it less modular.
- Changes in design requirements may require modifications throughout the codebase.
- It's challenging to pass utility classes to other CSS/SCSS systems like Bootstrap or Angular Material.
- Leads to "redundant" utilities that map to the same value, such as bg-primary and text-primary.

### Why not just SCSS variables

While SCSS variables provide a solid foundation for design tokens, they have some limitations:

- Unlike CSS variables, SCSS variables are static at build time, making overriding more challenging.
- It can be difficult to pass SCSS variables to other systems like Bootstrap or Angular Material.

### Why not just CSS variables

CSS variables have their advantages but also come with limitations:

- Unlike SCSS variables, CSS variables alone lack safety checks (e.g., mistyping a variable name won't produce an error).
- Correct usage of CSS variables, with fallback values, can be verbose and difficult to maintain.

## How to use Oikaze?

### Prerequisites

- SCSS: You should already have a project using SCSS. Installing SCSS in your project is not covered here.
- CSS Variables: You should be targeting environments that support CSS variables.

### Installation

```bash
npm install -D oikaze
```

### Create token files

Create a file for each token category, such as colors.scss and sizes.scss. Each file should contain a set of SCSS variables. You can use any SCSS feature to generate the values.

> Hint: You can use [toolabs](https://app.toolabs.com/) to assist with token generation.

```scss
// colors.scss
$primary: #93b733;
$secondary: #f5f5f5;
```

```scss
// sizes.scss
$base: 16px;

$small: 8px;
$large: 32px;
```

### Create a Main Theme File

While not technically required, having a base file will make it easier to use Oikaze in your project. This file imports the main token sets and passes them to Oikaze, which is then forwarded for use in your project.

```scss
// base.scss
@use "sass:meta";

@use "./colors.scss" as colors;
@use "./sizes.scss" as sizes;

@forward "oikaze" with (
  $theme: (
    color: meta.module-variables(colors),
    size: meta.module-variables(sizes),
  )
);
```

### Use the default set

Import the set and use the mixins to generate the CSS variables. While not required you should use `:root` CSS pseudo-class as the target for the CSS variables from the base set. Use the provided functions to get the css variable or the value of the variable.

```scss
// styles.scss
@use './base.scss' as t;

:root {
  @include t.spread-variables();
}

body {
  color: t.get('color.primary'); // var(--color-primary, #93b733)
  font-size: t.get('size.regular'); // var(--size-regular, 16px)
  margin: t.get('$size.small'); // 8px
}
```

### Overriding the default set

Additional sets can be created as needed.

```scss
// styles.scss
@use "./base.scss" as t;

$altTheme: (
  color: (
    primary: #ff0000,
  ),
  size: (
    base: 14px,
    small: 7px,
    regular: 14px,
  ),
);

:root {
  @include t.spread-variables();
}

body {
  color: t.get('color.primary'); // var(--color-primary, #93b733)
  font-size: t.get('size.regular'); // var(--size-regular, 16px)
  margin: t.get('$size.small'); // 8px
}

body.alt {
  @include t.spread-variables($altTheme);
}

.element {
  color: t.get('color.primary', $altTheme); // var(--color-primary, #ff0000)
  font-size: t.get('size.regular', $altTheme); // var(--size-regular, 14px)
  margin: t.get('$size.small', $altTheme); // 7px
}
```

## API

### `t.spread-variables($theme: null)`

A mixin that will define CSS variables from the provided or default set.

Example:

```scss
:root {
  @include t.spread-variables();
}
```

will output:

```css
:root {
  --color-primary: #93b733;
  --color-primary--rgb: "147,183,51";
  --color-neutral: #f5f5f5;
  --color-neutral--rgb: "245,245,245";
  --size-base: 16px;
  --size-base--rem: 1rem;
  --size-small: 8px;
  --size-small--rem: 0.5rem;
  --size-large: 32px;
  --size-large--rem: 2rem;
}
```

#### `t.get($token, $theme: null)`

A function that will return the value of the variable. By default it will return the CSS variable with a fallback. If the `$token` argument starts with a `$` then it will return the value of the variable; equaivelen to using the SCSS variable directly.

Example:

```scss
.element {
  color: t.get('color.primary'); // var(--color-primary, #93b733)
  background-color: t.get('$color.primary'); // #93b733
}
```

### `t.alpha($key, $alpha, $theme: null)`

A function that will return a color with an opacity.

Example:

```scss
.element {
  color: t.alpha('color.primary', 0.5); // rgba(var(--color-primary--rgb, 147, 183, 51), 0.5)
  background-color: t.alpha('$color.primary', 0.5); // rgba(147, 183, 51, 0.5)
}
```

### `t.rem($key, $theme: null)`

A function that will return a size in rem units calculated relative to the base size defined in the set.

Example:

```scss
.element {
  font-size: t.rem('small'); // var(--size-small--rem, 0.5rem)
  line-height: t.rem('$small'); // 0.5rem;
}
```

## Examples

- Using Oikaze with a single token set [input](./examples/single.scss) [output](./examples/single.css)
- Using Oikaze with multiple token sets [input](./examples/multiple.scss) [output](./examples/multiple.css)
- Using Oikaze with Angular Material [input](./examples/angular-material.scss) [output](./examples/angular-material.css)
- Using Oikaze with Bootstrap [input](./examples/bootstrap.scss) [output](./examples/bootstrap.css)

## License

MIT

## Credits

Inspired by [UniformCSS](https://uniformcss.com/)
