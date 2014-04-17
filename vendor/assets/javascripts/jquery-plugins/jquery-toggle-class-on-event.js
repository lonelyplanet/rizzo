// 
// toggleClassOnEvent
//
define(['jquery'], function($){
  $.fn.toggleClassOnEvent = function(options) {
    $(this).each(function() {
      var onHover = options && options.onHover ? options.onHover : function(){};
      var offHover = options && options.offHover ? options.offHover : function(){};
      var target = options && options.target ? $(options.target) : $(this);
      if (options.event === 'hover' || options.event === 'tolerantHover') {
        $(this)[options.event](function() {
          target.addClass(options.className);
          onHover.call(this);
        }, function() {
          target.removeClass(options.className);
          offHover.call(this);
        }, options.tolerance, options.tolerancePredicate);
      } 
      else {
        $(this).bind(options.event, function() {
          target.toggleClass(options.className);
        });
      }
    });
    return this;
  };
});
