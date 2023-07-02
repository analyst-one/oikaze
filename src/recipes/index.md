---
title: 'Oikaze Recipes'
layout: 'base.html'
---

## Oikaze Recipes {.banner}

<ul class="recipes">
{%- for post in collections.post -%}
  <li><a href="{{ post.url | url }}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>
