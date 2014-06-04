require([ "jquery", "public/assets/javascripts/lib/page/meta.js" ], function($, Meta) {

  "use strict";

  describe("Meta", function() {
    var
      data = {
        copy: {
          title: "Vietnam hotels and hostels",
          description: "Some general information about accommodation in Vietnam"
        }
      },
      dataNoTitle = {
        copy: {
          description: "Some general information about accommodation in Vietnam"
        }
      },
      meta,
      listener = "#js-card-holder";

    describe("Object", function() {
      it("is defined", function() {
        expect(Meta).toBeDefined();
      });
    });

    // *****************
    // Private methods
    // ****************

    describe("Updating the title", function() {
      beforeEach(function() {
        meta = new Meta();
        meta._updateTitle("foo");
      });

      it("updates the document title", function() {
        expect(document.title).toBe("foo");
      });
    });

    describe("Updating the meta tags", function() {
      beforeEach(function() {
        loadFixtures("meta.html");
        meta = new Meta();
        meta._updateMeta(data);
      });
      it("updates the meta title", function() {
        expect($("meta[name='title']").attr("content")).toBe(data.copy.title);
      });
      it("updates the meta description", function() {
        expect($("meta[name='description']").attr("content")).toBe(data.copy.description);
      });
    });

    // --------------------------------------------------------------------------
    // Events API
    // --------------------------------------------------------------------------

    describe("on cards received", function() {
      beforeEach(function() {
        loadFixtures("meta.html");
        meta = new Meta();
        spyOn(meta, "_updateTitle");
        spyOn(meta, "_updateMeta");
      });

      it("calls _updateTitle with the title", function() {
        $(listener).trigger(":cards/received", data);
        expect(meta._updateTitle).toHaveBeenCalledWith(data.copy.title);
      });

      it("calls _updateMeta with the data", function() {
        $(listener).trigger(":cards/received", data);
        expect(meta._updateMeta).toHaveBeenCalledWith(data);
      });

      it("does not update the page unless there is a title returned", function() {
        $(listener).trigger(":cards/received", dataNoTitle);
        expect(meta._updateTitle).not.toHaveBeenCalled();
        expect(meta._updateMeta).not.toHaveBeenCalled();
      });

    });

    describe("on page received", function() {
      beforeEach(function() {
        loadFixtures("meta.html");
        meta = new Meta();
        spyOn(meta, "_updateTitle");
        spyOn(meta, "_updateMeta");
      });

      it("calls _updateTitle with the title", function() {
        $(listener).trigger(":page/received", data);
        expect(meta._updateTitle).toHaveBeenCalledWith(data.copy.title);
      });

      it("calls _updateMeta with the data", function() {
        $(listener).trigger(":page/received", data);
        expect(meta._updateMeta).toHaveBeenCalledWith(data);
      });

      it("does not update the page unless there is a title returned", function() {
        $(listener).trigger(":page/received", dataNoTitle);
        expect(meta._updateTitle).not.toHaveBeenCalled();
        expect(meta._updateMeta).not.toHaveBeenCalled();
      });

    });
  });
});
