require([ "public/assets/javascripts/lib/components/read_more.js" ], function(SectionToggle) {

  describe("Section Toggle", function() {

    describe("Object", function() {
      it("is defined", function() {
        expect(SectionToggle).toBeDefined();
      });
    });

    describe("Initialising", function() {
      beforeEach(function() {
        loadFixtures("section_toggle.html");
        spyOn(SectionToggle.prototype, "_init");
      });

      it("has default options", function() {
        window.SectionToggle = new SectionToggle();
        expect(window.SectionToggle.config).toBeDefined();
      });

      it("initialises when the parent element exists", function() {
        window.SectionToggle = new SectionToggle();
        expect(window.SectionToggle._init).toHaveBeenCalled();
      });

      it("does not initialise if the parent element does not exist", function() {
        window.SectionToggle = new SectionToggle({
          selector: ".my-missing-section"
        });
        expect(window.SectionToggle._init).not.toHaveBeenCalled();
      });
    });

    describe("When the total height of the area is smaller than the max height", function() {
      beforeEach(function() {
        loadFixtures("section_toggle.html");
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(50);
        spyOn(SectionToggle.prototype, "addToggle");
        spyOn(SectionToggle.prototype, "setWrapperState");
        window.SectionToggle = new SectionToggle({
          maxHeight: 100
        });
      });

      it("keeps the toggle area open and does not have a toggle button", function() {
        expect(window.SectionToggle.addToggle).not.toHaveBeenCalled();
        expect(window.SectionToggle.setWrapperState).toHaveBeenCalledWith("open");
        expect(window.SectionToggle.$toggle).not.toBeDefined();
      });
    });

    describe("When the total height of the area is larger than the max height", function() {
      beforeEach(function() {
        loadFixtures("section_toggle.html");
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(150);
      });

      it("appends a block-style toggle button by default", function() {
        window.SectionToggle = new SectionToggle({
          maxHeight: 100
        });
        expect(window.SectionToggle.$el.find(".btn--clear").length).toBe(1);
        expect(window.SectionToggle.$wrapper).toHaveClass("read-more-block");
      });

      it("appends a shadow block-style toggle button when requested", function() {
        window.SectionToggle = new SectionToggle({
          maxHeight: 100,
          shadow: true
        });
        expect(window.SectionToggle.$el.find(".read-more__handler").length).toBe(1);
        expect(window.SectionToggle.$el.find(".btn--clear").length).toBe(1);
        expect(window.SectionToggle.$wrapper).toHaveClass("read-more-block");
      });

      it("appends an inline-style toggle button when requested", function() {
        window.SectionToggle = new SectionToggle({
          maxHeight: 100,
          style: "inline"
        });
        expect(window.SectionToggle.$el.find(".btn--clear").length).toBe(1);
        expect(window.SectionToggle.$wrapper).toHaveClass("read-more-inline");
      });

      it("closes toggle area by default", function() {
        window.SectionToggle = new SectionToggle({
          maxHeight: 100
        });
        expect(window.SectionToggle.$wrapper.css("maxHeight")).toEqual("100px");
        expect(window.SectionToggle.$el).toHaveClass("is-closed");
        expect(window.SectionToggle.$toggle.text()).toBe("Read more");
      });
    });

    describe("When the Read more button is clicked while closed", function() {
      beforeEach(function() {
        loadFixtures("section_toggle.html");
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(150);
        window.SectionToggle = new SectionToggle({
          maxHeight: 100
        });
        window.SectionToggle.transitionEnabled = false;
        window.SectionToggle.$el.find(".btn--clear").click();
      });

      it("opens the toggle area when the toggle button is clicked", function() {
        expect(window.SectionToggle.$el).toHaveClass("is-open");
        expect(window.SectionToggle.$wrapper.css("maxHeight")).toEqual("150px");
        expect(window.SectionToggle.$toggle.text()).toBe("Read less");
      });
    });

    describe("When the Read more button is clicked while open", function() {
      beforeEach(function() {
        loadFixtures("section_toggle.html");
        spyOn(SectionToggle.prototype, "getFullHeight").andReturn(150);
        window.SectionToggle = new SectionToggle({
          maxHeight: 100
        });
        window.SectionToggle.transitionEnabled = false;
        window.SectionToggle.$el.find(".btn--read-more").click();
        window.SectionToggle.$el.find(".btn--read-more").click();
      });

      it("opens the toggle area when the toggle button is clicked", function() {
        expect(window.SectionToggle.$el).toHaveClass("is-closed");
        expect(window.SectionToggle.$wrapper.css("maxHeight")).toEqual("100px");
        expect(window.SectionToggle.$toggle.text()).toBe("Read more");
      });
    });

    describe("With tolerance", function() {

      describe("When the total height of the area is larger than the max height but within tolerance", function() {
        beforeEach(function() {
          loadFixtures("section_toggle.html");
          spyOn(SectionToggle.prototype, "getFullHeight").andReturn(120);
          spyOn(SectionToggle.prototype, "addToggle");
          spyOn(SectionToggle.prototype, "setWrapperState");
          window.SectionToggle = new SectionToggle({
            maxHeight: 100,
            tolerance: 50
          });
        });

        it("keeps the toggle area open and does not have a toggle button", function() {
          expect(window.SectionToggle.addToggle).not.toHaveBeenCalled();
          expect(window.SectionToggle.setWrapperState).toHaveBeenCalledWith("open");
          expect(window.SectionToggle.$toggle).not.toBeDefined();
        });
      });

      describe("When the total height of the area is larger than the max height plus tolerance", function() {
        beforeEach(function() {
          loadFixtures("section_toggle.html");
          spyOn(SectionToggle.prototype, "getFullHeight").andReturn(120);
        });

        it("appends a block-style toggle button by default", function() {
          window.SectionToggle = new SectionToggle({
            maxHeight: 100,
            tolerance: 10
          });
          expect(window.SectionToggle.$el.find(".btn--clear").length).toBe(1);
          expect(window.SectionToggle.$wrapper).toHaveClass("read-more-block");
        });

        it("closes toggle area by default", function() {
          window.SectionToggle = new SectionToggle({
            maxHeight: 100,
            tolerance: 10
          });
          expect(window.SectionToggle.$wrapper.css("maxHeight")).toEqual("100px");
          expect(window.SectionToggle.$el).toHaveClass("is-closed");
          expect(window.SectionToggle.$toggle.text()).toBe("Read more");
        });
      });

    });

  });

});
