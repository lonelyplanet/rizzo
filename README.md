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

### Note for non Lonely Planet staff

Due to licensing restrictions imposed on our fonts you will have to manually create some empty files in order to run Rizzo locally:

```bash
$ touch app/assets/stylesheets/fonts/_font.sass
$ touch app/assets/stylesheets/fonts/_font_woff2.sass
```

## Documentation

Full documentation about Rizzo and development guidelines is available at [https://rizzo.lonelyplanet.com/documentation/general/development-principles](https://rizzo.lonelyplanet.com/documentation/general/development-principles).

## Jasmine Tests
There is a suite of JavaScript tests in `spec/javascripts`. These tests are currently using Jasmine v1.x from `grunt-contrib-jasmine` v0.5.x.

In order to run the tests you'll need a few things installed with node.js.

```shell
npm install -g grunt-cli  # Install grunt globally
npm install # Install packages from package.json
```

You can now run the following to run the tests with grunt...

```shell
grunt ci
``` 

It should look like...
![](http://d.pr/i/jSY4+)

##Run tests
```shell
grunt ci
grunt jshint
grunt jscs
bundle exec rspec
bundle exec cucumber

