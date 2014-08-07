require([ "jquery", "public/assets/javascripts/lib/components/datepicker.js" ], function($, Datepicker) {

  "use strict";

  describe("Datepicker", function() {


    describe("Initialisation", function() {

      beforeEach(function() {
        loadFixtures("datepicker.html");
      });

      it("is defined", function() {
        var datepicker = new Datepicker({});
        expect(datepicker).toBeDefined();
      });

      it("sets up the datepicker with default class names", function() {
        new Datepicker({ target: ".js-standard" });

        expect($(".js-standard .picker").length).toBe(2);
      });

      it("sets up the datepicker with custom class names", function() {
        new Datepicker({
          target: ".js-custom",
          startSelector: "#js-custom-start",
          endSelector: "#js-custom-end",
          startLabelSelector: ".js-custom-start-label",
          endLabelSelector: ".js-custom-end-label"
        });

        expect($(".js-custom .picker").length).toBe(2);
      });

    });

    describe("Functionality", function() {

      beforeEach(function() {
        loadFixtures("datepicker.html");
      });

      it("fires a given 'onDateSelect' callback when a date is selected", function() {
        var config = {
          callbacks: {
            onDateSelect: function() {}
          },
          target: ".js-standard"
        };

        spyOn(config.callbacks, "onDateSelect");

        new Datepicker(config);

        $("#js-av-start").trigger("focus");
        $(".picker--opened .picker__day--today").trigger("click");

        expect(config.callbacks.onDateSelect).toHaveBeenCalled();
      });

      it("can limit searching to only be in the past", function() {
        var cell, sibling;

        new Datepicker({
          backwards: true,
          target: ".js-standard"
        });

        $("#js-av-start").trigger("focus");

        cell = $(".picker--opened .picker__day--today").closest("td");

        if (cell.next().length) {
          sibling = cell.next();
        } else {
          sibling = cell.parent().next().children().first();
        }

        expect(sibling.find(".picker__day")).toHaveClass("picker__day--disabled");
      });

      describe("Choosing dates", function(){

        var expected, selected, stubDate;

        beforeEach(function(){
          stubDate = new Date();
          stubDate.setMonth(stubDate.getMonth() + 1);
          stubDate.setDate("20");

          new Datepicker({ target: ".js-standard" });
          $("#js-av-start").data("pickadate").set("select", stubDate);
        });

        it("selecting an 'end' date before the selected 'start' date updates the 'start' date to the day before", function() {

          $("#js-av-start").trigger("focus");
          $(".js-start-container .picker__day--infocus:not(.picker__day--disabled):contains('23')").trigger("click");

          $("#js-av-end").trigger("focus");
          $(".js-end-container .picker__day--infocus:not(.picker__day--disabled):contains('22')").trigger("click");

          $("#js-av-start").trigger("focus");
          selected = $(".js-start-container .picker__day--selected");

          expect(selected.text()).toBe("21");
        });

        it("selecting a 'start' date after the selected 'end' date updates the 'end' date to the day after", function() {

          $("#js-av-end").trigger("focus");
          $(".js-end-container .picker__day--infocus:not(.picker__day--disabled):contains('23')").trigger("click");

          $("#js-av-start").trigger("focus");
          $(".js-start-container .picker__day--infocus:not(.picker__day--disabled):contains('24')").trigger("click");

          $("#js-av-end").trigger("focus");
          selected = $(".js-end-container .picker__day--selected");

          expect(selected.text()).toBe("25");
        });
      });

    });

  });
});
