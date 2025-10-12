<!-- markdownlint-disable -->
CHANGELOG
=========

## HEAD (Unreleased)
_(none)_

---

## 3.1.0-rc2 (2025-10-11)
* Feature: add `enable-fallbacks` config option (default: true) to disable fallbacks for CSS variables
* Feature: `variants` mixin now also generates placeholders when not nested

## 3.1.0-rc1 (2025-10-07)
* Feature: Streamline `variants` mixin

## 3.1.0-rc0 (2025-10-06)
* Feature: `variants` mixin for generating utility classes

## 3.0.0 (2025-10-04)
_(none)_

## 3.0.0-rc4 (2025-05-20)
* Bugfix: Update SASS version and fix deprecation warnings

## 3.0.0-rc3 (2023-08-21)
_(none)_

## 3.0.0-rc2 (2023-08-21)
Breaking: tokens by CSS variable error when `CONFIG:enable-define` is false

## 3.0.0-rc1 (2023-07-12)
* Breaking: change `CONFIG:spread` to `CONFIG:enable-define`
* Breaking: tokens by value (prefixed with `$`) always resolve to a value
* Breaking: CSS variable references (`var`) always fallback to a value
* Feature: allow using alpha for references
* Feature: add `define` mixin
* Feature: use color-mix for alpha instead of RGB hack
* Feature: CONFIG values now cascade through the tree
* Feature: lists can now be defined with references
* Feature: `apply` mixin for complex tokens
* Feature: `basename` function to get the base name of a token

## 2.0.0 (2023-06-11)

* Breaking: remove `@` notation for references (using `{}` instead)
* Feature: add `all` function to get all nested tokens
* Feature: allow setting global defaults
* Bugfix: fix accessing numeric keys
* Docs: Add "Three Tier Structure" post

