# JS Architecture

We spent a long time deliberating over our need for a [JavaScript framework](frameworks) to structure our codebase. Ultimately we decided that our application didn't necessitate the overhead of a framework and so instead we defined an event based system in order to add some structure.

## The previous way

There are some relative complex sequences that happen on lonelyplanet.com and if we try to program them in a procedural way they can quickly become spaghetti code. When a user searches for a hotel, for example, their sequence would be something like:

- User clicks "Search"
- Disable the Search Form
- Disable the filters
- Call the server
- Replace the content with the returned result
- Add pagination to go to the next page if necessary
- Enable the Search Form
- Enable the filters
- Show a summary of their search
- Update window.history
- Track the search with analytics

What we ended up with is a series of function calls, passing data around. This becomes quite hard to test and difficult to comprehend as a whole system.

## Components and Events

Instead we chose to build a system by composing small components that operate independently, are stateless, and handle input/output via events. A well written component can be understood and worked on in isolation and has no interleaving with other components. This makes them easy to test because we can just test input -> output.

The above scenario would change 10+ function calls into two events:

```
// When the user searches we publish this event, passing the search parameters

this.trigger(":cards/request", data: searchParams);

// When the data is returned from the server

this.trigger(":cards/received", data: dataFromServer);

```

We then have distinct components which can handle the events independently. For example we might have a PushState component which updates the url on `:cards/received`, and a Filters component which disables and enables the filter respective to the events.

Components should not be able to speak to one another directly, their only API is the event system. If future components adhere to these rules it makes the architecture simpler and easier to maintain.

There is a Yeoman generator which will create a barebones JS Component for you, one which provides some structure around this system: [https://github.com/lonelyplanet/yeoman/blob/rizzo/javascript-component/templates/component.js](https://github.com/lonelyplanet/yeoman/blob/rizzo/javascript-component/templates/component.js).
