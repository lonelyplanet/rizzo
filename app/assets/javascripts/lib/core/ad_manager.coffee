define ['jquery', 'gpt'], ->
  adManager =
    # sizes is all that's needed for the new implementation.
    sizes:
      adSense: [155,256]
      leaderboard: [[970,66], [728,90]]
      mpu: [[300,250], [300, 600], [394,380]]
      oneByOne: [1,1]
      sponsorTile: [276,32]
      trafficDriver: [192,380]

    adUnits: {}
    firstLoaded: false

    init : () ->

      # GPT Boilerplate code
      window.googletag = window.googletag || {}
      googletag.cmd = googletag.cmd || []
        # Truncated from original Boilerplate code due to using requireJS
      # END GPT Boilerplate code

      googletag.cmd.push ->
        adCount = 0
        ord = Math.random()
        toDisplay = lp.ads.toDisplay
        toPoll = {}

        unit = [lp.ads.networkCode] # Network Code - Found in the "Admin" tab of DFP
        i = 0
        while i < lp.ads.layers.length
          unit.push(lp.ads.layers[i])
          i++

        i = 0
        while i < toDisplay.length
          type = toDisplay[i]
          adEl = document.getElementById("js-ad-"+type)
          adSize = adManager.sizes[type]
          newId = "js-ad-"+type+"-"+adCount
          pubAds = googletag.pubads()

          adCount++

          # Make sure we get all instances of this type of ad.
          i++ if document.getElementById("js-ad-"+type) is null or adEl is null

          # If the adEl doesn't exist on the page, continue to the next iteration so that JS execution doesn't fail.
          if adEl is null
            continue

          # Exploit the fact that getElementById only returns the FIRST element with that ID and make this one unique.
          adEl.id = newId

          if /mpu/i.test(type)
            toPoll[newId] = ->
              adManager.showAd.apply this, arguments
              adManager.checkMpu.apply this, arguments
          else if /adsense/i.test(type)
            # Note: we're using the old, non DFP way of calling adsense ads. Ideally once we figure out how to serve these through DFP, this can be ditched in favour of the below commented out code.
            continue
          else if /oneByOne/i.test(type)
            toPoll[newId] = adManager.checkOneByOne
          else if /(leaderboard|trafficDriver)/i.test(type)
            toPoll[newId] = adManager.showAd

          adUnit = googletag.defineSlot("/"+unit.join("/"), adSize, newId).addService(pubAds)

          # These are also deprecated and can be removed at some point in the future.
          adUnit.setTargeting('ord', ord)
          adUnit.setTargeting('tile', adCount)
          if /oneByOne/.test(type)
            adUnit.setTargeting('sz', '1x1')
          # End deprecated.

          adManager.adUnits[newId] = adUnit

          # DFP code... we can't use this until the switch to the new DFP server happens and we figure out how this works.
          # if /adsense/i.test(type) and lp.ads.channels
            # adUnit.set("adsense_border_color", "FFFFFF")
            #   .set("adsense_background_color", "FFFFFF")
            #   .set("adsense_link_color", "0C77BF")
            #   .set("adsense_text_color", "677276")
            #   .set("adsense_url_color", "000000")
            #   .set("adsense_ad_types", "text")
            #   .set("adsense_channel_ids", lp.ads.channels.replace(/\s/g, '+'))

        # This is just a JSON formatted object to make it easy to add as many key:value pairs as desired.
        for key of lp.ads.keyValues
          if lp.ads.keyValues.hasOwnProperty(key)
            pubAds.setTargeting(key, lp.ads.keyValues[key])

        # Deprecated key:value pairs
        pubAds.setTargeting("ctt", lp.ads.continent) if lp.ads.continent
        pubAds.setTargeting("cnty", lp.ads.country) if lp.ads.country
        pubAds.setTargeting("dest", lp.ads.destination) if lp.ads.destination
        pubAds.setTargeting("tnm", lp.ads.adTnm.replace(/\s/, "").split(",")) if lp.ads.adTnm
        pubAds.setTargeting("thm", lp.ads.adThm) if lp.ads.adThm
        # End deprecated.

        pubAds.enableSingleRequest()
        pubAds.collapseEmptyDivs(true)
        googletag.enableServices()

        # Call the display method for all ads we've defined.
        for ad of adManager.adUnits
          if adManager.adUnits.hasOwnProperty(ad)
            googletag.display(ad)

        # Kick off polling where needed.
        for elId of toPoll
          if toPoll.hasOwnProperty(elId)
            adManager.poll document.getElementById(elId), toPoll[elId]

    checkMpu : (adEl, iframe) ->
      if iframe.width() > 310
        thisCard = $(adEl).closest('.js-card-ad').addClass('ad-house')
        $(adEl).removeClass('is-faded-out')

      else if iframe.height() > $(adEl).height()
        # We need a timeout here because the leaderboard might be animating down which messes with our 'top' calc.
        setTimeout ->
          thisCard = $(adEl).closest('.js-card-ad').addClass 'ad-doubleMpu'
          grid = $(adEl).closest('.js-stack')
          cardsPerRow = Math.floor grid.width() / (grid.find('.js-card.card--single').width())
          cards = $('.js-card')
          thisCardIndex = cards.index(thisCard)

          # Eliminate all cards preceding our ad element so we can place a dummy el at the nth position *after* the current one using .eq()
          cards = $(cards.splice(thisCardIndex))
          dummyCard = '<div class="card card--double ad--placeholder js-card" />'

          # cardsPerRow - 2 because the mpu takes the width of 2 cards.
          cards.eq(cardsPerRow - 2).after(dummyCard)
          thisCard.css(
            left: thisCard.position().left
            position: 'absolute'
            top: thisCard.position().top
          ).before(dummyCard)

          setTimeout ->
            $(adEl).removeClass('is-faded-out')
          , 500
        , 500

      else
        # Otherwise remove this class straight away
        $(adEl).removeClass('is-faded-out')

    checkOneByOne : (adEl, iframe) ->
      setTimeout ->
        # If there's an #ad-link element, it's the interstitial. Also, use the setTimeout 0 trick to make sure this gets loaded in (since it's external)
        if ($(iframe).contents().find('#ad-link').length > 0)
          adManager.setupInterstitial(adEl, iframe)
      , 0
      # Note: the wallpaper does all the work from the code that's returned by the ad server.

    showAd : (adEl, iframe) ->
      if adEl.style.display isnt 'none'
        $(adEl).closest('.is-closed').removeClass('is-closed')

    setupInterstitial : (adEl, iframe) ->
      adLink = $(iframe).contents().find('#ad-link')
      adDim = adLink.data('adDimensions')
      adHtml = adLink.attr('target', '_blank').removeAttr('id').removeAttr('data-ad-dimensions')[0].outerHTML

      timeout = 14

      $(adEl)
        .addClass('ad-interstitial')
        .css(
          display: 'block'
          left: ($(window).width() / 2) - (adDim.width / 2)
          top: ($(window).height() / 2) - (adDim.height / 2)
        )
        .html(adHtml)
        .prepend('<a href="#" class="close">Close X</a>')
        .append('<a href="#" class="countdown">Advertisement closes in <span id="timeleft">'+timeout+'</span> seconds.</a>')
        .appendTo('body')
        .wrap('<div class="ad-interstitial-wrap is-faded-out" />')

      $('body').bind('keyup', adManager.closeInterstitial)
      $('.ad-interstitial-wrap #ad-link').on 'click', (e) ->
        # We need this because the preventDefault on .ad-interstitial-wrap gets in the way.
        e.stopPropagation()
      $('.ad-interstitial-wrap, .ad-interstitial-wrap .close, .ad-interstitial-wrap .countdown').click (e) ->
        adManager.closeInterstitial()
        e.preventDefault()

      adManager.lp_interstitialTimer = window.setInterval ->
        timeout--

        if timeout is 0
          window.clearInterval adManager.lp_interstitialTimer
          adManager.closeInterstitial()
          return false

        timeLeft = $(adEl).find('#timeleft')

        timeLeft.html(timeout)
      , 1000

      # Basically, give the JS a chance for the CSS transitions to be ready. See here: http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
      setTimeout ->
        $('.ad-interstitial-wrap').removeClass('is-faded-out')
      , 0

    closeInterstitial : (e) ->
      if not e or not e.keyCode or (e.keyCode and e.keyCode is 27) # 27 = Escape
        $('.ad-interstitial-wrap').addClass('is-faded-out').on 'transitionend otransitionend webkitTransitionEnd', ->
          # Destroy this as we don't need it anymore
          $('.ad-interstitial-wrap').remove()

        $('body').unbind('keyup', adManager.closeInterstitial)
        window.clearInterval adManager.lp_interstitialTimer
        e && e.preventDefault() && e.stopPropagation()

    # Abstract this polling functionality out for use in both checkMpu and hideEmpty
    poll : (adEl, callback) ->
      count = 0
      maxPoll = 15000 # The maximum amount of milliseconds to poll for
      timeout = 250

      # Ugly but necessary. DOM Mutation events are deprecated, and there's not enough support for MutationObserver yet so we have to poll.
      poll = window.setInterval ->
        count++

        # Make sure we're not running this thing indefinitely
        if (count >= maxPoll/timeout)
          window.clearInterval poll
          return

        $(adEl).find('iframe').each ->
          iframe = $(this)
          contents = iframe.contents()

          # If something's been loaded into our ad element, we're good to go
          if adEl.style.display isnt 'none' and !!contents.find('body').html()

            window.clearInterval poll

            if not adManager.firstLoaded and window.lp and lp.fs and lp.fs.time
              window.lp.fs.time(
                'e':'/destination/ad/first'
              )
              adManager.firstLoaded = true

            # Presume a 1x1 image is just a tracking pixel
            if contents.find('img').width() is 1
              return

            callback.apply(this, [adEl, iframe])

      , timeout

    # The old init used in the site wide leaderboard.
    initOld : (_config,_target) ->
      _config.service?= 'http://ad.doubleclick.net/adi/2009.lonelyplanet'
      iframe = document.createElement('iframe')
      iframe.src = "#{_config.service}/#{_config.adZone};#{_config.adKeywords};#{_config.segQS};tile=#{_config.tile};sz=#{_config.unit[0]}x#{_config.unit[1]};ord=#{_config.ord}?"
      iframe.title = "ad-leaderboard--frame"
      iframe.marginHeight = "0"
      iframe.marginWidth = "0"
      iframe.frameBorder = "0"
      iframe.scrolling = 'no'
      iframe.style.width = "#{_config.unit[0]}px"
      iframe.style.height = "#{_config.unit[1]}px"
      s = document.getElementById(_target)
      s.appendChild(iframe)