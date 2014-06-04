require([ "public/assets/javascripts/lib/components/availability_info.js" ], function(AvailabilityInfo) {

  describe("AvailabilityInfo", function() {
    var LISTENER, params;

    LISTENER = "#js-card-holder";

    params = {
      search: {
        from: "21 May 2013",
        to: "23 May 2013",
        guests: 1,
        currency: "USD"
      }
    };

    describe("Object", function() {
      it("is defined", function() {
        expect(AvailabilityInfo).toBeDefined();
      });
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".foo"
        });
        spyOn(avInfo, "_init");
      });

      it("When the parent element does not exist it does not initialise", function() {
        expect(avInfo._init).not.toHaveBeenCalled();
      });
    });

    describe("updating", function() {
      describe("for a single guest", function() {
        beforeEach(function() {
          loadFixtures("availability_info.html");
          window.avInfo = new AvailabilityInfo({
            el: ".js-availability-info"
          });
          avInfo._update(params.search);
        });

        it("updates the user details", function() {
          expect($(".js-availability-from").text()).toBe(params.search.from);
          expect($(".js-availability-to").text()).toBe(params.search.to);
          expect($(".js-availability-guests").text()).toBe(params.search.guests + " guest");
          expect($(".js-availability-currency")).toHaveClass("currency__icon--" + params.search.currency.toLowerCase());
          expect($(".js-availability-currency").text()).toBe(params.search.currency);
        });
      });

      describe("for multiple guests", function() {
        beforeEach(function() {
          loadFixtures("availability_info.html");
          window.avInfo = new AvailabilityInfo({
            el: ".js-availability-info"
          });
          params.search.guests++;
          avInfo._update(params.search);
        });

        it("updates the user details", function() {
          expect($(".js-availability-guests").text()).toBe(params.search.guests + " guests");
        });
      });
    });

    describe("showing", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info-hidden"
        });
        avInfo._show();
      });

      it("removes the is-hidden class", function() {
        expect(avInfo.$el).not.toHaveClass("is-hidden");
      });
    });

    describe("hiding", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info"
        });
        avInfo._hide();
      });

      it("adds the is-hidden class", function() {
        expect(avInfo.$el).toHaveClass("is-hidden");
      });
    });

    describe("checking if hidden", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info-hidden"
        });
      });

      it("returns true if hidden", function() {
        expect(avInfo._isHidden()).toBe(true);
      });

      it("returns false if visible", function() {
        avInfo.$el.removeClass("is-hidden");
        expect(avInfo._isHidden()).toBe(false);
      });
    });

    describe("blocking", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info"
        });
        avInfo._block();
      });

      it("adds the disabled class", function() {
        expect(avInfo.$btn).toHaveClass("is-disabled");
      });

      it("adds the disabled attribute", function() {
        expect(avInfo.$btn.attr("disabled")).toBe("disabled");
      });
    });

    describe("unblocking", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info-blocked"
        });
        avInfo._unblock();
      });

      it("removes the disabled class", function() {
        expect(avInfo.$btn).not.toHaveClass("is-disabled");
      });

      it("removes the disabled attribute", function() {
        expect(avInfo.$btn.attr("disabled")).toBe(void 0);
      });
    });

    describe("on cards request", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info"
        });
        spyOn(avInfo, "_block");
        $(LISTENER).trigger(":cards/request");
      });

      it("disables the availability form", function() {
        expect(avInfo._block).toHaveBeenCalled();
      });
    });

    describe("on page received", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info"
        });

        spyOn(avInfo, "_show");
        spyOn(avInfo, "_update");
        spyOn(avInfo, "_unblock");
      });

      describe("when the user has not entered dates", function() {
        beforeEach(function() {
          spyOn(avInfo, "hasSearched").andReturn(false);
          $(LISTENER).trigger(":cards/received", ["", params]);
        });

        it("does not show the info card", function() {
          expect(avInfo._unblock).toHaveBeenCalled();
          expect(avInfo._show).not.toHaveBeenCalled();
          expect(avInfo._update).not.toHaveBeenCalled();
        });
      });

      describe("when the user has entered dates", function() {
        beforeEach(function() {
          spyOn(avInfo, "hasSearched").andReturn(true);
          spyOn(avInfo, "_isHidden").andReturn(true);
          $(LISTENER).trigger(":cards/received", ["", params]);
        });

        it("shows the info card", function() {
          expect(avInfo._show).toHaveBeenCalled();
        });

        it("updates the info card", function() {
          expect(avInfo._update).toHaveBeenCalledWith(params.search);
        });

        it("unblocks the info card", function() {
          expect(avInfo._unblock).toHaveBeenCalled();
        });
      });

    });

    describe("when the user clicks on a disabled card", function() {
      beforeEach(function() {
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info"
        });
        spyOn(avInfo, "_show");
        spyOn(avInfo, "_unblock");
        $(LISTENER).trigger(":search/hide");
      });

      it("unblocks the info card", function() {
        expect(avInfo._unblock).toHaveBeenCalled();
      });

      it("shows the info card", function() {
        expect(avInfo._show).toHaveBeenCalled();
      });
    });

    describe("on change", function() {
      beforeEach(function() {
        var spyEvent;
        loadFixtures("availability_info.html");
        window.avInfo = new AvailabilityInfo({
          el: ".js-availability-info"
        });
        spyEvent = spyOnEvent(avInfo.$el, ":search/change");
        spyOn(avInfo, "_hide");
        avInfo.$btn.trigger("click");
      });

      it("triggers the info/change event", function() {
        expect(":search/change").toHaveBeenTriggeredOn(avInfo.$el);
      });

      it("hides", function() {
        expect(avInfo._hide).toHaveBeenCalled();
      });
    });

  });

});

