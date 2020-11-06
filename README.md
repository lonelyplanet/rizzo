# Rizzo

Rizzo is a legacy UI layer for lonelyplanet.com. Rizzo also serves LP's header and footer, assets and Style Guide in some legacy apps.

The main goal of Rizzo is to enable sharing of templates and assets across all LP applications. This helps us to reduce complexity and increase reusability. There is a write-up of the thought process behind Rizzo on the [engineering blog](http://engineering.lonelyplanet.com/2014/05/18/a-maintainable-styleguide.html).

## Install & Get Dependencies

```bash
$ git clone git@github.com:lonelyplanet/rizzo.git && cd rizzo
$ cp .ruby-version.example .ruby-version
$ cp .ruby-gemset.example .ruby-gemset
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

## Local Development

You can test your rizzo changes locally running the rails app.

1. Run the repo's rails server:

   ```
   bundle exec rails s
   ```

2. Open http://localhost:3000/layouts/responsive

## Documentation

Full documentation about Rizzo and development guidelines is available at [https://rizzo.lonelyplanet.com/documentation/general/development-principles](https://rizzo.lonelyplanet.com/documentation/general/development-principles).

## Running Tests

### Javascript tests & linting

There is a suite of JavaScript tests in `spec/javascripts`. These tests are currently using Jasmine v1.x from `grunt-contrib-jasmine` v0.5.x.

1. Install the node packages needed for running the tests:

   ```shell
   npm install -g grunt-cli  # Install grunt globally
   npm install # Install packages from package.json
   ```

2. Run the JS tests and linter:

   ```shell
   grunt ci
   grunt jshint
   grunt jscs
   ```

   The `grunt ci` test output should look like:

   ![](http://d.pr/i/jSY4+)

### Ruby tests

```shell
bundle exec rspec
bundle exec cucumber
```
