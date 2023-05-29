---
title: 'Oikaze: Integration with Other Tools'
layout: 'base.html'
---

## Oikaze Recipes {.banner}

{% for post in collections.post %}

- [{{ post.data.title }}</li>]({{ post.url | url }})
  {%- endfor -%}
