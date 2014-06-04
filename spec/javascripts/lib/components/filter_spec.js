require(["public/assets/javascripts/lib/components/filter.js"], function(Filter) {

  describe("Filter", function() {

    var LISTENER = "#js-card-holder";

    var data = {
      disable_price_filters: true,
      external_filter: "5star,4star,3_star,2-star"
    };

    var data_alt = {
      disable_price_filters: false
    };

    describe("Object", function() {
      it("is defined", function() {
        expect(Filter).toBeDefined();
      });
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters"
        });
        spyOn(filter, "_removeSEOLinks");
        filter.constructor({
          el: "#js-filters"
        });
      });

      it("removes the SEO links", function() {
        expect(filter._removeSEOLinks).toHaveBeenCalledWith(filter.$el);
      });
    });

    describe("When the parent element does not exist", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: ".foo"
        });
        spyOn(filter, "_init");
      });

      it("does not initialise", function() {
        expect(filter._init).not.toHaveBeenCalled();
      });
    });

    describe("removing SEO links", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-seo"
        });
      });

      it("removes the links inside the labels", function() {
        expect(filter.$el.find(".js-filter-label:first").children().length).toBe(0);
      });

      it("sets the label text to be the link text", function() {
        expect(filter.$el.find(".js-filter-label:first").text()).toBe("5 star hotel");
      });

      it("keeps label text which is not within a link", function() {
        expect(filter.$el.find(".js-filter-label:last").text()).toBe("4 star hotel");
      });
    });

    describe("updating", function() {
      beforeEach(function() {
        window.filter = new Filter({
          el: "#js-filters"
        });
        spyOn(filter, "_hideGroup");
        spyOn(filter, "_showGroup");
        spyOn(filter, "_enable");
      });

      it("hides the price filters given the correct params", function() {
        filter._update({
          disable_price_filters: true
        });
        expect(filter._hideGroup).toHaveBeenCalledWith("price");
      });

      it("shows and enables the price filters given the correct params", function() {
        filter._update({
          disable_price_filters: false
        });
        expect(filter._showGroup).toHaveBeenCalledWith("price");
        expect(filter._enable).toHaveBeenCalledWith("price");
      });
    });

    describe("hiding filter groups", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters"
        });
        filter._hideGroup("price");
      });

      it("it hides the price filters", function() {
        expect(filter.$el.find(".js-price-filter")).toHaveClass("is-hidden");
      });
    });

    describe("showing filter groups", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-disabled"
        });
        filter._showGroup("price");
      });

      it("it shows the price filters", function() {
        expect(filter.$el.find(".js-price-filter")).not.toHaveClass("is-hidden");
      });
    });

    describe("enabling filter groups", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-disabled"
        });
        filter._enable("price");
      });

      it("it enables the price filters", function() {
        expect(filter.$el.find(".js-price-filter").find("input[type=checkbox][disabled]").length).toBe(0);
      });
    });

    describe("adding active classes", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-change"
        });
        filter._toggleActiveClass("#test");
      });

      it("assigns the sibling label an active class", function() {
        expect(filter.$el.find("input[type=checkbox]").siblings()).toHaveClass("is-active");
      });
    });

    describe("removing active classes", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-active"
        });
        filter._toggleActiveClass("#test");
      });

      it("removes the sibling label active class", function() {
        expect(filter.$el.find("input[type=checkbox]").siblings()).not.toHaveClass("is-active");
      });
    });

    describe("setting filter values", function() {
      var external_filters = "5star,4star,3_star,2-star";

      beforeEach(function() {
        loadFixtures("filter.html");
      });

      describe("setting to true", function() {
        beforeEach(function() {
          window.filter = new Filter({
            el: "#js-filters-external"
          });
          filter._set(external_filters, true);
        });

        it("checks the correct price filters", function() {
          var external_filter = external_filters.split(",");
          expect(filter.$el.find("input[name*='" + external_filter[0] + "']").is(":checked")).toBe(true);
          expect(filter.$el.find("input[name*='" + external_filter[0] + "']").siblings()).toHaveClass("is-active");
          expect(filter.$el.find("input[name*='" + external_filter[1] + "']").is(":checked")).toBe(true);
          expect(filter.$el.find("input[name*='" + external_filter[1] + "']").siblings()).toHaveClass("is-active");
          expect(filter.$el.find("input[name*='" + external_filter[2] + "']").is(":checked")).toBe(true);
          expect(filter.$el.find("input[name*='" + external_filter[2] + "']").siblings()).toHaveClass("is-active");
          expect(filter.$el.find("input[name*='" + external_filter[3] + "']").is(":checked")).toBe(true);
          expect(filter.$el.find("input[name*='" + external_filter[3] + "']").siblings()).toHaveClass("is-active");
        });
      });

      describe("setting to false", function() {
        beforeEach(function() {
          window.filter = new Filter({
            el: "#js-filters-reset"
          });
          filter._set(external_filters, false);
        });

        it("checks the correct price filters", function() {
          var external_filter = external_filters.split(",");
          expect(filter.$el.find("input[name*='" + external_filter[0] + "']").is(":checked")).toBe(false);
          expect(filter.$el.find("input[name*='" + external_filter[0] + "']").siblings()).not.toHaveClass("is-active");
          expect(filter.$el.find("input[name*='" + external_filter[1] + "']").is(":checked")).toBe(false);
          expect(filter.$el.find("input[name*='" + external_filter[1] + "']").siblings()).not.toHaveClass("is-active");
          expect(filter.$el.find("input[name*='" + external_filter[2] + "']").is(":checked")).toBe(false);
          expect(filter.$el.find("input[name*='" + external_filter[2] + "']").siblings()).not.toHaveClass("is-active");
          expect(filter.$el.find("input[name*='" + external_filter[3] + "']").is(":checked")).toBe(false);
          expect(filter.$el.find("input[name*='" + external_filter[3] + "']").siblings()).not.toHaveClass("is-active");
        });
      });
    });

    describe("resetting the filter", function() {
      var external_filter = ["5star", "4star", "3_star", "2-star"];

      beforeEach(function() {
        window.filter = new Filter({
          el: "#js-filters-reset"
        });
        filter._reset();
      });

      it("checks the correct price filters", function() {
        expect(filter.$el.find("input[name*='" + external_filter[0] + "']").is(":checked")).toBe(false);
        expect(filter.$el.find("input[name*='" + external_filter[0] + "']").siblings()).not.toHaveClass("is-active");
        expect(filter.$el.find("input[name*='" + external_filter[1] + "']").is(":checked")).toBe(false);
        expect(filter.$el.find("input[name*='" + external_filter[1] + "']").siblings()).not.toHaveClass("is-active");
        expect(filter.$el.find("input[name*='" + external_filter[2] + "']").is(":checked")).toBe(false);
        expect(filter.$el.find("input[name*='" + external_filter[2] + "']").siblings()).not.toHaveClass("is-active");
        expect(filter.$el.find("input[name*='" + external_filter[3] + "']").is(":checked")).toBe(false);
        expect(filter.$el.find("input[name*='" + external_filter[3] + "']").siblings()).not.toHaveClass("is-active");
      });
    });

    describe("on page received", function() {

      describe("when passed a flag to disable price filters", function() {
        beforeEach(function() {
          loadFixtures("filter.html");
          window.filter = new Filter({
            el: "#js-filters"
          });
          spyOn(filter, "_update");
          $(LISTENER).trigger(":page/received", "foo");
        });

        it("updates the filters", function() {
          expect(filter._update).toHaveBeenCalledWith("foo");
        });
      });

    });

    describe("on filter reset", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-reset"
        });
        spyOn(filter, "_reset");
        $(LISTENER).trigger(":filter/reset");
      });

      it("the reset function", function() {
        expect(filter._reset).toHaveBeenCalled();
      });
    });

    describe("on filter input change", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters-change"
        });
        spyOn(filter, "_toggleActiveClass");
        spyOn(filter, "_serialize");
        var spyEvent = spyOnEvent(filter.$el, ":cards/request");
        var element = filter.$el.find("input[type=checkbox]");
        element.trigger("change");
      });

      it("_toggleActiveClass", function() {
        expect(filter._toggleActiveClass).toHaveBeenCalled();
      });

      it("_serialize", function() {
        expect(filter._serialize).toHaveBeenCalled();
      });

      it("triggers the page request event", function() {
        expect(":cards/request").toHaveBeenTriggeredOnAndWith(filter.$el, filter._serialize());
      });
    });

    describe("when the user clicks a filter card", function() {
      beforeEach(function() {
        loadFixtures("filter.html");
        window.filter = new Filter({
          el: "#js-filters"
        });
        spyOn(filter, "_set");
        var spyEvent = spyOnEvent(filter.$el, ":cards/request");
      });

      it("calls _set with the new filters", function() {
        var filterCard = $(LISTENER).find(".js-stack-card-filter");
        var filters = filterCard.data("filter");
        filterCard.trigger("click");
        expect(filter._set).toHaveBeenCalledWith(filters, true);
      });

      it("triggers the :cards/request event with the correct params", function() {
        var filterCard = $(LISTENER).find(".js-stack-card-filter");
        filterCard.trigger("click");
        expect(":cards/request").toHaveBeenTriggeredOn(filter.$el);
      });
    });

  });

});
