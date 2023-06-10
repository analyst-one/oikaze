---
title: 'Using a Three Tier Structure in Oikaze'
layout: 'base.html'
tags: post
---

## Using a Three Tier Structure in Oikaze {.banner}

Oikaze is designed to be flexible and work with a variety of different structures. This example shows how to use a three tier structure ([Design Tokens — a Design System Superpower!](https://uxplanet.org/design-tokens-a-design-system-superpower-dab07a5f0035#ba5c), [The Pyramid Design Token Structure](https://stefaniefluin.medium.com/the-pyramid-design-token-structure-the-best-way-to-format-organize-and-name-your-design-tokens-ca81b9d8836d)) with Oikaze. This structure defines a base tier (referred to as ‘Global’ or ‘Primitives’ or ‘Reference Tokens’) that defines all the base values. These are then referenced by other token sets (referred to as ‘Alias’ or ‘System Tokens’) where the names are more meaningful and indicate a design decision. Finally, a third layer of ‘component Tokens’ are used to define the values for specific components.

![Three-tier Tokens structure]({{ '/img/pyramid.webp' | url }}) {.img-fluid}

_Three-tier Tokens structure [Source](https://uxplanet.org/design-tokens-a-design-system-superpower-dab07a5f0035#ba5c)_ {.img-caption}

This structure is useful as it allows the base values to be reused in multiple contexts. For example, the color `red-800` might be used as the primary color in one context and as the background color for a button in another context. In addition if the system tokens reference the base tokens by value (in Oikaze, by using a tokan prefixed with a `$`) then the base value defintions can be ommited from the CSS output. This is seen below where only `system` and `system-dark-mode` CSS variables are output.

Furthermore, it is possible to override only the system tokens to apply a theme to the entire design system and let CSS cascading apply the theme to components. This is demonstrated in the example by using the `@media (prefers-color-scheme: dark)` rule to override the system tokens with the `system-dark-mode` theme.

```scss
// _global-colors.scss
{% renderFile "./examples/three-tier/tokens/_global-colors.scss", null, "html" %}
```

```scss
// _button-component.scss
{% renderFile "./examples/three-tier/tokens/_button-component.scss", null, "html" %}
```

```scss
// _index.scss
{% renderFile "./examples/three-tier/tokens/_index.scss", null, "html" %}
```

```scss
// style.scss
{% renderFile "./examples/three-tier/style.scss", null, "html" %}
```

```css
// style.css
{% renderFile "./examples/three-tier/style.css", null, "html" %}
```
