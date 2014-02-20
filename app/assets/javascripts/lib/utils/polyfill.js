function Empty(){}
if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {
        var target = this;
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }

        var args = _Array_slice_.call(arguments, 1);

        var binder = function () {

            if (this instanceof bound) {

                var result = target.apply(
                    this,
                    args.concat(_Array_slice_.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                return target.apply(
                    that,
                    args.concat(_Array_slice_.call(arguments))
                );

            }
        };

        var boundLength = Math.max(0, target.length - args.length);

        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push("$" + i);
        }

        var bound = Function("binder", "return function(" + boundArgs.join(",") + "){return binder.apply(this,arguments)}")(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        return bound;
    };
}
