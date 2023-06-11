---
title: 'Passing a Bootstrap Theme to Oikaze'
layout: 'base.html'
tags: post
---

## Passing a Bootstrap Theme to Oikaze {.banner}

This example illustrates the use of Oikaze with a Bootstrap theme. The theme is defined by Bootstrap's Sass variables, which are passed to Oikaze as a map. The map is then used to generate CSS variables, which can be used outside of Bootstrap.

```scss
{% renderFile "./examples/bootstrap/style.scss", null, "html" %}
```
