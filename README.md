# Rizzo

Rizzo is the UI layer for lonelyplanet.com. Rizzo also serves LP's header and footer, assets and Style Guide.

The main goal of Rizzo is to enable sharing of templates and assets across all LP applications. This helps us to reduce complexity and increase reusability. There is a write-up of the thought process behind Rizzo on the [engineering blog](http://engineering.lonelyplanet.com/2014/05/18/a-maintainable-styleguide.html).


## Install & Get Dependencies

```bash
$ git clone git@github.com:lonelyplanet/rizzo.git && cd rizzo
$ cp .ruby-version.example .ruby-version
$ cp .ruby-gemset.example .ruby-gemset
$ cd .
$ bundle install
$ npm install
$ grunt setup # sets up jscs & jshint git precommit hook for contributors, and inits the private font submodule
```

# Table of contents

1. [Rizzo Style guide](#rizzo-style-guide)
2. [Rizzo as an engine](#rizzo-as-an-engine)
3. [Rizzo as a service](#rizzo-as-a-service)
4. [Testing](#testing)
5. [Images & icons](#images-and-icons)
6. [Git Guidelines and Code Review](#git-guidelines-and-code-review)
7. [Sass Guidelines](#sass-guidelines)
8. [Javascript Guidelines](#javascript-guidelines)

-----
## Rizzo Style Guide

The Style Guide is accessible at [http://rizzo.lonelyplanet.com](http://rizzo.lonelyplanet.com) and can also be run locally:

```
  bundle exec unicorn
```

The Style Guide shows how the Component API works and how to call these components from within your apps.


### Yeoman Generators

If you want to create a new component within the styleguide you can get started with Yeoman. Find out about any Yeoman generators we have available and how to use them at our [Yeoman repo](https://github.com/lonelyplanet/yeoman).


## Rizzo as an engine

Primarily rizzo is used as an engine to provide layouts and assets to your rails application.

To enable rizzo, add it to your gemfile:

    gem 'rizzo', git: 'git@github.com:lonelyplanet/rizzo.git', submodules: true

This will add Rizzo's Components, Javascript and Sass into your applications load paths. In order to use the layouts, specify it in your controller. Available layouts are detailed [within the documentation](http://rizzo.lonelyplanet.com/styleguide/page-layout/core-layouts).

-----
## Rizzo as a service

Rizzo also exposes the Global Head (html, css, meta etc.), Global Body Header (Primary navigation) and Global Body Footer (scripts and footer) as a service. These are used for non-rails apps. Layouts as a service are detailed [within the documentation](http://rizzo.lonelyplanet.com/styleguide/page-layout/core-layouts).


-----
## Testing

### Unit Tests

Each component as well as any helper methods should have unit tests.

````
  $ bundle exec rspec
````

### Integration Tests

````
  $ bundle exec cucumber
````

### Javascript Unit Tests

To clean, compile and run all the tests headlessly
````
  $ grunt
````

To run them headlessly without compiling them all, and to enable watching of files
````
  $ grunt dev
````

To spawn a server and rerun failed tests
````
  $ grunt wip
````

To run plato (Javascript sourcecode analysis)
````
  $ grunt report
````

### Visual Regression Tests

Currently a work in progress. Eventually to be run on the styleguide as a pre-push hook. Uses phantomcss.

````
  $ phantomjs spec/lib/visual_regression.js
````



-----
## Images and Icons

A write-up of our Icon solution is available at: [http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/](http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/).

The icons are built by a grunt task, `grunt icon`, which uses the Filament Group's [grunticon plugin](https://github.com/filamentgroup/grunticon).

We split our icons out into two categories: critical and active. Icons in active are considered complementary and will not be served to browsers that don't support svg. Icons in critical will be served to older browsers as a png fallback.

To add a new icon to the active section, simply copy the svg file into `rizzo/app/assets/images/icons/active`.

To add a new icon to the critial section, add it to the above directory as normal and then create a symlink to this file within `rizzo/app/assets/images/icons/active/critical` by running `ln -s ../[icon-name].svg [icon-name].svg` within the critical folder.

You only need to run `grunt icon` if you are building new icons. All current icons are already checked into git.

Running `grunt icon` can sometimes produce a lot of noise in the diff as we svgmin will run on all the svg files - transforming them but not saving them. For this reason it's often better to only add the files you want into git and checkout the rest.


-----
## Git Guidelines and Code Review

### Git

- Always work in a branch
- Avoid unnecessary merges of master into your branch - if you are the only person working on your branch, rebase onto master instead.
- Squash your commits into meaningful and (release|revert)able chunks
- Merge with --no-ff back into master when it has been code reviewed (or merge through github).
- Use git pull --rebase to avoid commits like this:

```bash
  Merge remote-tracking branch 'origin/master' into if_feature
````

- Prefix your branches with your initials or name.
- Squash your commits using rebase -i if you think it can better reflect the code you have committed.
- Make your commit messages useful, no jokes. Follow [Git commit message best practices](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) as much as possible (first line should be a <= 50 character summary of your changes, followed by a blank line and, if appropriate for larger changes, a detailed description wrapped to approx. 72 characters).

### Code Review

- Code review should start when you begin the feature - discuss it with another dev. The code review should absolutely not be the first time the reviewer sees the code.
- Avoid long running branches! Long branches are *much* harder to code review.
- Include visual aids (images, animated gifs) in your Pull Requests.
- Be strict in your code review. Don't let laziness slip through as it's harder to remove later.
- Code reviews are an opportunity for both devs to learn.
- It's never a personal attack.



-----
## Sass Guidelines


### Syntax

We use the Sass format which means:

* 2 spaces are used for indentation
* Curly braces are omitted
* Use the shorthand mixin syntax (`+mixin()`)
* Only use the `@extend` directive to extend placeholders, not other selectors

Comments are encouraged and should follow the below pattern:

```css
//----------------------------------------------------------
// Section or component Title
//
// Description
//----------------------------------------------------------
```

### Naming classes

We use the BEM methodology within class names.

* .block {}
* .block__element {}
* .block--modifier {}

For example:

````
<div class="gallery">
  <h1 class="gallery__title">Gallery</h1>
  <img class="gallery__image gallery__image--large" />
  <img class="gallery__image" />
  <img class="gallery__image" />
</div>
````


This helps with:
* Avoiding cross module collisions
* Signifying intent and relationships from the classname
* Limiting nesting to 1 level deep.
* Avoiding large numbers of nested rules.

Also:
* Don't over-abstract
* Write code to be readable and understandable, not to save bytes.


### Other Class Naming Conventions

We use prefixes for states and javascript hooks:

    <div class="is-hidden">This element has state</div>
    <div class="tab js-tab">This element can be reached by javascript</div>

Javascript hooks:
 * Ensure that we maintain a distinction between content and functionality.
 * Should *never* relate to css rules.
 * Should be the only way of reaching a dom element.


### Property Ordering
1. Sass specifics e.g. `+` and `@extend`
2. Position
3. Box model
4. Typography
5. Decorative

For example:
```css
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
```

-----
## JavaScript Guidelines

**Install [editorconfig](http://editorconfig.org/) for your editor !**

**This README [used to](https://github.com/lonelyplanet/rizzo/blob/06b2c761b56184901d7a2341f6a872a541e7dee7/README.md#conventions-1) contain coffeescript guidelines, these have been removed as nobody should be writing new coffee at this point.**

### Conventions

#### 1. Whitespace

* Set your editor to remove trailing whitespace

* Use 2 spaces for indentation

* End files with no more and no less than 1 newline

* The [.editorconfig](https://github.com/lonelyplanet/rizzo/commit/8fb812c705c1a88135fed35074a5eddf1a359553) will take care of the above for you

#### 2. Language and appearence

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

* No space before paren in function declaration :<

    ```javascript
    function getDressed(hat, suit, scarf, cane) {
      // statements, innit
    }
    var antelope = function(colour) {
      // . . .
    }
    ```

* When listing `require`ments, put each module name on a new line, as so:

    ```javascript
    require([
      "lib/godliness"
      "lib/cleanliness"
    ], function(Godliness, Cleanliness) {
    ```

* We like to use camelCase for method and variable names.

    `twistAgainLikeWeDidLastSummer()`

    __not__

    `rock_around_the_clock()`

* Use truthiness to your advantage:

    ```javascript
    if (collection.length) ...
    if (string) ...
    if (truthyThing)
    ```

    __not__

    ```javascript
    if (collection.length > 0) ...
    if (string !== "")
    if (truthyThing === true)
    ```

* Put comments before the line or block they are about. Don't use eol comments

    ```javascript
    // sanitize animals for collection by spooks
    var animalSanitizer = function(animal) {
      animal.cut(animal.hair).shampoo().rinse();
    }
    ```

    __not__

    ```javascript
    var animalSanitizer = function(animal) {
      animal.cut(animal.hair).shampoo().rinse(); // sanitizes animals for collection by spooks
    }
    ```


The [.jshintrc](https://github.com/lonelyplanet/rizzo/blob/195a0ae5b47b315f4a5a7495316730b74bb1efe2/.jshintrc) and [.jsrc.json](https://github.com/lonelyplanet/rizzo/blob/195a0ae5b47b315f4a5a7495316730b74bb1efe2/.jscs.json) will gently scold you into most of the above.

#### 3. Typechecking

###### String

```javascript
typeof thing == "string"
```
###### Number

```javascript
typeof thing == "number"
```
###### Boolean

```javascript
typeof thing == "boolean"
```

###### Function

```javascript
jQuery.isFunction(thing)
```
###### Element

```javascript
object.nodeType
```

###### null/undefined

```javascript
thing == null
```
