require([
  "jquery",
  "lib/utils/alert"
], function($, Alert) {

  "use strict";

  describe("Alert", function() {
    var alert;

    beforeEach(function() {
      loadFixtures("alert.html");
      alert = new Alert();
    });

    describe("Initialisation", function() {

      it("should be defined", function() {
        expect(alert).toBeDefined();
      });

      it("should find container element", function() {
        expect(alert.$container.length).toEqual(1);
      });
    });

    describe("Functionality", function() {

      describe("Render", function() {

        beforeEach(function() {
          spyOn(alert, "scrollTo");
          alert._render({ title: "Yay!", content: "You did it!" }, "error");
        });

        it("should find only one alert element", function() {
          expect($(".alert--error").length).toEqual(1);
        });

        it("should append solid alert block by default", function() {
          expect($(".alert--block").length).toEqual(1);
          expect($(".alert--subtle").length).toEqual(0);
        });

        it("should render title and content properly", function() {
          expect(alert.$container.find(".alert__title").text()).toEqual("Yay!");
          expect(alert.$container.find(".alert__content").text()).toEqual("You did it!");
        });

        it("should scroll to appended alert", function() {
          expect(alert.scrollTo).toHaveBeenCalled();
        });

        describe("title only", function() {

          beforeEach(function() {
            alert.warning({ title: "Robisaduck!" });
          });

          it("should leave content element empty", function() {
            expect(alert.$container.find(".alert__title").text()).toEqual("Robisaduck!");
            expect(alert.$container.find(".alert__content").text()).toEqual("");
          });
        });

        describe("content only", function() {

          beforeEach(function() {
            alert.error({ content: "Duckisarob!" });
          });

          it("should leave title element empty", function() {
            expect(alert.$container.find(".alert__title").text()).toEqual("");
            expect(alert.$container.find(".alert__content").text()).toEqual("Duckisarob!");
          });
        });

        describe("subtle block", function() {

          describe("by default", function() {

            beforeEach(function() {
              alert = new Alert({ isSubtle: true });
              alert.success("-");
            });

            it("should render element with alert--subtle class", function() {
              expect($(".alert--subtle").length).toEqual(1);
              expect($(".alert--block").length).toEqual(0);
            });
          });

          describe("selectively", function() {

            beforeEach(function() {
              alert.warning("-", true);
            });

            it("should render element with alert--subtle class", function() {
              expect($(".alert--subtle").length).toEqual(1);
              expect($(".alert--block").length).toEqual(0);
            });
          });
        });

        describe("success()", function() {

          beforeEach(function() {
            alert.success("-");
          });

          it("should append elements with proper classes to container", function() {
            expect(alert.$container.find(".alert--success").length).toEqual(1);
            expect(alert.$container.find(".icon--tick--before").length).toEqual(1);
          });
        });

        describe("error()", function() {

          beforeEach(function() {
            alert.error("-");
          });

          it("should append elements with proper classes to container", function() {
            expect(alert.$container.find(".alert--error").length).toEqual(1);
            expect(alert.$container.find(".icon--cross--before").length).toEqual(1);
          });
        });

        describe("warning()", function() {

          beforeEach(function() {
            alert.warning("-");
          });

          it("should append elements with proper classes to container", function() {
            expect(alert.$container.find(".alert--warning").length).toEqual(1);
            expect(alert.$container.find(".icon--caution--before").length).toEqual(1);
          });
        });

        describe("announcement()", function() {

          beforeEach(function() {
            alert.announcement("-");
          });

          it("should append elements with proper classes to container", function() {
            expect(alert.$container.find(".alert--announcement").length).toEqual(1);
            expect(alert.$container.find(".icon--loudspeaker--before").length).toEqual(1);
          });
        });
      });

      describe("scrollTo()", function() {

        beforeEach(function() {
          spyOn(alert.$body, "animate");
          spyOn(alert.$body, "scrollTop").andReturn(alert.containerPosition + 1);
          alert.scrollTo();
        });

        it("should call animate and scroll the page to alert container", function() {
          expect(alert.$body.animate).toHaveBeenCalledWith({ scrollTop: alert.containerPosition }, 300);
        });
      });

      describe("clear()", function() {

        beforeEach(function() {
          alert.$container.html("some content");
          alert.clear();
        });

        it("should remove appended elements", function() {
          expect(alert.$container.html().length).toEqual(0);
        });
      });
    });
  });
});
