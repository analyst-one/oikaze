---
title: 'Token sets in Oikaze'
layout: 'base.html'
tags: concept
---

## Token sets in Oikaze {.banner}

Oikaze supports "theming" through a flexible token system that allows developers to define and switch between multiple token sets easily. Themes can be customized by defining different sets of design tokens, which are then applied throughout the application.

### Creating a Token set

To create a token set in Oikaze, define a token map in your SCSS file. For example:

```scss
// _colors.scss
$primary: #3490dc,
$secondary: #ffed4a,
$background: #f8fafc,
$text: #2d3748,
```

> Note: This is just a small example. You can define additional tokens as needed for your design system and organize them in a way that suits your project. It is recommended to keep each set in separate folders and each set group (e.g., colors, typography, spacing) in a single SCSS file for better organization.

### Defining a Token Set

Once you have defined your token sets, import your token set and forward it to Oikaze. For example, if you have two token sets (default and red), you can define them as follows:

```scss
// _base.scss
@use './default/colors.scss' as default-colors;
@use './red/colors.scss' as red-colors;

@forward 'oikaze' with (
  $sets: (
    default: (
      color: meta.module-variables(default-colors),
    ),
    red: (
      color: meta.module-variables(red-colors),
    ),
  )
);
```

> Note: This file (e.g., `_base.scss`) becomes the main entry point for your tokens. Import this file wherever you need access to the design tokens in your SCSS.

### Applying Token Sets in Your Application

After defining and applying your token sets in SCSS, you can use the generated CSS variables in your application styles. For example:

```scss
@use './base.scss' as tokens;

// Generate CSS variables
:root {
  @include tokens.css-definitions();
}

:root[data-theme='red'] {
  @include tokens.css-definitions('red');
}

.button {
  background-color: var(--color-primary);
  color: var(--color-text);
}
```

### Predefined Sets

Oikaze comes with predefined sets that you can use as a starting point. To use a predefined set, simply import it and forward it to Oikaze:

```scss
@use 'oikaze/themes/ocean' as ocean;

@forward 'oikaze' with (
  $default: 'light',
  $sets: meta.module-variables(ocean)
);
```

> Note: in this example, we are importing the `ocean` theme which includes both light and dark node sets.

### Predefined Sets

{% assign themes = "neutral,red,ocean,caffeine" | split: "," %}
{% assign modes = "light,dark" | split: "," %}

<div class="theme-preview-container">
{% for theme in themes %}
  {% for mode in modes %}
<div class="theme-preview {{ theme }}-{{ mode }}" onclick="applyTheme('{{ theme }}'); applyMode('{{ mode }}'); event.preventDefault();">
  <div class="theme-preview__backgrounds">
    <div class="theme-preview__background" title="color.background" style="background-color: var(--color-background);"></div>
    <div class="theme-preview__background" title="color.card" style="background-color: var(--color-card);"></div>
    <div class="theme-preview__background" title="color.popover" style="background-color: var(--color-popover);"></div>
  </div>
  <div class="theme-preview__content">
    <h3>{{ theme }} - {{ mode }}</h3>
    <div class="theme-preview__row">
      <p>Streamline design token management with SCSS and CSS variables.</p>
      <form action="https://github.com/analyst-one/oikaze">
        <button type="submit">
          <span class="star"></span>
          Star
        </button>
      </form>
    </div>
    <div class="theme-preview__colors">
      <div class="color-swatch" title="color.primary/color.primary-foreground" style="background-color: var(--color-primary); color: var(--color-primary-foreground);">A</div>
      <div class="color-swatch" title="color.secondary/color.secondary-foreground" style="background-color: var(--color-secondary); color: var(--color-secondary-foreground);">A</div>
      <div class="color-swatch" title="color.muted/color.muted-foreground" style="background-color: var(--color-muted); color: var(--color-muted-foreground);">A</div>
      <div class="color-swatch" title="color.accent/color.accent-foreground" style="background-color: var(--color-accent); color: var(--color-accent-foreground);">A</div>
    </div>
  </div>
</div>
  {% endfor %}
{% endfor %}
</div>

### Extending Token Sets

In general, it is recommended to create new token sets rather than modifying existing ones. This approach helps maintain consistency and allows for easier updates and maintenance of your design system. However, if you need to make adjustments to an existing set (e.g., changing primary and secondary colors), you can extend the set as follows:

```scss
@use 'oikaze/themes/ocean' as ocean;

@use 'oikaze' with as tokens (
  $default: 'light',
  $sets: meta.module-variables(ocean)
);
@forward 'oikaze';

tokens.extend-set('light', (
  color: (
    primary: #1c3d5a,
    secondary: #fbbf24
  )
));
```

> Note: `extend-set` is a convenience method provided by Oikaze to facilitate extending token sets. You can also merge sets using standard SCSS map functions (e.g. `map.deep-merge`) if preferred.
