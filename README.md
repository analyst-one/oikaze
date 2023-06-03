# Oikaze

Streamline design token management with SCSS and CSS variables for seamless integration and flexible customization in any project.

> _To live with a following wind_

## What is Oikaze?

Oikaze is a simple and lightweight solution for managing design tokens in SCSS. It is built on top of SCSS and CSS custom properties (aka variables), so it is easy to integrate in any project. Oikaze doesn't impose any specific design system or opinion on the tokens, allowing you to use it with any design system of your choice. It also provides easy customization and encourages the use of CSS custom properties by default.

Unlike other solutions, Oikaze is not a utility-first framework packed with classes that directly correspond to CSS styles. Instead, it offers a set of mixins that you can utilize to build your own classes.

## Why Oikaze?

Oikaze offers the following advantages:

- Built on top of SCSS.
- CSS custom properties first, SCSS variables as a fallback when needed.
- Provides mixins to generate CSS custom properties using safe SCSS functions.
- Provides mixins to retrieve the value of a token for use with other CSS/SCSS systems.
- Tokens and their related values are organized into token sets.

### Why tokens not Utility Classes

Other tools provide a set of utility classes that you can use to style your components. This approach has some drawbacks:

- Learning a new set of classes in addition to CSS.
- Utility classes can become a domain-specific language (DSL) on top of CSS, which can be difficult to read and maintain.
- Moves the styling logic from CSS to HTML, making it less modular.
- Changes in design requirements may require modifications throughout the codebase.
- It's challenging to pass utility classes to other CSS/SCSS systems like Bootstrap or Angular Material.
- Leads to "redundant" utilities that map to the same value, such as `bg-primary` and `text-primary`.

### Why not just SCSS variables

While SCSS variables provide a solid foundation for design tokens, they have some limitations:

- Unlike CSS custom properties, SCSS variables are static at build time, making runtime overriding more challenging (or at least more verbose).
- It can be difficult to reference variables defined in ther systems.
- Variables in SASS are only scoped to the block they appear in, SCSS variables do not inherit.

### Why not just CSS custom properties

CSS custom properties have their advantages but also come with limitations:

