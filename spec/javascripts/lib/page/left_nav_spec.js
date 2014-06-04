require([ "public/assets/javascripts/lib/page/left_nav.js" ], function(LeftNav) {

  describe("LeftNav", function() {

    var config = {
      el: "#js-stack-list-aside",
      list: ".js-neighbourhood-item,.js-facet,.js-descendant-item,.js-stack-collection"
    };

    describe("Object", function() {
      it("is defined", function() {
        expect(LeftNav).toBeDefined();
      });
    });

    describe("Initialising", function() {
      beforeEach(function() {
        loadFixtures("stack_list.html");
        window.leftNav = new LeftNav(config);
      });

      it("has default options", function() {
        expect(leftNav.config).toBeDefined();
      });
    });

    describe("Not initialising", function() {
      beforeEach(function() {
        loadFixtures("stack_list.html");
        window.leftNav = new LeftNav({
          el: ".foo"
        });
        spyOn(leftNav, "_init");
      });

      it("When the parent element does not exist", function() {
        expect(leftNav._init).not.toHaveBeenCalled();
      });
    });

    describe("when the user clicks on a stack", function() {
      beforeEach(function() {
        loadFixtures("stack_list.html");
        window.leftNav = new LeftNav(config);
      });

      it("triggers the page request event", function() {
        var element = leftNav.$el.find(".js-neighbourhood-item");
        var params = {
          url: element.attr("href")
        };
        var spyEvent = spyOnEvent(leftNav.$el, ":page/request");
        element.trigger("click");
        expect(":page/request").toHaveBeenTriggeredOnAndWith(leftNav.$el, params);
      });

      describe("when the user clicks on a stack", function() {
        beforeEach(function() {
          loadFixtures("stack_list.html");
          window.leftNav = new LeftNav(config);
        });

        it("sets the nav item as current", function() {
          var element = $(".js-neighbourhood-item");
          leftNav._select(element);
          expect(element).toHaveClass("is-active");
          expect($(".js-facet")).not.toHaveClass("is-active");
        });
      });

    });

  });

});
