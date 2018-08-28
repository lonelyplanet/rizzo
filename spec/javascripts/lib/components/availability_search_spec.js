define([ "public/assets/javascripts/lib/components/availability_search.js" ], function(Availability) {

  describe("Availability", function() {
    var LISTENER = "#js-card-holder";

    beforeEach(function() {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date("1 Jun 2013"));
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".foo"
        });

        spyOn(av, "_init");
      });

      it("does not initialise when there is no parent", function() {
        expect(av._init).not.toHaveBeenCalled();
      });
    });

    describe("get search data", function() {
      beforeEach(function() {
        loadFixtures("availability.html");
      });

      describe("with values", function() {
        beforeEach(function() {
          window.av = new Availability({
            el: ".js-availability-card-with-values"
          });
        });

        it("serializes the search data", function() {
          var expectedResult, values;

          values = av._getSearchData();

          expectedResult = {
            search: {
              from: "6 Jun 2013",
              to: "7 Jun 2013",
              guests: "1",
              currency: "USD"
            }
          };

          expect(values).toEqual(expectedResult);
        });
      });

      describe("without values", function() {
        beforeEach(function() {
          window.av = new Availability({
            el: ".js-availability-card"
          });

          spyOn(av, "_setDefaultDates");

          av._getSearchData();
        });

        it("sets the default dates", function() {
          expect(av._setDefaultDates).toHaveBeenCalled();
        });
      });
    });

    describe("setting values", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card-with-values"
        });

        av._set("from", "test");
      });

      it("sets the start date", function() {
        expect(av.$form.find("input[name*=from]").val()).toBe("test");
      });
    });

    describe("showing", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card-hidden"
        });

        av._show();
      });

      it("removes the is-hidden class", function() {
        expect(av.$el).not.toHaveClass("is-hidden");
      });
    });

    describe("hiding", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card"
        });

        av._hide();
      });

      it("adds the is-hidden class", function() {
        expect(av.$el).toHaveClass("is-hidden");
      });
    });

    describe("blocking", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card"
        });

        av._block();
      });

      it("adds the disabled class", function() {
        expect(av.$submit).toHaveClass("is-disabled");
      });

      it("adds the disabled attribute", function() {
        expect(av.$submit.attr("disabled")).toBe("disabled");
      });
    });

    describe("unblocking", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card-blocked"
        });

        av._unblock();
      });

      it("removes the disabled class", function() {
        expect(av.$submit).not.toHaveClass("is-disabled");
      });

      it("removes the disabled attribute", function() {
        expect(av.$submit.attr("disabled")).toBe(void 0);
      });
    });

    describe("on cards request", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card"
        });

        spyOn(av, "_block");

        $(LISTENER).trigger(":cards/request");
      });

      it("disables the availability form", function() {
        expect(av._block).toHaveBeenCalled();
      });
    });

    describe("on page received", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card"
        });

        spyOn(av, "_unblock");
        spyOn(av, "_set");
        spyOn(av, "_hide");
      });

      describe("if the user has searched", function() {
        beforeEach(function() {
          spyOn(av, "hasSearched").and.returnValue(true);

          $(LISTENER).trigger(":cards/received", {
            pagination: {
              page_offsets: 2
            }
          });
        });

        it("hides the availability form", function() {
          expect(av._hide).toHaveBeenCalled();
        });

        it("enables the availability form search button", function() {
          expect(av._unblock).toHaveBeenCalled();
        });

        it("updates the page offset", function() {
          expect(av._set).toHaveBeenCalledWith("page_offsets", 2);
        });
      });

      describe("if the user has not already searched", function() {
        beforeEach(function() {
          spyOn(av, "hasSearched").and.returnValue(false);

          $(LISTENER).trigger(":cards/received", {
            pagination: {
              page_offsets: 2
            }
          });
        });

        it("does not hide the availability form", function() {
          expect(av._hide).not.toHaveBeenCalled();
        });

        it("enables the availability form search button", function() {
          expect(av._unblock).toHaveBeenCalled();
        });

        it("updates the page offset", function() {
          expect(av._set).toHaveBeenCalledWith("page_offsets", 2);
        });
      });
    });

    describe("on search", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card"
        });

        spyOn(av, "_setDefaultDates").and.returnValue(true);
        spyOn(av, "_getSearchData").and.returnValue("foo");
      });

      it("triggers the page request event with the search data", function() {
        var spyEvent;
        spyEvent = spyOnEvent(av.$el, ":cards/request");
        av.$form.trigger("submit");
        expect(":cards/request").toHaveBeenTriggeredOnAndWith(av.$el, "foo");
      });
    });
    describe("when the user wants to change dates", function() {
      beforeEach(function() {
        loadFixtures("availability.html");

        window.av = new Availability({
          el: ".js-availability-card"
        });

        spyOn(av, "_show");

        $(LISTENER).trigger(":search/change");
      });

      it("shows the availability form", function() {
        expect(av._show).toHaveBeenCalled();
      });
    });

  });

});
