require ['jquery', 'public/assets/javascripts/lib/utils/image_helper.js'], ($, ImageHelper) ->

  describe 'ImageHelper', ->

    beforeEach ->
      loadFixtures('image_helper.html');
      window.image_helper = new ImageHelper()

    describe 'Object', ->
      it 'is defined', ->
        expect(image_helper).toBeDefined()

    describe '.detectOrientation()', ->

      it 'detects landscape', ->
        expect(image_helper.detectOrientation($('#landscape .img'))).toBe('landscape')

      it 'detects portrait', ->
        expect(image_helper.detectOrientation($('#portrait .img'))).toBe('portrait')

      it 'detects squarish (i.e.: neither quite portrait nor landscape)', ->
        expect(image_helper.detectOrientation($('#squarish .img'))).toBe('squarish')

    describe '.detectRelativeSize()', ->

      it 'detects taller', ->
        $container = $('#taller')
        $img = $container.find('.img')
        expect(image_helper.detectRelativeSize($img, $container)).toBe('taller')

      it 'detects wider', ->
        $container = $('#wider')
        $img = $container.find('.img')
        expect(image_helper.detectRelativeSize($img, $container)).toBe('wider')

    describe '.applyOrientationClasses()', ->

      it 'adds `is-landscape` class', ->
        $img = $('#landscape .img')
        image_helper.applyOrientationClasses($img)
        expect($img.hasClass('is-landscape')).toBe(true)

      it 'adds `is-portrait` class', ->
        $img = $('#portrait .img')
        image_helper.applyOrientationClasses($img)
        expect($img.hasClass('is-portrait')).toBe(true)

    describe '.applyRelativeClasses()', ->

      it 'detects when the image is taller', ->
        $container = $('#taller')
        $img = $container.find('.img')
        image_helper.applyRelativeClasses($img, $container)
        expect($img.hasClass('is-taller')).toBe(true)

      it 'detects when the image is wider', ->
        $container = $('#wider')
        $img = $container.find('.img')
        image_helper.applyRelativeClasses($img, $container)
        expect($img.hasClass('is-wider')).toBe(true)

    describe '.centerWithinContainer()', ->

      it 'centers vertically', ->
        $container = $('#centerV')
        $img = $container.find('.img')
        image_helper.centerWithinContainer($img, $container)
        expect($('#centerV .img')[0].style.marginLeft).toBe("-12.5%")

      it 'centers horizontally', ->
        $container = $('#centerH')
        $img = $container.find('.img')
        image_helper.centerWithinContainer($img, $container)
        expect($('#centerH .img')[0].style.marginTop).toBe("-50%")

    describe '.processImages()', ->

      it 'Finds and processes images', ->
        $images = $('.img')

        image_helper.processImages
          img: '.img'
          container: '.img-container'

        $images.each (i, img) ->
          expect(img.className.match(/is\-landscape|portrait|squarish/)).not.toBeNull()
          expect(img.className.match(/is\-taller|wider|equal/)).not.toBeNull()

      it 'Waits for images to load if it has no dimensions', ->
        $img = $('.img-onload')

        runs ->
          image_helper.processImages
            img: '.img-onload'
            container: '.img-onload-container'

          $img.eq(0).css({ width: 1000, height: 600 }).trigger('load')
          $img.eq(1).css({ width: 600, height: 1000 }).trigger('load')

        waitsFor ->
          $img.eq(0).width() and $img.eq(1).width()
        , 'The image to load'

        runs ->
          expect($img.eq(0).hasClass('is-landscape'))
          expect($img.eq(0).hasClass('is-wider'))
          expect($img.eq(1).hasClass('is-portrait'))
          expect($img.eq(1).hasClass('is-taller'))
