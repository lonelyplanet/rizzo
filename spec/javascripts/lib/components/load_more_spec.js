require([ "public/assets/javascripts/lib/components/load_more.js" ], function(LoadMore) {

  describe("Load More Button", function() {

    var LISTENER = "#js-card-holder";

    describe("Object", function() {
      it("is defined", function() {
        expect(LoadMore).toBeDefined();
      });
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
      });

      it("has default options", function() {
        expect(lm.config).toBeDefined();
      });
    });

    describe("When the parent element does not exist", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".foo"
        });
        spyOn(lm, "_init");
      });

      it("does not initialise", function() {
        expect(lm._init).not.toHaveBeenCalled();
      });
    });

    describe("Cleaning html pagination", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
      });

      it("has pagination without js", function() {
        expect($(".js-pagination")).toExist();
      });

      describe("Append load more button", function() {
        beforeEach(function() {
          window.lm = new LoadMore({
            el: ".js-pagination"
          });
        });

        it("removes the pagination", function() {
          expect($(".js-pagination").children().length).toBe(1);
        });

        it("appends the load more button", function() {
          expect($("#js-load-more")).toExist();
        });
      });

    });

    describe("hiding", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination",
          visible: false
        });
      });

      it("hides the pagination", function() {
        expect(lm.$el).toHaveClass("is-hidden");
      });
    });

    describe("reset", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        lm.currentPage = 2;
        lm._reset();
      });

      it("resets the current page", function() {
        expect(lm.currentPage).toBe(1);
      });
    });

    describe("blocking", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        lm._block();
      });

      it("adds the disabled and loading classes", function() {
        expect(lm.$btn).toHaveClass("loading is-disabled");
      });

      it("updates the loading text", function() {
        expect(lm.$btn.text()).toBe(lm.config.idleTitle);
      });
    });

    describe("unblocking", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        lm.$btn.addClass("loading is-disabled").text("some text");
        lm._unblock();
      });

      it("adds the disabled and loading classes", function() {
        expect(lm.$btn).not.toHaveClass("loading is-disabled");
      });

      it("updates the loading text", function() {
        expect(lm.$btn.text()).toBe(lm.config.title);
      });
    });


    var stub = {
      pagination: {
        total: 10,
        current: 1
      }
    };

    var stub_single = {
      pagination: {
        total: 0
      }
    };

    var stub_final_page = {
      pagination: {
        total: 10,
        current: 10
      }
    };

    var stub_has_more = {
      pagination: {
        has_more: true,
        total: 0
      }
    };

    describe("on cards request", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        spyOn(lm, "_reset");
        spyOn(lm, "_block");
        $(LISTENER).trigger(":cards/request");
      });

      it("resets the pagination", function() {
        expect(lm._reset).toHaveBeenCalled();
      });

      it("disables the pagination", function() {
        expect(lm._block).toHaveBeenCalled();
      });
    });

    describe("on cards received", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        spyOn(lm, "_unblock");
        spyOn(lm, "_show");
        spyOn(lm, "_hide");
      });

      it("enables the pagination", function() {
        $(LISTENER).trigger(":cards/received", stub);
        expect(lm._unblock).toHaveBeenCalled();
      });

      it("shows the pagination", function() {
        $(LISTENER).trigger(":cards/received", stub);
        expect(lm._show).toHaveBeenCalled();
      });

      it("hides the pagination if the total pages is 0", function() {
        $(LISTENER).trigger(":cards/received", stub_single);
        expect(lm._hide).toHaveBeenCalled();
      });

      it("hides the pagination if we are on the final page", function() {
        $(LISTENER).trigger(":cards/received", stub_final_page);
        expect(lm._hide).toHaveBeenCalled();
      });

      it("shows the pagination if has_more is true", function() {
        $(LISTENER).trigger(":cards/received", stub_has_more);
        expect(lm._show).toHaveBeenCalled();
      });
    });

    describe("on page received", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        spyOn(lm, "_unblock");
        spyOn(lm, "_show");
        spyOn(lm, "_hide");
      });

      it("enables the pagination", function() {
        $(LISTENER).trigger(":page/received", stub);
        expect(lm._unblock).toHaveBeenCalled();
      });

      it("shows the pagination", function() {
        $(LISTENER).trigger(":page/received", stub);
        expect(lm._show).toHaveBeenCalled();
      });

      it("hides the pagination if the total pages is 0", function() {
        $(LISTENER).trigger(":page/received", stub_single);
        expect(lm._hide).toHaveBeenCalled();
      });

      it("hides the pagination if we are on the final page", function() {
        $(LISTENER).trigger(":page/received", stub_final_page);
        expect(lm._hide).toHaveBeenCalled();
      });
    });

    describe("on page/append/received", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        spyOn(lm, "_unblock");
        spyOn(lm, "_show");
        spyOn(lm, "_hide");
      });

      it("enables the pagination", function() {
        $(LISTENER).trigger(":cards/append/received", stub);
        expect(lm._unblock).toHaveBeenCalled();
      });

      it("shows the pagination", function() {
        $(LISTENER).trigger(":cards/append/received", stub);
        expect(lm._show).toHaveBeenCalled();
      });

      it("hides the pagination if the total pages is 0", function() {
        $(LISTENER).trigger(":cards/append/received", stub_single);
        expect(lm._hide).toHaveBeenCalled();
      });

      it("hides the pagination if we are on the final page", function() {
        $(LISTENER).trigger(":cards/append/received", stub_final_page);
        expect(lm._hide).toHaveBeenCalled();
      });
    });

    describe("on click", function() {
      beforeEach(function() {
        loadFixtures("load_more.html");
        window.lm = new LoadMore({
          el: ".js-pagination"
        });
        var spyEvent = spyOnEvent(lm.$el, ":cards/append");
        spyOn(lm, "_block");
        spyOn(lm, "_serialize").andReturn("foo");
        lm.currentPage = 4;
        lm.$btn.trigger("click");
      });

      it("updates the current page", function() {
        expect(lm.currentPage).toBe(5);
      });

      it("disables the pagination", function() {
        expect(lm._block).toHaveBeenCalled();
      });

      it("serializes the pagination", function() {
        expect(lm._serialize).toHaveBeenCalled();
      });

      it("triggers the page/append event", function() {
        expect(":cards/append").toHaveBeenTriggeredOnAndWith(lm.$el, "foo");
      });
    });

  });

});
