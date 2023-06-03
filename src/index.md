---
title: 'Oikaze'
layout: 'base.html'
---

## Oikaze {.banner}

_To live with a following wind_ {.quote}

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
  --color-foreground--rgb: 0, 0, 0;
  --color-background: #fff;
  --color-background--rgb: 255, 255, 255;
  --size-default: 16px;
  --size-default--rem: 1rem;
  --size-large: 24px;
  --size-large--rem: 1.5rem;
  --size-xs: 2px;
  --size-xs--rem: 0.125rem;
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
> Use the `.rem()` function to convert to `rem` units.
> Prefix a token name with `$` to access the value directly from the token map.
> Oikaze also provides a `.media()` mixin to generate media queries.

```scss
.parent {
  background-color: tokens.alpha('color.background', 0.8);
  padding: tokens.rem('size.default');
  border-radius: tokens.get('size.xs');

  .child {
    padding: tokens.rem('$size.default');

    @include theme.media('$media.desktop') {
      padding: tokens.rem('$size.large');
    }
  }
}
```

```css
.parent {
  background-color: rgba(var(--color-background--rgb, 255, 255, 255), 0.8);
  padding: var(--size-default--rem, 1rem);
  border-radius: var(--size-xs, 2px);
}

.parent .child {
  padding: 1rem;
}

@media screen and (min-width: 1024px) {
  .parent .child {
    padding: 1.5rem;
  }
}
```

:::
