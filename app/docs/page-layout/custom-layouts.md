# Custom Rizzo Layouts

Rizzo provides the ability to serve custom layouts as a service. These custom layouts are used by more bespoke sites within lonelyplanet.com and also by foreign partners and other third parties.

How these layouts are structured is defined within `layout_support.rb`. Layouts will begin with the default configuration, so [http://rizzo.lonelyplanet.com/layouts/housekeeper](http://rizzo.lonelyplanet.com/layouts/housekeeper) will automatically work. To update the housekeeper route, you would create a new config for housekeeper and toggle the settings.

Layouts can be previewed at

```
http://rizzo.lonelyplanet.com/layouts/{{your route}}
```

and then the head, header and footer are exposed as endpoints:

- [http://rizzo.lonelyplanet.com/layouts/housekeeper/head](http://rizzo.lonelyplanet.com/layouts/housekeeper/head)
- [http://rizzo.lonelyplanet.com/layouts/housekeeper/header](http://rizzo.lonelyplanet.com/layouts/housekeeper/header)
- [http://rizzo.lonelyplanet.com/layouts/housekeeper/footer](http://rizzo.lonelyplanet.com/layouts/housekeeper/footer)
