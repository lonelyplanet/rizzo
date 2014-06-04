require([ "public/assets/javascripts/lib/page/stack.js" ], function(Stack) {

  describe("Stack", function() {

    var
      LISTENER = "#js-card-holder",
      config = {
        list: ".test, .test2, .js-error",
        el: "#js-results"
      },
      params = {
        content: "<div class=\"test4\">Four</div><div class=\"test5\">Four</div><div class=\"test6\">Four</div>"
      };

    describe("Object", function() {
      it("is defined", function() {
        expect(Stack).toBeDefined();
      });
    });

    describe("Initialising", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        spyOn(stack, "_init");
      });

      it("When the parent element does not exist it does not initialise", function() {
        expect(stack._init).not.toHaveBeenCalled();
      });
    });

    describe("addLoader", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        stack._addLoader();
      });

      it("adds the loading spinner", function() {
        expect(stack.$el).toHaveClass("is-loading");
      });
    });

    describe("removeLoader", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        stack.$el.addClass("is-loading");
        stack._removeLoader();
      });

      it("removes the loading spinner", function() {
        expect(stack.$el).not.toHaveClass("is-loading");
      });
    });

    describe("blocking", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        stack._block();
      });

      it("adds the disabled class", function() {
        expect(stack.$el.find(config.list)).toHaveClass("is-disabled");
      });
    });

    describe("unblocking", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        stack.$el.find(stack.$list).addClass("is-disabled");
        stack._unblock();
      });

      it("clears the stack", function() {
        expect(stack.$el.find(stack.$list)).not.toHaveClass("is-disabled");
      });
    });

    describe("clearing", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
      });

      it("removes the cards and the filters", function() {
        stack._clear();
        expect($(stack.$el).find(config.list).length).toBe(0);
        expect($(stack.$el).find(".js-error").length).toBe(0);
      });
    });

    describe("adding", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        spyOn(stack, "_show");
        stack._add(params.content);
      });

      it("adds the stack with the returned cards", function() {
        expect($(stack.$el).find(".test4")).toHaveClass("is-invisible");
        expect($(stack.$el).find(".test5")).toHaveClass("is-invisible");
        expect($(stack.$el).find(".test6")).toHaveClass("is-invisible");
      });

      it("shows the cards", function() {
        expect(stack._show).toHaveBeenCalled();
      });
    });

    describe("isPortrait", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
      });

      it("returns true for portrait images", function() {
        expect(stack._isPortrait(100, 50)).toBe(false);
        expect(stack._isPortrait(50, 100)).toBe(true);
      });
    });

    describe("on cards request", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        spyOn(stack, "_addLoader");
        spyOn(stack, "_block");
        $(LISTENER).trigger(":cards/request");
      });

      it("calls stack.addLoader", function() {
        expect(stack._addLoader).toHaveBeenCalled();
      });

      it("calls stack.block", function() {
        expect(stack._block).toHaveBeenCalled();
      });
    });

    describe("on cards received", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
      });

      describe("it calls", function() {
        beforeEach(function() {
          spyOn(stack, "_removeLoader");
          spyOn(stack, "_clear");
          spyOn(stack, "_add");
          $(LISTENER).trigger(":cards/received", params);
        });

        it("calls stack._removeLoader", function() {
          expect(stack._removeLoader).toHaveBeenCalled();
        });

        it("calls stack._clear", function() {
          expect(stack._clear).toHaveBeenCalled();
        });

        it("calls stack._add", function() {
          expect(stack._add).toHaveBeenCalledWith(params.content);
        });
      });
    });

    describe("on page append", function() {
      beforeEach(function() {
        loadFixtures("stack.html");
        window.stack = new Stack(config);
      });

      describe("does not clear down the existing cards", function() {
        beforeEach(function() {
          spyOn(stack, "_clear");
          spyOn(stack, "_add");
          $(LISTENER).trigger(":cards/append/received", params);
        });

        it("does not call stack._clear", function() {
          expect(stack._clear).not.toHaveBeenCalled();
        });

        it("calls stack._add", function() {
          expect(stack._add).toHaveBeenCalledWith(params.content);
        });
      });
    });

    describe("when the user clicks a disabled card", function() {
      beforeEach(function() {
        var spyEvent;
        loadFixtures("stack_disabled.html");
        window.stack = new Stack(config);
        spyEvent = spyOnEvent(stack.$el, ":search/hide");
        stack.$el.find(".js-card.is-disabled").trigger("click");
      });

      it("triggers the search/hide event", function() {
        expect(":search/hide").toHaveBeenTriggeredOn(stack.$el);
      });
    });

    describe("when the user wants to clear all filters", function() {
      beforeEach(function() {
        var spyEvent;
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        spyEvent = spyOnEvent(stack.$el, ":filter/reset");
        stack.$el.find(".js-clear-all-filters").trigger("click");
      });

      it("triggers the filter/reset event", function() {
        expect(":filter/reset").toHaveBeenTriggeredOn(stack.$el);
      });
    });

    describe("when the user clicks to adjust their dates", function() {
      beforeEach(function() {
        var spyEvent;
        loadFixtures("stack.html");
        window.stack = new Stack(config);
        spyEvent = spyOnEvent(stack.$el, ":search/change");
        stack.$el.find(".js-adjust-dates").trigger("click");
      });

      it("triggers the search/change event", function() {
        expect(":search/change").toHaveBeenTriggeredOn(stack.$el);
      });
    });

  });
});
