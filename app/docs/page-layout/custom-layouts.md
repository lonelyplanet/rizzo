# Custom Rizzo Layouts

Rizzo provides the ability to serve custom layouts as a service. These custom layouts are used by more bespoke sites within lonelyplanet.com and also by foreign partners and other third parties.

How these layouts are structured is defined within `layout_support.rb`. Layouts will begin with the default configuration, so [https://rizzo.lonelyplanet.com/layouts/housekeeper](https://rizzo.lonelyplanet.com/layouts/housekeeper) will automatically work. To update the housekeeper route, you would create a new config for housekeeper and toggle the settings.

Layouts can be previewed at

```
https://rizzo.lonelyplanet.com/layouts/{{your route}}
```

and then the head, header and footer are exposed as endpoints:

- [https://rizzo.lonelyplanet.com/layouts/housekeeper/head](https://rizzo.lonelyplanet.com/layouts/housekeeper/head)
- [https://rizzo.lonelyplanet.com/layouts/housekeeper/header](https://rizzo.lonelyplanet.com/layouts/housekeeper/header)
- [https://rizzo.lonelyplanet.com/layouts/housekeeper/footer](https://rizzo.lonelyplanet.com/layouts/housekeeper/footer)
