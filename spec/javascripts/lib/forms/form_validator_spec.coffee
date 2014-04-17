require ['lib/forms/form_validator'], (FormValidator) ->

  describe 'LP Form Validation', ->

    describe 'Form Validator object', ->
      it 'is defined', ->
        expect(FormValidator).toBeDefined()

    describe 'initialising a Form Validator', ->

      beforeEach ->
        loadFixtures 'form_validation.html'

      it 'initialises when the form exists', ->
        spyOn(FormValidator.prototype, '_initialize')
        form = new FormValidator('#test-form')

        expect(FormValidator.prototype._initialize).toHaveBeenCalled()

      it 'does not initialise when the form does not exist', ->
        spyOn(FormValidator.prototype, '_initialize')
        form = new FormValidator('#untest-form')

        expect(FormValidator.prototype._initialize).not.toHaveBeenCalled()

      it 'disables the submit button when there are invalid fields on init', ->
        form = new FormValidator('#test-form')

        expect($('#test-form [type="submit"]').attr('disabled')).toBe 'disabled'

    describe 'creating form field objects from the form', ->

      beforeEach ->
        loadFixtures 'form_validation.html'

      it 'has a field object for each field in the form', ->
        form = new FormValidator('#test-form')

        expect(form.inputs.length).toBe 4

    describe 'validating a form', ->

      beforeEach ->
        loadFixtures 'form_validation.html'

      it 'is not valid if the fields are invalid', ->
        form = new FormValidator('#test-form')

        expect(form.isValid()).toBe false

        $('#test-form input').first().trigger('blur')

        expect($('#test-form [type="submit"]').attr('disabled')).toBe 'disabled'

      it 'validates the fields individually on change', ->
        form = new FormValidator('#test-form')

        $('#test-form input').first().trigger('change')
        expect($('#test-form .input__container').first().hasClass('field__input--error')).toBe true

      it 'is valid if the fields are valid', ->
        form = new FormValidator('#test-form')

        $('#required').val('some text')
        $('#number').val(54321)
        $('#first-select').val(1);
        $('#second-select').val(1);

        $('#test-form input').first().trigger('change')

        expect(form.isValid()).toBe true
        expect($('#test-form input[type="submit"]').attr('disabled')).toBe undefined
