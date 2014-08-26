# Progressive enhancement

Lonely Planet is built using the principles of progressive enhancement. That means we deliver the core experience as quickly as possible and then enhance it for the user. The reasons for this are Performance and Resilience and are nicely summed up in "[Progressive enhancement is still important](http://jakearchibald.com/2013/progressive-enhancement-still-important/)" by Jake Archibald.

## At Lonely Planet means...

- First request markup is generated on the server.
- The only external requests between the user and the content should be CSS (and sometimes not even that).
- Anything that isn't critical to content delivery should be loaded asynchronously i.e. fonts, icons, ads, third party widgets
- We can't use any fancy client side frameworks that serve a blank page up front.


## Of course, there are exceptions

For internal apps, where we have certain guarantees about the user base (Gustavo, Christo for example), these rules don't need to be followed if there is a more appropriate alternative.
