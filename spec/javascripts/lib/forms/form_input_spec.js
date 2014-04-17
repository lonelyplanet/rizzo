require( [ "lib/forms/form_input" ], function(FormInput) {

  var formInput = null;

  describe("LP Form Input", function() {

    var input = $("<input type='text' name='foo' id='foo' data-rules='required' />"),
        label = $("<label for='foo'>Foo</label>"),
        inputParent = $("<div class='js-input' />");

    inputParent.append(input, label);

    describe("Form Input object", function() {

      it("is defined", function() {
        expect(FormInput).toBeDefined();
      });

    }); // Form Input object

    describe("initialising Form Input object", function() {

      it("initialises when all parameters are supplied", function() {
        spyOn(FormInput.prototype, "_initialize");

        formInput = new FormInput(input, label);

        expect(FormInput.prototype._initialize).toHaveBeenCalled();
      });

      it("does not initialise when the parameters are not supplied", function() {
        spyOn(FormInput.prototype, "_initialize");

        formInput = new FormInput();

        expect(FormInput.prototype._initialize).not.toHaveBeenCalled();
      });

    }); // initialising Form Input object

    describe("validating", function() {

      it("recognizes an invalid input", function() {
        formInput = new FormInput(input, label);

        expect(formInput.isValid()).toBe(false);
      });

      it("recognizes a valid input", function() {
        input.val("foo");

        formInput = new FormInput(input, label);

        expect(formInput.isValid()).toBe(true);
      });

    }); // validating

    describe("displaying error messages", function() {

      beforeEach(function() {
        formInput = new FormInput(input, label);
      });

      it("shows an error message", function() {
        formInput._showError("foo");

        expect(inputParent).toHaveClass("field__input--error");
        expect(inputParent.find(".js-error").length).toBe(1);
      });

      it("clears the error message", function() {
        formInput._clearValidation();

        expect(inputParent).not.toHaveClass("field__input--error");
        expect(inputParent.find(".js-error").length).toBe(0);
      });

    }); // displaying error/valid messages

    describe("username checking", function() {

      beforeEach(function() {
        formInput = new FormInput(input, label);
      });

      it("indicates when a username is unavailable", function() {
        formInput._indicateUsernameValidity({ unique: false });

        expect(inputParent).toHaveClass("field__input--error");
        expect(inputParent.find(".js-error").length).toBe(1);
        expect(inputParent.find(".js-error").text()).toBe("Sorry. That’s taken by another member. Please try again.");
      });

      it("indicates when a username is available", function() {
        formInput._indicateUsernameValidity({ unique: true });

        expect(inputParent).toHaveClass("field__input--valid");
        expect(inputParent.find(".js-error").length).toBe(0);
      });

    }); // username checking

  }); // LP Form Input

});
