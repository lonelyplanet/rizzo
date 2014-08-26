# Code Style


## Syntax

We use the Sass indented format which means:

* 2 spaces are used for indentation
* Curly braces are omitted
* Use the shorthand mixin syntax (`+mixin()`)

Other guidelines:

* Only use the `@extend` directive to extend placeholders, not other selectors
* Limit nesting to 1 level deep.
* Avoid large numbers of nested rules.
* Don't over-abstract
* Write code to be readable and understandable, not to save bytes.
* Comments are encouraged and should follow the below pattern:


```css
//----------------------------------------------------------
// Section or component Title
//
// Description
//----------------------------------------------------------

.button
  color: red
  // Create a larger hit area
  padding: 20px

```


## Property Ordering

Properties within selectors should follow this order:

1. Mixins
2. Extends
3. Position
4. Box model
5. Typography
6. Decorative

For example:

    .component
      +css-arrow(top)
      @extend %clearfix
      position
      top
      right
      z-index
      display
      width
      height
      margin
      padding
      border
      font-style
      font-weight
      line-height
      background
      box-shadow
      opacity
      outline
