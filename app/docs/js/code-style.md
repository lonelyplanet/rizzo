# JavaScript Code Style

Code styles are defined here to help us write consistent JavaScript and to provide a reference point during code review. If you discuss a convention during a code review which doesn't exist here, please add it.

## Configure your editor!

Almost all of our code style choices are reflected in the repo dotfiles and you can configure your editor to give you inline feedback. Install plugins for:

- [Editorconfig](http://editorconfig.org/)
- [JSHint](http://www.jshint.com/install/)
- [JSCS](https://www.npmjs.org/package/jscs)

Disagree with any of the settings? Make a PR and open a discussion.


## Code style guide

* Use camelCase

* Stick to double quotes

* Please don't use comma first

* Try to avoid single character variable names, words are easier to read and we have installed programs to minify code

* Name collections (arrays, objects, sets, maps) in plural, ie: `badger` is a thing, `badgers` is a collection of `badger`s

* Declare variables at the top of their scope:

```javascript
function balloon() {
  var wizard,
      dog = getShibe(),
      partyHat = "^";
  // some statements and stuff
}
```

* Use a $ prefix for jQuery objects:

```javascript
var selector = ".js-btn",
    $button = $(selector)
```


* Use truthiness to your advantage:

```javascript

// Good
if (collection.length) ...
if (string) ...
if (truthyThing)

// Bad
if (collection.length > 0) ...
if (string !== "")
if (truthyThing === true)
```

* Use strict as the first line inside your require function

```javascript
require([
  "website"
], function(website) {

  "use strict";

  website.respond();
  website.enhance({ method: "progressive" });
});
```

* No space before paren in function declaration:

```javascript
function getDressed(hat, suit, scarf, cane) {
  // statements, innit
}
```

* When listing dependencies, put each module name on a new line:

```javascript
require([
  "lib/godliness"
  "lib/cleanliness"
], function(Godliness, Cleanliness) {
```

* Put comments before the line or block they are about. Don't use eol comments

```javascript

// Good

// sanitize animals for collection by spooks
var animalSanitizer = function(animal) {
  animal.cut(animal.hair).shampoo().rinse();
}

// Bad

var animalSanitizer = function(animal) {
  animal.cut(animal.hair).shampoo().rinse(); // sanitizes animals for collection by spooks
}
```

## Typechecking


```javascript
typeof thing == "string"

typeof thing == "number"

typeof thing == "boolean"

jQuery.isFunction(thing)

object.nodeType

thing == null
```
