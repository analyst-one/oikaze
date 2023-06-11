---
title: 'Oikaze Cheatsheet'
layout: 'base.html'
---

## Oikaze Cheatsheet {.banner}

### Define a Single Token Set

```scss
@forward 'oikaze' with (
  $sets: (
    default $light-theme,
  )
);
```

### Define Multiple Token Sets

```scss
@forward 'oikaze' with (
  $default: 'light-theme',
  $sets: (
    'light-theme': $light-theme,
    'dark-theme': $dark-theme,
  )
);
```

### Value Definitions

::: div { .example--pair }

```scss
@include tokens.css-definitions();
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

:::

### Cascading Variables or Fixed Values { .cheatsheet }

::: div { .example--pair }

```scss
color: tokens.get('color.primary');
background-color: tokens.get('$color.primary');
```

```css
color: var(--color-primary, #93b733)
background-color: #93b733
```

:::

### Color with opacity { .cheatsheet }

::: div { .example--pair }

```scss
color: tokens.alpha('color.primary', 0.5);
background-color: tokens.alpha('$color.primary', 0.5);
```

```css
color:  rgba(var(--color-primary--rgb, 147, 183, 51), 0.5)
background-color: rgba(147, 183, 51, 0.5)
```

:::

### Size as REM { .cheatsheet }

::: div { .example--pair }

```scss
font-size: tokens.rem('small');
line-height: tokens.rem('$small');
```

```css
font-size: calc(var(--size-large--em, 2) * 1rem);
line-height: 0.5rem;
```

:::

### Iterate over a Token Set { .cheatsheet }

::: div { .example--pair }

```scss
@each $token in tokens.all('color') {
  $var: tokens.prop($token);

  .color#{$name} {
    color: $value;
  }
}
```

```css
.color--primary {
  color: #93b733;
}
.color--neutral {
  color: #f5f5f5;
}
```
