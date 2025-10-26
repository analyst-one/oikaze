---
title: 'Oikaze Concepts'
layout: 'base.html'
---

## Oikaze Concepts {.banner}

<ul class="concepts">
{%- for post in collections.concept -%}
  <li><a href="{{ post.url | url }}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>
