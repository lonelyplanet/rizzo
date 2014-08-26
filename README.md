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

## Documentation

Full documentation about Rizzo and development guidelines is available at [http://rizzo.lonelyplanet.com/documentation/general/development-principles](http://rizzo.lonelyplanet.com/documentation/general/development-principles).
