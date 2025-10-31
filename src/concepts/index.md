---
title: 'Oikaze Concepts'
layout: 'base.html'
eleventyImport:
  collections: ['concepts']
---

## Oikaze Concepts {.banner}

<ul class="concepts">
{% assign concepts = collections.concept | sort: 'data.order' %}
{% for post in concepts %}
  <li><a href="{{ post.url | url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>
