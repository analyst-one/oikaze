---
title: 'Using a Three Tier Structure in Oikaze'
layout: 'base.html'
tags: post
---

## Using a Three Tier Structure in Oikaze {.banner}

Oikaze is designed to be flexible and work with a variety of different structures. This example shows how to use a [three tier structure](https://uxplanet.org/design-tokens-a-design-system-superpower-dab07a5f0035#ba5c) with Oikaze. This structure defines a base tier (commonly referred to as ‘Global Variables’ or ‘Primitives’ or ‘Reference Tokens’) that defines all the base values. These are then referenced by other token sets (commonly referred to as ‘Alias Tokens’ or ‘System’) where the names are more meaningful and indicate a design decision. Finally, a third layer of (‘Component Tokens’) are used to define the values for specific components.

This structure is useful because it allows the base values to be reused in multiple contexts. For example, the color red-800 might be used as the primary color in one context and as the background color for a button in another context. In addition if the system tokens reference the base tokens by value (in Oikaze, by using a tokan prefixed with a `$`) then the base value defintions can be ommited from the CSS output. This is seen below where only `system` and `system-inverted` CSS variables are output.

Furthermore, since it is possible to override only the system tokens to apply a theme to the entire design system and let CSS cascading apply the theme to components. This is demonstrated in the example by using the `body.inverted` selector to override the system tokens with an inverted color scheme.

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
