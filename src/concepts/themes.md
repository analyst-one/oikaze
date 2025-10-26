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

> Note: This is just a small example. You can define additional tokens as needed for your design system and organize them in a way that suits your project. It is recommended to keep each set in separate folders and each set group (e.g., colors, typography, spacing) together for better organization.

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

### Preview of Predefined Sets

<!-- <div class="row">
  <div class="col">
    <ul>
      <li><a href="#" onclick="applyTheme('default'); event.preventDefault();">Neutral</a></li>
      <li><a href="#" onclick="applyTheme('red'); event.preventDefault();">Red</a></li>
      <li><a href="#" onclick="applyTheme('ocean'); event.preventDefault();">Ocean</a></li>
    </ul>
    <ul>
      <li><a href="#" onclick="applyMode('light'); event.preventDefault();">Light Mode</a></li>
      <li><a href="#" onclick="applyMode('dark'); event.preventDefault();">Dark Mode</a></li>
    </ul>
  </div>
  <div class="col">
    <div class="theme-preview">
      <h3>Oikaze</h3>
      <div class="theme-preview__row">
        <p>Streamline design token management with SCSS and CSS variables for seamless integration and flexible customization in any project.</p>
        <form action="https://github.com/analyst-one/oikaze">
          <button type="submit">
            <span class="star"></span>
            Star
          </button>
        </form>
      </div>
    </div>
  </div>
</div> -->

{% assign themes = "default,red,ocean" | split: "," %}
{% assign modes = "light,dark" | split: "," %}

<div class="theme-preview-container">
{% for theme in themes %}
  {% for mode in modes %}
<div class="theme-preview {{ theme }}-{{ mode }}" onclick="applyTheme('{{ theme }}'); applyMode('{{ mode }}'); event.preventDefault();">
  <h3>{{ theme }} - {{ mode }}</h3>
  <div class="theme-preview__row">
    <p>Streamline design token management with SCSS and CSS variables for seamless integration and flexible customization in any project.</p>
    <form action="https://github.com/analyst-one/oikaze">
      <button type="submit">
        <span class="star"></span>
        Star
      </button>
    </form>
  </div>
</div>
  {% endfor %}
{% endfor %}
</div>

<!-- <div class="theme-preview ocean-light" onclick="applyTheme('ocean'); applyMode('light'); event.preventDefault();">
  <div>
    <h3>Oikaze</h3>
    <div class="theme-preview__row">
      <p>Streamline design token management with SCSS and CSS variables for seamless integration and flexible customization in any project.</p>
      <form action="https://github.com/analyst-one/oikaze">
        <button type="submit">
          <span class="star"></span>
          Star
        </button>
      </form>
    </div>
  </div>
</div> -->

### Extending Token Sets

In general, it is recommended to create new token sets rather than modifying existing ones. This approach helps maintain consistency and allows for easier updates and maintenance of your design system. However, if you need to make adjustments to an existing set, ensure that the changes align with your overall design goals and do not introduce inconsistencies.

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
