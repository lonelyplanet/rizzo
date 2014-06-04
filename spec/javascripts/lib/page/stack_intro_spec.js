require([ "public/assets/javascripts/lib/page/stack_intro.js" ], function(StackIntro) {

  describe("StackIntro", function() {

    var LISTENER = "#js-card-holder";

    describe("Object", function() {
      it("is defined", function() {
        expect(StackIntro).toBeDefined();
      });
    });

    describe("default instance", function() {
      beforeEach(function() {
        loadFixtures("stack_intro.html");
        this.stackIntro = new StackIntro({
          el: ".js-stack-intro"
        });
      });

      it("has default configuration", function() {
        var args = {
          el: ".js-stack-intro",
          title: ".js-copy-title",
          lead: ".js-copy-lead"
        };
        expect(this.stackIntro.config).toEqual(args);
      });

      it("extends base configuration", function() {
        var customArgs = {
          el: ".foo-intro",
          title: ".foo-title",
          lead: ".foo-lead"
        };
        var customIntro = new StackIntro(customArgs);
        expect(customIntro.config).toEqual(customArgs);
      });
    });

    describe("When the parent element does not exist", function() {
      beforeEach(function() {
        loadFixtures("stack_intro.html");
        window.stackIntro = new StackIntro({
          el: ".foo"
        });
        spyOn(stackIntro, "_init");
      });

      it("does not initialise", function() {
        expect(stackIntro._init).not.toHaveBeenCalled();
      });
    });

    describe("updating", function() {
      beforeEach(function() {
        loadFixtures("stack_intro.html");
        window.stackIntro = new StackIntro({
          el: ".js-stack-intro"
        });
      });

      it("updates intro title", function() {
        var title = "City Of Goa";
        window.stackIntro._update({
          title: title
        });
        expect($("" + window.stackIntro.config.title)).toHaveText(title);
      });

      it("updates lead paragraph", function() {
        var lead = "Lorem ipsum dolor sit amet";
        window.stackIntro._update({
          lead: lead
        });
        expect($("" + window.stackIntro.config.lead)).toHaveText(lead);
      });
    });

    describe("content visibility", function() {
      beforeEach(function() {
        loadFixtures("stack_intro.html");
        this.stackIntro = new StackIntro({
          el: ".js-stack-intro"
        });
      });

      it("hides lead container", function() {
        var lead = "";
        this.stackIntro._update({
          lead: lead
        });
        expect($("" + this.stackIntro.config.lead)).toHaveClass("is-hidden");
      });

      it("shows lead container", function() {
        var lead = "Lorem ipsum dolor sit amet";
        this.stackIntro._update({
          lead: lead
        });
        expect($("" + this.stackIntro.config.lead)).not.toHaveClass("is-hidden");
      });
    });

    var data = {
      copy: {
        title: "Vietnam hotels and hostels",
        lead: "Some lead information about accommodation in Vietnam",
        description: "Some general information about accommodation in Vietnam"
      }
    };

    describe("on received events", function() {
      beforeEach(function() {
        loadFixtures("stack_intro.html");
        this.stackIntro = new StackIntro({
          el: ".js-stack-intro"
        });
        spyOn(this.stackIntro, "_update");
      });

      it("cards/received", function() {
        $(LISTENER).trigger(":cards/received", data);
        expect(this.stackIntro._update).toHaveBeenCalledWith(data.copy);
      });

      it("page/received", function() {
        $(LISTENER).trigger(":page/received", data);
        expect(this.stackIntro._update).toHaveBeenCalledWith(data.copy);
      });
    });

  });

});
