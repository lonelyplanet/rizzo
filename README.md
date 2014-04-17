# Rizzo

Rizzo is the UI layer for lonelyplanet.com. Rizzo also serves LP's header and footer, assets and styleguide.

> "Leave code in a better state than you found it."


## Install & Get Dependencies

    $ git clone git@github.com:lonelyplanet/rizzo.git && cd rizzo
    $ cp .ruby-version.example .ruby-version
    $ cp .ruby-gemset.example .ruby-gemset
    $ cd .
    $ bundle install
    $ npm install


# Table of contents

1. [Rizzo as an application](#rizzo-as-an-application)
2. [Rizzo as an engine](#rizzo-as-an-engine)
3. [Rizzo as a service](#rizzo-as-a-service)
4. [Styleguide](#styleguide)
5. [Testing](#testing)
6. [Images & icons](#images-and-icons)
7. [Git Guidelines and Code Review](#git-guidelines-and-code-review)
8. [Sass Guidelines](#sass-guidelines)
9. [Javascript Guidelines](#javascript-guidelines)

-----
## Rizzo as an application

Rizzo is accessible at [http://rizzo.lonelyplanet.com](http://rizzo.lonelyplanet.com) and can also be run locally:

```bash
  bundle exec unicorn
```

## Rizzo as an engine

Primarily rizzo is used as an engine to provide layouts and assets to your rails application.

To enable rizzo, add it to your gemfile:

    gem 'rizzo', git: 'git@github.com:lonelyplanet/rizzo.git'

This will add all the Javascript and Sass into your applications load paths. In order to use the layouts, specify it in your controller. There are currently four layouts that Rizzo provides:

- Core (Fixed width) - [http://rizzo.lonelyplanet.com/global](http://rizzo.lonelyplanet.com/global)
- Responsive - [http://rizzo.lonelyplanet.com/responsive](http://rizzo.lonelyplanet.com/responsive)
- Homepage (Transparent header) - [http://rizzo.lonelyplanet.com/homepage](http://rizzo.lonelyplanet.com/homepage)


-----
## Rizzo as a service

Rizzo also exposes the Global Head (html, css, meta etc.), Global Body Header (Primary navigation) and Global Body Footer (scripts and footer) as a service. These are used for non-rails apps. They are available at:

- Global Head - [http://rizzo.lonelyplanet.com/global-head](http://rizzo.lonelyplanet.com/global-head)
- Global Body Header - [http://rizzo.lonelyplanet.com/global-body-header](http://rizzo.lonelyplanet.com/global-body-header)
- Global Body Footer - [http://rizzo.lonelyplanet.com/global-body-footer](http://rizzo.lonelyplanet.com/global-body-footer)

An example of the legacy navigation can be viewed at [http://rizzo.lonelyplanet.com/legacy](http://rizzo.lonelyplanet.com/legacy).


-----
## Styleguide

The styleguide is accessible at

```bash
  bundle exec unicorn
```

TODO: Write about the styleguide process

### Yeoman Generators

If you want to create a new component within the styleguide you can do so with Yeoman. Find out about any Yeoman generators we have available and how to use them at our [Yeoman repo](https://github.com/lonelyplanet/yeoman).

-----
## Testing

### Unit Tests

Each component as well as any helper methods should have unit tests.

````bash
  $ bundle exec rspec
````

### Integration Tests

````bash
  $ bundle exec cucumber
````

### Javascript Unit Tests

To clean, compile and run all the tests headlessly
````bash
  $ grunt
````

To run them headlessly without compiling them all, and to enable watching of files
````bash
  $ grunt dev
````

To spawn a server and rerun failed tests
````bash
  $ grunt wip
````

To run plato (Javascript sourcecode analysis)
````bash
  $ grunt report
````

### Visual Regression Tests

Currently a work in progress. Eventually to be run on the styleguide as a pre-push hook. Uses phantomcss.

````bash
  $ phantomjs spec/lib/visual_regression.js
````



-----
## Images and Icons


The icons are built by a grunt task, `grunt icon`, which uses the Filament Group's [grunticon plugin](https://github.com/filamentgroup/grunticon). To add a new icon to the build step, simply copy the svg file into `rizzo/app/assets/images/icons/active`.

The easiest way to copy multiple files into the `active` directory (supposing you have access to this folder in Dropbox) is by modifying and using the following rsync command:

````bash
$ rsync -vr --delete ~/Dropbox/LP\ Patterns/Icons/svg/*.svg ~/projects/rizzo/app/assets/images/icons/active/
````

You only need to run `grunt icon` if you are building new icons. All current icons are already checked into git.


-----
## Git Guidelines and Code Review

### Git

- Always work in a branch
- Rebase into your own branch from master (as long as it is only you working on that branch, otherwise merge)
- Merge with --no-ff back into master when it has been code reviewed (or merge through github).
- Use git pull --rebase to avoid commits like this:

```bash
  Merge remote-tracking branch 'origin/master' into if_feature
````

- Prefix your branches with your initials or name.
- Squash your commits using rebase -i if you think it can better reflect the code you have committed.
- Make your commit messages useful, no jokes.

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

* The [.editorconfig](https://github.com/lonelyplanet/rizzo/blob/06b2c761b56184901d7a2341f6a872a541e7dee7/.editorconfig) will take care of the above for you

#### 2. Syntax

* Stick to double quotes

* Spaces are encouraged, to improve readability
   
    ```javascript
    if ( true ) {
      this;
    } else {
      that;
    }
    ```

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
    require("website", function( website ) {
      "use strict";
      website.respond();
      website.enhance({ method: "progressive" });
    });
    ```
   
* No space before paren in function decl, but spaces within:
  
    ```javascript
    function getDressed( hat, suit, scarf, cane ) {
      // statements, innit
    }
    var antelope = function( colour ) {
      // . . .
    }
    ```

#### 3. Typechecking

* In [this](http://contribute.jquery.org/style-guide/js/#type-checks) style, ten and sixpence.

#### 4. Language

* Use camelCase for method and variable names.

    `twistAgainLikeWeDidLastSummer()`
 
    __not__

    `rock_around_the_clock()`

* Try to avoid single character variable names, words are easier to read and we can leave minification to a minifier

* Don't use comma first

* Name collections (arrays, objects, sets, maps) in plural, ie: `badger` is a thing, `badgers` is a collection of things

* test for truthiness:

    ```javascript
    if ( collection.length ) ...
    if ( string ) ...
    if ( truthyThing )
    ```
 
    __not__

    ```javascript
    if ( collection.length > 0 ) ...
    if ( string !== "" )
    if ( truthyThing === true )
    ```

* Put comments before the line or block they are about. Never use eol comments
 
    ```javascript
    // sanitizes animals for collection by spooks
    var animalSanitizer = function( animal ) {
      animal.cut(animal.hair).shampoo().rinse();
    }
    ```
 
    __never__
 
    ```javascript
    var animalSanitizer = function( animal ) {
      animal.cut(animal.hair).shampoo().rinse(); // sanitizes animals for collection by spooks
    }
    ```

* Try to use a function expression unless a function declaration [is necessary](http://javascriptweblog.wordpress.com/2010/07/06/function-declarations-vs-function-expressions/)
