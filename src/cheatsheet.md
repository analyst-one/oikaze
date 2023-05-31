---
title: 'Oikaze Cheatsheet'
layout: 'base.html'
---

## Oikaze Cheatsheet {.banner}

### Value Definitions { .cheatsheet }

```scss
@include tokens.spread-variables();
```

```css
--color-primary: #93b733;
--color-primary--rgb: '147,183,51';
--color-neutral: #f5f5f5;
--color-neutral--rgb: '245,245,245';
--size-small: 8px;
--size-small--em: 0.5;
--size-large: 32px;
--size-large--em: 2;
```

### Cascading Variables or Fixed Values { .cheatsheet }

```scss
color: tokens.get('color.primary');
background-color: tokens.get('$color.primary');
```

```css
color: var(--color-primary, #93b733)
background-color: #93b733
```

### Color with opacity { .cheatsheet }

```scss
color: tokens.with-opacity('color.primary', 0.5);
background-color: tokens.with-opacity('$color.primary', 0.5);
```

```css
color:  rgba(var(--color-primary--rgb, 147, 183, 51), 0.5)
background-color: rgba(147, 183, 51, 0.5)
```

### Size as REM { .cheatsheet }

```scss
font-size: tokens.rem('small'); // var(--size-small--rem, 0.5rem)
line-height: tokens.rem('$small'); // 0.5rem;
```

```css
font-size: calc(var(--size-large--em, 2) * 1rem);
line-height: 0.5rem;
```
