---
title: 'Passing a Angular Material Theme to Oikaze'
layout: 'base.html'
tags: post
---

## Passing a Angular Material Theme to Oikaze {.banner}

This example illustrates the use of Oikaze with an Angular Material theme. The theme is defined by Angular Material's SCSS functions, which are passed to Oikaze as a map. The map is then used to generate CSS variables, which can be used outside of Material.

```scss
{% renderFile "./examples/angular-material/style.scss", null, "html" %}
```
