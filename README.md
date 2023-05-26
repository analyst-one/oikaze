# Oikaze

> *To live with a following wind*

## What is Oikaze?

Oikaze is a simple and lightweight solution to manage design tokens in SCSS. It is built on top of SCSS and CSS variables, so it is easy to integrate in any project.  It provides no opinion on the tokens themselves, so you can use it with any design system.  It is also easy to override the default theme, and use CSS variable cascading.

Unlike other solutions, Oikaze is not a utility-first framework packed with classes that have 1:1 corrispondance with CSS styles.  Instead, it provides a set of mixins that you can use to build your own classes.

## Why Oikaze?

Oikaze:

- Is built on top of SCSS and CSS variables
- Provides a set of mixins to generate CSS variables using safe SCSS functions
- Provides a set of mixins to retreive the value of a token to use with other CSS/SCSS systems
- All related values are stored together

### Why tokens not utility classes

Other tools provide a set of utility classes that you can use to style your components.  This approach has some drawbacks:

- You have to learn a new set of classes, in addition to CSS
- The classes become a DSL on top of CSS, which can be difficult to read and maintain
- Moves the styling logic from CSS to HTML
- A change to design requirements could require changes across the codebase
- Once the theme is defined using the utility classes, it is difficult to pass them along to other other CSS/SCSS systems (e.g. Bootstrap, Angular Material)
- Creates "redundant" utilites that map to the same value (e.g. `bg-primary` and `text-primary`)

### Why not just SCSS variables

SCSS variables form a great foundation for design tokens, but they have some limitations:

- Unlike CSS variables, they are static at build time, making roverriding more difficult
- Like utility classes, it is difficult to pass them along to other other systems (e.g. Bootstrap, Angular Material)

### Why not just CSS variables

CSS variables are great, but they have some limitations:

- Unlike SCSS variables, they are not safe (mistype a variable name and you get no error)
- When used correctly, with a fallback value, they can be verbose and difficult to maintain

## How to use Oikaze?

### Prerequisites

- SCSS, you should already have a project using SCSS, installing SCSS in your project is not covered here
- CSS variables, you should be targeting environments that support CSS variables

### Installation

```bash
npm install -D oikaze
```

### Create token files

Create a file for each token category, for example `colors.scss` and `sizes.scss`.  Each file should contain a set of SCSS variables.  Mothing more then a set of SCSS variables is required, but you can use any SCSS feature you want to generate the values.

> Hint: use [toolabs](https://app.toolabs.com/)

```scss
// colors.scss
$primary: #93b733;
$secondary: #f5f5f5;
```

```scss
// sizes.scss
$root: 16px;
$base: $root;

$small: 8px;
$regular: $root;
$large: 32px;
```

### Create a main theme file

While not technically required, having a base file will make it easier to use Oikaze in your project.  This file will import all the token files and pass the variables to Oikaze; which is then exported for use in your project.

```scss
// base.scss
@use "sass:meta";

@use './colors.scss' as colors;
@use './sizes.scss' as sizes;

@forward 'oikaze' with (
  $theme: (
    color: meta.module-variables(colors),
    size: meta.module-variables(sizes)
  )
);
```

### Use the default set

Import the set and use the mixins to generate the CSS variables.  While not required you should use `:root` CSS pseudo-class as the target for the CSS variables from the base set.  Use the provided functions to get the css variable or the value of the variable.

```scss
// styles.scss
@use "./base.scss" as t;

:root {
  @include t.spread-variables();
}

body {
  color: t.get('color.primary');     // var(--color-primary, #93b733)
  font-size: t.get('size.regular');  // var(--size-regular, 16px)
  margin: t.get('$size.small');      // 8px
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
    root: 14px,
    small: 7px,
    regular: 14px,
  ),
);

:root {
  @include t.spread-variables();
}

body {
  color: t.get('color.primary');     // var(--color-primary, #93b733)
  font-size: t.get('size.regular');  // var(--size-regular, 16px)
  margin: t.get('$size.small');      // 8px
}

body.alt {
  @include t.spread-variables($altTheme);
}

.element {
  color: t.get('color.primary', $altTheme);     // var(--color-primary, #ff0000)
  font-size: t.get('size.regular', $altTheme);  // var(--size-regular, 14px)
  margin: t.get('$size.small', $altTheme);      // 7px
}
```

## API

### Base

#### `t.spread-variables($theme: null)`

A mixin that will spread the variables from the theme element.

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
}
```

#### `t.get($token, $theme: null)`

A function that will return the value of the variable. By default it will return the CSS variable with a fallback.  If the `$token` argument starts with a `$` then it will return the value of the variable; equaivelen to using the SCSS variable directly.

Example:

```scss
.element {
  color: t.get('color.primary');              // var(--color-primary, #93b733)
  background-color: t.get('$color.primary');  // #93b733
}
```

### Colors

#### `t.alpha($key, $alpha, $theme: null)`

A function that will return a color with an opacity.

Example:

```scss
.element {
  color: t.alpha('color.primary', 0.5);              // rgba(var(--color-primary--rgb, 147, 183, 51), 0.5)
  background-color: t.alpha('$color.primary', 0.5);  // rgba(147, 183, 51, 0.5)
}
```

### Sizes

#### `t.rem($key, $theme: null)`

A function that will return a size in rem units calculated relative to the root size defined in the theme.

Example:

```scss
.element {
  font-size: t.rem('small');     // calc(var(--size-small, 8px) / var(--size-root, 16px) * 1rem)
  line-height: t.rem('$small');  // 0.5rem;
}
```

## License

MIT

## Credits

Inspired by [UniformCSS](https://uniformcss.com/)