- Unlike SCSS variables, CSS custom properties alone lack safety checks (e.g., mistyping a property name won't produce an error).
- It can be difficult to pass CSS variables to other systems like Bootstrap or Angular Material.
- Correct usage of CSS custom properties, with fallback values, can be verbose and difficult to maintain.

## How to use Oikaze?

### Prerequisites

- SCSS: You should already have a project using SCSS. Installing SCSS in your project is not covered here.
- CSS custom properties: You should be targeting environments that support CSS custom properties.

### Installation

```bash
npm install -D oikaze
```

### Create token files

Create a file for each token category, such as colors.scss and sizes.scss. Each file should contain a set of SCSS variables. You can use any SCSS feature to generate the values.

> Hint: You can use [toolabs](https://app.toolabs.com/) or [style-dictionary](https://amzn.github.io/style-dictionary/) to assist with token generation.

```scss
// colors.scss
$primary: #93b733;
$secondary: #f5f5f5;
```

```scss
// sizes.scss
$small: 8px;
$large: 32px;
```

### Create a Main Theme File

While not technically required, having a base file will make it easier to use Oikaze in your project.  This file imports the main token sets and passes them to Oikaze, which is then forwarded for use in your project.

```scss
// base.scss
@use 'sass:meta';

@use './colors.scss' as colors;
@use './sizes.scss' as sizes;

@forward 'oikaze' with (
  $sets: (
    default: (
      color: meta.module-variables(colors),
      size: meta.module-variables(sizes),
    )
  )
);
```

### Use the default set

Import the set and use the mixins to generate the CSS custom properties.  While not required common best practice is to use `:root` pseudo-class as the target for the CSS custom properties from the base set. Use the provided functions to get the CSS custom properties or it's value.

```scss
// styles.scss
@use './base.scss' as t;

:root {
  @include tokens.css-definitions();
}

body {
  color: tokens.get('color.primary'); // var(--color-primary, #93b733)
  font-size: tokens.get('size.large'); // var(--size-large, 32px)
  margin: tokens.get('$size.small'); // 8px
}
```

### Adding additional token sets

Additional sets can be created as needed.

```scss
// base.scss
@use 'sass:meta';

@use './colors.scss' as colors;
@use './sizes.scss' as sizes;

@forward 'oikaze' with (
  $sets: (
    default: (
      color: meta.module-variables(colors),
      size: meta.module-variables(sizes),
    ),
    alternative: (
      color: (
        primary: #ff0000,
      ),
      size: (
        small: 7px,
        large: 14px,
      )
    )
  )
);
```

```scss
// styles.scss
@use "./base.scss" as tokens;

:root {
  @include tokens.css-definitions();
}

body.alt {
  @include tokens.css-definitions('alternative');
}

.element {
  color: tokens.get('alternative:color.primary'); // var(--color-primary, #ff0000)
  font-size: tokens.get('alternative:size.regular'); // var(--size-regular, 14px)
  margin: tokens.get('alternative:$size.small'); // 7px
}
```

## API

### `tokens.css-definitions($set-name: $default)` Mixin

A mixin that will define CSS variables from the provided or default set.

Example:

```scss
:root {
  @include tokens.css-definitions();
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

#### `tokens.get($token)` Function

A function that will return the value of the variable. By default it will return the CSS variable with a fallback. If the `$token` argument starts with a `$` then it will return the value of the variable; equivalent to using the SCSS variable directly.  If the `$token` argument starts with a set name followed by a colon (`:`) then it will return the value of the variable from the specified set.

Example:

```scss
.element {
  color: tokens.get('color.primary'); // var(--color-primary, #93b733)
  background-color: tokens.get('$color.primary'); // #93b733
  border-color: tokens.get('alternative:$color.primary'); // #93b733
}
```

### `tokens.alpha($token, $alpha)` Function

A function that will return a color with an opacity.

Example:

```scss
.element {
  color: tokens.alpha('color.primary', 0.5); // rgba(var(--color-primary--rgb, 147, 183, 51), 0.5)
  background-color: tokens.alpha('$color.primary', 0.5); // rgba(147, 183, 51, 0.5)
  border-color: tokens.alpha('alternative:$color.primary', 0.5); // rgba(147, 183, 51, 0.5)
}
```

### `tokens.rem($token)` Function

A function that will return a size in rem units calculated relative to the base size defined in the set.

Example:

```scss
.element {
  font-size: tokens.rem('small'); // var(--size-small--rem, 0.5rem)
  line-height: tokens.rem('$small'); // 0.5rem;
  margin: tokens.rem('alternative:$size.small'); // 0.5rem;
}
```

### `tokens.media($key...)` Function

A mixin that will return a media query based on the supplied key(s).

Example:

```scss
body {
  @include tokens.media('$media.mobile', 'alternative:$media.tablet') {
    nav,
    main,
    footer {
      width: 90%;
    }
  }
}
```

## Examples

- Using Oikaze with a single token set [input](./examples/single.scss) [output](./examples/single.css)
- Using Oikaze with multiple token sets [input](./examples/multiple.scss) [output](./examples/multiple.css)
- Using Oikaze with Angular Material [input](./examples/angular-material.scss) [output](./examples/angular-material.css)
- Using Oikaze with Bootstrap [input](./examples/bootstrap.scss) [output](./examples/bootstrap.css)
- Using a Three Tier Structure in Oikaze [input](./examples/three-tier/style.scss) [output](./examples/three-tier/style.css)

## License

MIT

## Credits

Oikaze is a [Analyst1](https://github.com/analyst-one) open-source project.

Inspiration from [UniformCSS](https://uniformcss.com/).
