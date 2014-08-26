# JS Modules

Modules give us a better tool for handling dependencies in JavaScript. All project should use some form of module system.

## AMD

We use [RequireJS](http://requirejs.org/) to author and load AMD modules across the entirety of lonelyplanet.com. RequireJS is the first script loaded on our pages and we use R.js in the build process to package up modules into two bundles (application and core). Serving multiple bundles is the reason that we can't use almond (the 1kb version of requirejs) in production.

## CommonJS

There are certain scripts that load independently of the application bundle. Our analytics package is one example, where we want to be able to make quick amends without having to redeploy the application. In this instance we don't have access to the global require object, so we used CommonJS to handle dependencies. CommonJS doesn't run directly in the browser and needs to be be precompiled, meaning that it has a very light footprint.

