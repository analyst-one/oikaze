---
title: 'Oikaze'
layout: 'base.html'
---

## Oikaze {.banner}

Streamline design token management with SCSS and CSS variables for seamless integration and flexible customization in any project. {.tagline}

::: div { .example-card }

> **Configure Oikaze directly in Sass**
>
> `@use` (or `@forward`) Oikaze in your project, and pass in a token map to configure your design tokens.

```scss
@use 'oikaze' as tokens with (
  $sets: (
    default: (
      color: (
        foreground: #000,
        background: #fff,
      ),
      size: (
        default: 16px,
        large: 24px,
        xs: 2px,
      ),
    ),
  )
);
```

:::

::: div { .example-card }

> **Use the theme in your styles**
>
> Use the `.get()` function to access your theme values and `.css-definitions` in `:root`.

```css
:root {
  @include tokens.css-definitions();
}

body {
  color: tokens.get('color.foreground');
  background-color: tokens.get('color.background');
}
```

:::

::: div { .example-card }

> **Oikaze generates CSS custom properties**
>
> By default CSS custom properties are generated from your token map and can be used directly in your styles.

```css
:root {
  --color-foreground: #000;
  --color-background: #fff;
  --size-default: 16px;
  --size-default--em: 1;
  --size-large: 24px;
  --size-large--em: 1.5;
  --size-xs: 2px;
  --size-xs--em: 0.125;
}

body {
  color: var(--color-foreground, #000);
  background-color: var(--color-background, #fff);
}
```

:::

::: div { .example-card }

> **Full benefit of CSS custom properties and SASS**
>
> Use the `.alpha` function to generate rgba values for colors.
> Use the `.rem()`, `.rem()`, and `.percentage` functions to generate values in different units.
> Prefix a token name with `$` to access the value directly from the token map (same as referencing the SASS variable).
> Use `.media()` mixin to generate media queries.

```scss
.parent {
  background-color: tokens.alpha('color.background', '$opacity.80');
  padding: tokens.rem('size.default');
  border-radius: tokens.get('size.xs');

  .child {
    padding: tokens.em('$size.default');

    @include theme.media('$media.desktop') {
      padding: tokens.em('$size.large');
    }
  }
}
```

```css
.parent {
  background-color: color-mix(
    in srgb,
    var(--color-background, #fff) 80%,
    transparent
  );
  padding: calc(var(--size-default--em, 1) * 1rem);
  border-radius: var(--size-xs, 2px);
}

.parent .child {
  padding: 1em;
}

@media screen and (min-width: 1024px) {
  .parent .child {
    padding: 1.5em;
  }
}
```

:::
