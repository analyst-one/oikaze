---
title: 'Using a Style Dictionary Theme in Oikaze'
layout: 'base.html'
tags: post
---

## Using a Style Dictionary Theme in Oikaze {.banner}

This example demonstrates the use of a Style Dictionary tokens in Oikaze. Style Dictionary is configured through a `config.json` file which is used to generate a `_variables.scss` file. The style.scss file imports the necessary modules and uses the Oikaze tool to create tokens based on the SCSS variables. These tokens are then used to generate CSS definitions for the `:root` element and apply styles to a `.test` class.

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
