---
title: 'Themes using Token sets'
layout: 'base.html'
tags: recipe
---

## Themes using Token sets {.banner}

Oikaze supports "theming" through a flexible token system that allows developers to define and switch between multiple token sets easily. Themes can be customized by defining different sets of design tokens, which are then applied throughout the application.

### Creating a Token set

To create a token set in Oikaze, define a token map in your SCSS file. For example:

```scss
// light_colors
$text-1: #374151;
$text-2: #374151;

$surface-1: #f0f8ff;
$surface-2: #f9fafb;
```

> Note: This is just a small example. You can define additional tokens as needed for your design system and organize them in a way that suits your project. It is recommended to keep each set in separate folders and each set group (e.g., colors, typography, spacing) in a single SCSS file for better organization.

### Defining a Token Set

Once you have defined your token sets, import your token set and forward it to Oikaze. For example, if you have two token sets (default and red), you can define them as follows:

```scss
// _base.scss
@use './light_colors' as light-colors;
@use './dark_colors' as dark-colors;

@forward 'oikaze' with (
  $sets: (
    default: (
      ... // Typical Oikaze setup here,,,,,,,,,
    ),
    light: (
      color: meta.module-variables(red-colors),
    ),
    dark: (
      color: meta.module-variables(dark-colors),
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
  @include tokens.css-definitions(); // Defines default variables
}

:root[data-theme='light'] {
  @include tokens.css-definitions('light');
}

:root[data-theme='dark'] {
  @include tokens.css-definitions('dark');
}

.button {
  background-color: var(--color-primary);
  color: var(--color-text);
}
```

### Examples

{% assign themes = "light,dark,grape,choco" | split: "," %}

<div class="theme-preview-container">
{% for theme in themes %}
<div class="theme-preview" data-theme="{{ theme }}" onclick="applyTheme('{{ theme }}'); applyMode('{{ mode }}'); event.preventDefault();">
  <!-- <div class="theme-preview__backgrounds">
    <div class="theme-preview__background" title="color.background" style="background-color: var(--color-background);"></div>
    <div class="theme-preview__background" title="color.card" style="background-color: var(--color-card);"></div>
    <div class="theme-preview__background" title="color.popover" style="background-color: var(--color-popover);"></div>
  </div> -->
  <div class="theme-preview__content">
    <h3>{{ theme }}</h3>
    <div class="theme-preview__row">
      <p>Streamline design token management with SCSS and CSS variables.</p>
      <!-- <form action="https://github.com/analyst-one/oikaze">
        <button type="submit">
          <span class="star"></span>
          Star
        </button>
      </form> -->
    </div>
    <div class="theme-preview__colors">
      <div class="color-swatch" title="color.primary/color.primary-foreground" style="background-color: var(--color-surface-1); color: var(--color-text-1);">A</div>
      <div class="color-swatch" title="color.secondary/color.secondary-foreground" style="background-color: var(--color-surface-2); color: var(--color-text-1);">A</div>
      <div class="color-swatch" title="color.muted/color.muted-foreground" style="background-color: var(--color-surface-3); color: var(--color-muted-text-2);">A</div>
      <div class="color-swatch" title="color.accent/color.accent-foreground" style="background-color: var(--color-surface-4); color: var(--color-accent-text-2);">A</div>
    </div>
  </div>
</div>
{% endfor %}
</div>
