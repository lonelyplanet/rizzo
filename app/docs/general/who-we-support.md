# Browser Support

We use the ["Cut the Mustard"](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard) approach, developed at BBC News, to help support different browsers. This tests support for:

- QuerySelector
- Local Storage
- ClassList
- AddEventListener

## Browsers that don't cut the mustard

IE7, Opera Mini and other legacy browsers will not pass this test. They are served the base experience which means they don't get any:

- JavaScript (except for analytics)
- Icons (except for critical one such as the logo and search icon)
- CSS3 effects such as box-shadow or gradients
- Fonts

## Browsers that don't cut the mustard but we still support anyway

IE8 will fail the test but we still have a relatively high user base. We therefore give them a free pass.

## Browsers that cut the mustard

Browsers that do pass all these tests get the full experience. Having this distinction allows us to serve complex UI components only to these browsers which means less time polyfilling and testing older ones.

## Browser Testing

We have a company account at [Browser Stack](http://www.browserstack.com). The login details are in LastPass.
