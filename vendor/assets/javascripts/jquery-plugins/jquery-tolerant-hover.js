// 
// tolerantHover
//
define(['jquery'], function($){
  $.fn.tolerantHover = function(onHover, offHover, tolerance, tolerancePredicate) {
    $(this).each(function() {
      var hover = false, self = $(this), timeout, tolerantOnHover = function() {
        clearTimeout(timeout);
        hover = true;
        onHover.apply(this);
      }, tolerantOffHover = function() {
        var baseTolerantOffHover = function() {
          hover = false;
          timeout = setTimeout(function(){
            if(!hover){
              offHover.apply(self);
            }
          }, tolerance);
        };
        if (tolerancePredicate) {
          return function() {
            if (tolerancePredicate()) {
              baseTolerantOffHover();
            } else {
              offHover.apply(self);
            }
          };
        } else {
          return baseTolerantOffHover;
        }
      }(tolerancePredicate);
      self.hover(function() {
        tolerantOnHover();
      }, function() {
        tolerantOffHover();
      });
    });
    return this;
  };
});

