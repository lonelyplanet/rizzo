# Rizzo

Rizzo is the UI layer for lonelyplanet.com. Rizzo also serves LP's header and footer, assets and styleguide.

> "Leave code in a better state than you found it."


## Install & Get Dependencies

    $ git clone git@github.com:lonelyplanet/rizzo.git && cd rizzo
    $ cp .rvmrc.example .rvmrc && source .rvmrc
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
* Use + instead of @include

Comments are encouraged and should follow the below pattern:

```css
//----------------------------------------------------------
// Section or component Title
//
// Description
//----------------------------------------------------------
```

### Style

We use BEM which should help with:
* Limiting nesting to 1 level deep.
* Avoiding large numbers of nested rules.

Also:
* Group `+` and `@extend` statements at the top of each selector ruleset
* Don't over-abstract
* Write code to be readable and understandable, not to save bytes.


### Conventions

We use prefixes for states and javascript hooks:

    <div class="is-hidden">This element has state</div>
    <div class="tab js-tab">This element can be reached by javascript</div>
 
Javascript hooks:
 * Ensure that we maintain a distinction between content and functionality.
 * Should *never* relate to css rules.
 * Should be the only way of reaching a dom element.


-----
## Javascript Guidelines

### Conventions

1. Whitespace
	* Set your editor to remove trailing whitespace
	* Use 2 spaces for indentation
	* End files with no more and no less than 1 newline
2. Syntax
	* Use `this` when referring to `this` alone. Use `@variable` for referring to `this.variable`. eg: `self = this` but `@rub(noggin)`
	* Use curly braces for objects, not coffeescript's implicit object syntax. eg:

		```coffeescript
		  animals = {
	        dog: 'brown'
		    fox: 'green'
		    pig: 'yellow'
		  }
        ```
    * Use parens for calling functions: `@albatross({ sausage: 'goose' })`
    * Stick to single quotes `'` unless using coffeescripts string interpolation, `"jimmy ate the #{foxpuppet.angles}"`
3. Typechecking
	* In [this](http://contribute.jquery.org/style-guide/js/#type-checks) style, except unfortunely we cannot use the "null or undefined" check in coffeescript.
4. Points of controversy
	* Check if an array or string contains something by bitwise notting: `!!~collection.indexOf('abacus')`
	* The "Angus Manouver": `snake && snake.bleeding()`
	* Coerce numbers with unary plus: `if +num is 2 ...`
	* Augment a native prototype if that's the right thing to do
5. Further Concerns
	* Use camelCase for method and variable names.
		`twistAgainLikeWeDidLastSummer()`

		__NOT__

		`rock_around_the_clock()`
	* Try to avoid single character variable names, words are easier to read and we can leave minification to a minifier
	* Don't use comma first
	* Name collections (arrays, objects, sets, maps) in plural, ie: `badger` is a thing, `badgers` is a collection of things
	* Start a variable with a captial letter _ONLY_ in the case that it is a prototype, class, contructor, etc.

	```square = (number) -> number * 2``` but ```class BaldMan```
	
	* test for truthiness:

		```coffeescript
	        if collection.length ...
            if string ...
            if truthyThing
		```

		__NOT__
		
		```coffeescript
            if collection.length > 0 ...
            if string isnt ''
	        if truthyThing is true
		```
		
	* Use coffee classes so we can enjoy rjs (more to come on this in higher level component writing guide)
	* Use `->` unless you want bound function, then use `=>`. In some sticky situations, `self = this` is still necessary. See if naming it something other than `self` is more sensible in those cases, like:

		```coffeescript
		class Badger
		  constructor ->
	  	    badger = this
	  	    somethingElse((wat) ->
		      @eat(badger.honey)
		  )
		```

	* Put comments before the line or block they are about. Never use eol comments
	
<!--Try not to get caught up in dogmatic rules and religion surrounding javascript and in the community. Be playful.-->
