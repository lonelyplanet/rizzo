# Core Rizzo Layouts

Rizzo provides the layout around your application. This includes the Header and Footer as well as links to core stylesheets and other assets. It also includes some JavaScript helpers such as the window.lp namespace.

The layout is responsible for rendering your application code within it. Each layout is split into
%a{href: "rows"} Rows
and the core content is rendered withing .row--content.

There are three main types of layout currently available using Rizzo, each of which have preview pages:

- [Responsive layout](/layouts/responsive)
- [Fixed width layout](/layouts/core)
- [Minimal layout](/layouts/minimal)
- [Legacy layout](/layouts/legacy) - Provides backwards support for old applications

## Rails Projects

Define which layout you want to use within your controller. See other applications for examples of how this is done. 

Any view code you have in the application will be renderd within the layout.


## Non-Rails Projects, Layouts as a Service

There are two core Lonely Planet layouts which are available via http endpoints: Modern and Legacy. These layouts are split into three parts: 

#### global-head

This should be requested within the <head> of your application.

[Modern Route](/modern/head) | [Legacy Route](/global-head)

#### global-body-header

This should be requested immediately after the opening <body> tag

[Modern Route](/modern/body-header) | [Legacy Route](/global-body-header)

#### global-body-footer

This should be requests after your application code and before the closing <body> tag.

[Modern Route](/modern/body-footer) | [Legacy Route](/global-body-footer)
