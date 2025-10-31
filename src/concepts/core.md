---
title: 'Core Concepts of Oikaze'
layout: 'base.html'
tags: concept
order: 100
---

## Oikaze Core Concepts {.banner}

Oikaze helps you manage design tokens in modern SCSS projects, using build-time automation for reliability and flexibility. Here are the key ideas:

- **Design Token Maps**  
  Organize tokens (colors, spacing, typography) in SCSS maps for structure and maintainability.

- **Custom Property Generation**  
  Automatically output CSS custom properties (`--token-name`) from your SCSS token maps, ensuring tokens are available in your CSS.

- **Token Retrieval Functions**  
  Use simple SCSS functions (`.get`, `.rem`, `.alpha`) to reference and transform tokens throughout your stylesheets.

- **Build-Time Safety**  
  Oikaze checks token validity before generating output—catching typos or missing values early.

- **Theming and Composition**  
  Create multiple token sets (e.g., light/dark themes) and compose them safely using modern SCSS `@use` and `@forward`.

- **Zero Runtime Overhead**  
  All logic is handled in your build pipeline; the result is pure CSS with no extra JavaScript or runtime dependencies.

Oikaze makes scalable design token systems possible by automating token management in SCSS, improving developer productivity and UI consistency.
