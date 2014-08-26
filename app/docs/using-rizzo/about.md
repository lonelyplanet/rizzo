# Why Rizzo?

Rizzo is a tool which has evolved to address the front end challenges of the site architecture. It helps us to:

- Ensure a consistent UI across all our apps
- Make UI changes in just one place
- Avoid template duplication
- Share reusable code across multiple apps

There is more detail about the thought process on the [engineering blog](http://engineering.lonelyplanet.com/2014/05/18/a-maintainable-styleguide.html).

## Components

Components are self-contained modules and should have no side effects. If this is true, it means we can update Rizzo without any fear of breaking applications. Using components from Rizzo is as simple as doing:

```
= ui_component("{{component_name}}", properties: { ...  ... })
```

The more you can rely on these components, the more responsive your application will be to future UI updates.

## CSS

Rizzo exposes lots of utility classes like grids, objects and utility classes. These are all [documented within the style guide](/styleguide/css-utilities/).

## JS

With JS on lonelyplanet we're often solving the same problems - debouncing scroll events, handling browser history, image sliders etc. These common utilites are abstracted to Rizzo to promote reuse.

## Layouts

Rizzo provides the global header and footer for applications. This is covered in more detail in the [page layout section](/documentation/page-layout/core-layouts).
