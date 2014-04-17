require([ "public/assets/javascripts/lib/utils/template" ], function(Template) {

  "use strict";

  describe("Template", function() {

    it("renders a given template with the given object", function() {
      var obj = { foo: "one", bar: "two", baz: "three" },
          template = "{{foo}} - {{bar}}, {{baz}}";
      expect(Template.render(template, obj)).toBe("one - two, three");
    });

  });

});
