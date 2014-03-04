require ['public/assets/javascripts/lib/components/range_slider.js'], (RangeSlider) ->

  describe 'RangeSlider', ->

    describe 'Initialisation', ->
      beforeEach ->
        loadFixtures('range_slider.html')
        window.rangeSlider = new RangeSlider()

      it 'creates a slider', ->
        expect($('.noUi-target').length).toBeTruthy()

    describe "An uncapped slider", ->
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
        config = rangeSlider._getConfig(input)
        expect(config.handles).toEqual(2)
        expect(config.connect).toEqual(true)
        expect(config.range).toEqual(["0", "100"])
        expect(config.start).toEqual(["40","60"])



    describe "A capped slider", ->
      beforeEach ->
        window.rangeSlider = new RangeSlider()

      it 'parses the data attributes correctly', ->
        input = {
          range: "0,100",
          current: "40,60",
          targets: "foo,bar",
          capLevel: "90"
        }
        config = rangeSlider._getConfig(input)
        expect(config.handles).toEqual(2)
        expect(config.connect).toEqual(true)
        expect(config.range).toEqual(["0", "90"])
        expect(config.start).toEqual(["40","60"])

      it 'reduces the current amount if above the cap', ->
        input = {
          range: "0,100",
          current: "40,95",
          targets: "foo,bar",
          capLevel: "90"
        }
        config = rangeSlider._getConfig(input)
        expect(config.handles).toEqual(2)
        expect(config.connect).toEqual(true)
        expect(config.range).toEqual(["0", "90"])
        expect(config.start).toEqual(["40","90"])
