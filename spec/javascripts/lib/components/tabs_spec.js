require([ "jquery", "public/assets/javascripts/lib/components/tabs.js" ], function($, Tabs) {

  "use strict";

  describe("Tabs", function() {

    describe("Functionality", function() {
      beforeEach(function() {
        loadFixtures("tabs.html");
        window.myTabs = new Tabs({
          selector: "#myTestTabs",
          delay: 0,
          autoHeight: false
        });
      });

      it("initializes with the first tab being active", function() {
        expect($("#myTestTabs").find("#label1")).toHaveClass("is-active");
        expect($("#myTestTabs").find("#test1")).toHaveClass("is-active");
      });

      it("opens tab 2", function() {
        $("#myTestTabs").find("#label2").trigger("click");
        expect($("#myTestTabs").find("#label1")).not.toHaveClass("is-active");
        expect($("#myTestTabs").find("#test1")).not.toHaveClass("is-active");
        expect($("#myTestTabs").find("#label2")).toHaveClass("is-active");
        expect($("#myTestTabs").find("#test2")).toHaveClass("is-active");
      });

      it("switches to tab 1 when it is already active", function() {
        $("#myTestTabs").find("#label1").trigger("click");
        expect($("#myTestTabs").find("#label1")).toHaveClass("is-active");
        expect($("#myTestTabs").find("#test1")).toHaveClass("is-active");
        expect($("#myTestTabs").find("#label2")).not.toHaveClass("is-active");
        expect($("#myTestTabs").find("#test2")).not.toHaveClass("is-active");
      });
    });

  });

});
