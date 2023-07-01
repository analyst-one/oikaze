---
title: 'Oikaze Tutorial: Managing Design Tokens with SCSS'
layout: 'base.html'
---

## Managing Design Tokens with SCSS {.banner}

In this tutorial, we will explore how to use Oikaze, a powerful SCSS-based solution for managing design tokens. Oikaze enables easy integration into your projects, provides flexibility in defining and overriding design tokens, and offers seamless integration with other popular CSS/SCSS frameworks. Let's dive in!

### 1. Introduction to Oikaze

Oikaze is a lightweight and versatile solution for managing design tokens in SCSS. Unlike other utility-first frameworks, Oikaze focuses on providing functions and mixins that allow you to generate and retrieve CSS custom properties based on your design tokens. It leverages SCSS and CSS variables, making it highly adaptable to any project and design system.

With Oikaze, you can enjoy the following benefits:

- Easy integration with SCSS-based projects.
- No opinion on design tokens, giving you the freedom to use any design system.
- Flexible overrides and cascading of CSS variables.
- Enhanced maintainability and readability of your codebase.
- Seamless integration with other CSS/SCSS frameworks like Bootstrap and Angular Material.

Now, let's get started with using Oikaze in your project!

### 2. Installation

To begin, ensure that you have SCSS already set up in your project. Oikaze requires SCSS. If you haven't installed SCSS, please refer to the SCSS documentation for installation instructions.

Next, install Oikaze using npm:

```bash
npm install -D oikaze
```

With Oikaze installed, we can now proceed to create our token files.

### 3. Creating Token Files

In Oikaze, token files store your design tokens, such as colors, sizes, and other properties. Create a separate file for each token category, and define your tokens using SCSS variables. Let's create two token files: `colors.scss` and `sizes.scss` as examples.

```scss
// colors.scss
$primary: #4d6fff;
$secondary: #ff7f50;
```

```scss
// sizes.scss
$CONFIG: {
  $base: 16px;
}

$small: 8px;
$base: 16px;
$large: 32px;
```

Feel free to customize these token files based on your project's design requirements.

### 4. Creating the Main Theme File

Now, let's create the main theme file that consumes the token files and sets up Oikaze. This file will import the token files, pass the variables to Oikaze, and export them for use in your project.

Create a file named `base.scss` (you can choose any name) and add the following content:

```scss
// base.scss
@use 'sass:meta';

@use './colors.scss' as colors;
@use './sizes.scss' as sizes;

@forward 'oikaze' with (
  $sets: (
    default: (
      color: meta.module-variables(colors),
      size: meta.module-variables(sizes),
    ),
  )
);
```

In this file, we import the token files using the `@use` directive and assign them to colors and sizes namespaces, respectively. Then, we use the `meta.module-variables` function to retrieve the variables from the token files and pass them to Oikaze's `default` token set. Finally, we then forward the Oikaze module along with the defined configuration.

### 5. Using Oikaze with Default Set

Now that we have our token files and base set up, we can start using Oikaze in our project. Let's see how to use the default set of Oikaze functions to generate and retrieve CSS custom properties.

In your SCSS code, import the main theme file:

```scss
@use './base.scss' as tokens;

// Generate CSS variables
:root {
  @include tokens.css-definitions();
}
```

In the above example, we use the `tokens.css-definitions` mixin to generate CSS variables for all the tokens in the default set. Now, you can use Oikaze's functions to generate and retrieve CSS variables based on your design tokens. Here are a few examples:

```scss
body {
  color: tokens.get('primary');
  font-size: tokens.get('base');
}

.button {
  color: tokens.alpha('primary', 0.5);
  background-color: tokens.get('secondary');
  padding: tokens.rem('$small');
}
```

In the above examples, we use the `tokens.get` and `tokens.rem` functions to retrieve the corresponding CSS custom properties. Oikaze generates these variables based on the token files.

The `.get` function returns the CSS variable as-is, while the `.rem` function converts the value to rem units. You can also use the `.alpha` function to retrieve a CSS variable with a specified opacity value. Prefix any token with `$` to retrieve the corresponding value instead of the CSS custom property.

### 6. Overriding the Default Set

Oikaze allows you to override the default set of design tokens by defining additional token files or modifying the existing ones. This flexibility enables you to customize and adapt Oikaze to your specific project requirements.

To override a design token, simply define the overriding variable in a new token file. For example, if you want to override the primary color, create a new token file custom-colors.scss:

```scss
// custom-colors.scss
$primary: #ff0000;
```

Import the `custom-colors.scss` file and create an alternative token set in `base.scss`:

```scss
// base.scss

@use 'sass:meta';

@use './colors.scss' as colors;
@use './sizes.scss' as sizes;
@use './custom-colors.scss' as customColors;

@forward 'oikaze' with (
  $sets: (
    default: (
      color: meta.module-variables(colors),
      size: meta.module-variables(sizes),
    ),
    alternative: (
      color: meta.module-variables(customColors),
    ),
  )
);
```

Now, you can use the alternative token set in your project:

```scss
@use './base.scss' as tokens;

// Generate CSS custom properties overriding the default set
body.alt {
  @include tokens.css-definitions('alternative');
}
```

### 7. Conclusion

Congratulations! You have successfully learned how to use Oikaze to manage design tokens in your SCSS projects. You now have the power to centralize and customize your design system effortlessly.

Remember, Oikaze provides flexibility, easy integration with other tools, and the ability to override design tokens. Feel free to explore and experiment with Oikaze to enhance your project's styling workflow.

Happy coding with Oikaze!
