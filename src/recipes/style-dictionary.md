---
title: 'Using a Style Dictionary Theme in Oikaze'
layout: 'base.html'
tags: post
---

## Using a Style Dictionary Theme in Oikaze {.banner}

```json
// config.json
{% renderFile "./examples/style-dictionary/config.json", null, "html" %}
```

```scss
// _variables.scss

/**
 * Do not edit directly
 * Generated on by Style Dictionary
 */
{% renderFile "./examples/style-dictionary/_variables.scss", null, "html" %}
```

```scss
// style.scss
{% renderFile "./examples/style-dictionary/style.scss", null, "html" %}
```
