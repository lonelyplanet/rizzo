define([ "lib/components/datepicker" ], function(Datepicker) {

  "use strict";

  new Datepicker({
    target:         ".js-datepicker",
    startSelector:  ".js-datepicker__start",
    endSelector:    ".js-datepicker__end",
    pickFuture:     true,
    pickPast:       true,
    selectMonths:   true,
    selectYears:    true
  });
});
