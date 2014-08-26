# Icons

A while back we took the decision to move from an icon font to an SVG solution. The reasons for this, and our eventual implemenation are covered [in this blog post](http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/).

## Critical vs Non Critical

We split our icons out into two categories: critical and active. For critical icons we serve fallback PNGs to browsers that don't support svg. Non-critical icons are considered complementary and will not be served to legacy browsers.

## Adding a new icon

By default, icons are deemed non-critical. To add one:

- Copy the svg file into `rizzo/app/assets/images/icons/active`.
- Run `grunt icon`
- Commit the results

This grunt task will optimise all the svg files and then create a stylesheet with the SVG data-uri included.

## Making the new icon critical

We only class icons as critical if the UI would be unusable without it. If an icon is complementary, for example next to some text, this doesn't need to be served to all browsers. To add a critical icon:

- Add the icon to the above directory as normal
- Create a symlink to this file within `rizzo/app/assets/images/icons/active/critical` by running the following command within the critical folder.

```
ln -s ../[icon-name].svg [icon-name].svg` 
```

## Note

Running `grunt icon` can sometimes produce a lot of noise in the diff as svgmin will run on all the svg files - transforming them but not saving them. For this reason it's often better to only add the files you want into git and discard the rest.
