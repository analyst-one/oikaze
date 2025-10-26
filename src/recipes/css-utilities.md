---
title: 'Generating CSS Utilities from Oikaze'
layout: 'base.html'
tags: recipe
---

## Generating CSS Utilities from Oikaze {.banner}

Oikaze can be used to generate CSS utility classes.

```scss
{% renderFile "./examples/custom/utilities.scss", null, "html" %}
```

```css
{% renderFile "./examples/custom/utilities.css", null, "html" %}
```
