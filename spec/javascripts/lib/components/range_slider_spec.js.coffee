require ['public/assets/javascripts/lib/components/range_slider.js'], (RangeSlider) ->

  describe 'RangeSlider', ->

    describe 'Initialisation', ->
      beforeEach ->
        loadFixtures('range_slider.html')
        window.rangeSlider = new RangeSlider()

      it 'creates a slider', ->
        expect($('.noUi-target').length).toBeTruthy()

    describe "Cache API", ->
      beforeEach ->
        window.rangeSlider = new RangeSlider()

      it 'parses the data attributes correctly', ->
        input = {
          range: "0,100",
          current: "40,60",
          targets: "foo,bar"
        }
        output = {
          handles: 2,
          connect: true,
          range: ["0","100"],
          start: ["40","60"]
        }
        expect(rangeSlider._getConfig(input)).toEqual(output)