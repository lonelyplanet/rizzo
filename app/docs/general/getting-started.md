# Getting started

```bash
git clone git@github.com:lonelyplanet/rizzo.git && cd rizzo
cp .ruby-version.example .ruby-version
cp .ruby-gemset.example .ruby-gemset
cd .
bundle install
npm install
grunt setup
```

The last command will fetch the private submodule containing the fonts. It will also install precommit hooks which checks that you haven't:

- Accidentally checked in a reference to a local gem
- Accidentally checked in a file containing a merge conflict
- Broken our code style, tested with JSCS
- Broken our JSHint rules

Once you have everything up and running, you should be able to run all the tests:

## Unit tests

````
  $ bundle exec rspec
````

## JS Unit Tests

````
  $ grunt
````

## Integration Tests

````
  $ bundle exec cucumber
````
