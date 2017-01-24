define([ "jquery" ], function($) {

  "use strict";
  // This file is poorly named BUT it has to be named advertising.js otherwise the block_checker script always yields false
  window.lp.isAdblockActive = $(".ads.adpartner").is(":hidden");
});
