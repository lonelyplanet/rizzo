// Taken from:
// https://github.com/es-shims/es5-shim/blob/master/es5-shim.js#L44

function Empty() {}

if (!Function.prototype.bind) {

  Function.prototype.bind = function bind(that) {

    "use strict";

    var target = this,
        args,
        binder,
        boundLength,
        boundArgs,
        bound;

    if (typeof target != "function") {
      throw new TypeError("Function.prototype.bind called on incompatible " + target);
    }

    args = Array.prototype.slice.call(arguments, 1);

    binder = function() {

      if (this instanceof bound) {

        var result = target.apply(
          this,
          args.concat(Array.prototype.slice.call(arguments))
        );
        if (Object(result) === result) {
          return result;
        }
        return this;

      } else {
        return target.apply(
          that,
          args.concat(Array.prototype.slice.call(arguments))
        );
      }
    };

    boundLength = Math.max(0, target.length - args.length);

    boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
      boundArgs.push("$" + i);
    }

    /* jshint ignore:start */
    bound = Function("binder", "return function(" + boundArgs.join(",") + "){return binder.apply(this,arguments)}")(binder);
    /* jshint ignore:end */

    if (target.prototype) {
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      // Clean up dangling references.
      Empty.prototype = null;
    }

    return bound;
  };
}
