# JS Frameworks

We have previously assessed the need for a framework to structure our JS. We tested:

- [Flight](http://flightjs.github.io/)
- [Knockout](http://knockoutjs.com/)
- [Backbone](http://backbonejs.org/)
- [Angular](https://angularjs.org/)

Of these, Flight seemed to be the framework most focused on Progressive Enhancement, one of the core tenets of how we want to build at Lonely Planet. We ultimately chose to roll our own very lightweight version based on the principles of Flight which is outlined [here](architecture). This wasn't a decision taken lightly.

#### Benefits

- Only load what we need
- Let the conventions adapt to fit our architecture

#### Drawbacks

- New developers need to understand our architecture, they can't read 3rd party docs
- Some reinvention of the wheel - though we have mostly just copied convention

## Future considerations

Introducing a JS framework into the core of lonelyplanet.com would be a large task and so should always be fully considered. The landscape of frameworks is also changing very rapidly, with [React](http://facebook.github.io/react/), [Ember](http://emberjs.com/) and many others emerging as options. Our criteria for choosing a framework in the future should always be dictated by Lonely Planet's needs. The framework should:

- Not construct the entire DOM on the client. We want to [progressively enhance](/documentation/general/progressive-enhancement) lonelyplanet.com, rather than just render a `<script>` tag.
- Have had proven success in another application similar to ours.
- Give tangible benefits over existing implementations which make it worth the cost of implementation.
