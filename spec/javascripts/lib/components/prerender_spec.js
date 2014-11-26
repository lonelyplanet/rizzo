require([ "jquery", "public/assets/javascripts/lib/components/prerender.js" ], function($, Prerender) {

  "use strict";

  var sampleData = {
    title: "Prerendered title",
    content: "Prerendered content"
  },
  prerender;

  describe("Prerender", function() {

    beforeEach(function() {
      loadFixtures("prerender.html");
      prerender = new Prerender({ template: "#tmpl-prerender" });
    });

    describe("Open/Close", function() {

      describe("prerendering content", function() {
        beforeEach(function() {
          $("#js-row--content").trigger(":lightbox/open", {opener: "#opener", target: "#target"});
        });

        it("should have prerendered content", function() {
          expect($("#target .my-title").html()).toContain(sampleData.title);
          expect($("#target .my-content").html()).toContain(sampleData.content);
        });
      });
    });

    describe("Pagination", function() {

      beforeEach(function(){
        spyOn(prerender, "_getContainerDimensions").andReturn({
          width: 1000,
          left: 200
        });
        spyOn(prerender, "getViewPort").andReturn(1600);
      })

      it("can paginate right", function(){
        $("#js-row--content").trigger(":lightbox/navigate", { opener: "#next", target: "#target"});

        expect($("#target .my-title").html()).toContain("Next prerendered title");
        expect($("#target .my-content").html()).toContain("Next prerendered content");
        expect($("#target .js-prerender-panel").attr("style")).toContain("left: 1400px");
        expect($("#target .js-prerender-container").attr("style")).toContain("translateX(-1600px)")
      });

      it("can paginate left", function(){
        $("#js-row--content").trigger(":lightbox/navigate", { opener: "#previous", target: "#target"});

        expect($("#target .my-title").html()).toContain("Previous prerendered title");
        expect($("#target .my-content").html()).toContain("Previous prerendered content");
        expect($("#target .js-prerender-panel").attr("style")).toContain("right: 1400px");
        expect($("#target .js-prerender-container").attr("style")).toContain("translateX(1600px)")
      });

    });

  });
});
