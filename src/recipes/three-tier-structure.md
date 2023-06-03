---
title: 'Using a Three Tier Structure in Oikaze'
layout: 'base.html'
tags: post
---

## Using a Three Tier Structure in Oikaze {.banner}

Oikaze is designed to be flexible and work with a variety of different structures. This example shows how to use a [three tier structure](https://uxplanet.org/design-tokens-a-design-system-superpower-dab07a5f0035#ba5c) with Oikaze. This structure defines a base tier (commonly referred to as ‘Global Variables’) that defines all the base values. These are then referenced by other token sets (commonly referred to as ‘Alias Tokens’) where the names are more meaningful and indicate a design decision. Finally, a third layer of component tokens are used to define the values for specific components. Using this pattern allows compact CSS output where only the values that are actually used are included in the final CSS.

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
