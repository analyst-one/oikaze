CHANGELOG
=========

## HEAD (Unreleased)
_(none)_

---

## 3.0.0-rc3 (2023-08-21)
_(none)_

## 3.0.0-rc2 (2023-08-21)
Breaking: tokens by CSS variable error when `CONFIG:enable-define` is false

## 3.0.0-rc1 (2023-07-12)
* Breaking: change `CONFIG:spread` to `CONFIG:enable-define`
* Breaking: tokens by value (prefixed with `$`) always resolve to a value
* Breaking: CSS variable references (`var`) always fallback to a value
* Feature: allow using alpha for references
* Feature: add define mixin
* Feature: use color-mix for alpha instead of RGB hack
* Feature: CONFIG values now cascade through the tree
* Feature: lists can now be defined with references
* Feature: `apply` complex tokens
* Feature: `basename` function

## 2.0.0 (2023-06-11)

* Breaking: remove `@` notation for references (using `{}` instead)
* Feature: add `all` to get all nested tokens
* Feature: allow setting global defaults
* Bugfix: fix accessing numeric keys
* Docs: Add "Three Tier Structure" post

