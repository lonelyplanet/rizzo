# Note: We need to add 'lib/core/ad_manager' back in after 'jquery' when the switch to the new DFP server happens.
#   Also worth noting is that the ad_manager and ad_manager_old calls in waldorf/app/assets/javascripts/*.js need to be removed.
define( ['jquery','lib/utils/asset_fetch', 'lib/core/authenticator','lib/core/shopping_cart', 'lib/core/msg', 'lib/utils/local_store', 'lib/managers/select_group_manager'], ($, AssetFetch, Authenticator, ShoppingCart, Msg, LocalStore, SelectGroupManager) ->

  class Base

    constructor: (args={})->
      @authenticateUser()
      @showUserBasket()
      # Note: We need to add this back in when the switch to the new DFP server happens
      # @initAds() unless args.secure
      @showCookieComplianceMsg()
      @initialiseSelectGroupManager()
      @addNavTracking()
      @scrollPerf()

    # This adConfig can all be ditched when switching to the new DFP server.
    lpAds = (window.lp and lp.ads)
    adConfig :
      adZone : if (lpAds && lpAds.adZone) then lpAds.adZone else window.adZone or 'home'
      adKeywords : if (lpAds && lpAds.adKeywords) then lpAds.adKeywords else window.adKeywords or ' '
      tile : if (lpAds && lpAds.tile)  then lpAds.tile else 1
      ord : if (lpAds && lpAds.ord)  then lpAds.ord else window.ord or Math.random()*10000000000000000
      segQS : if (lpAds && lpAds.segQS)  then lpAds.segQS else window.segQS or ' '
      mtfIFPath : if (lpAds && lpAds.mtfIFPath)  then lpAds.mtfIFPath else '/'
      unit: [728,90]

    authenticateUser: ->
      @auth = new Authenticator()

      $.ajax
        url: @auth.getNewStatusUrl()
        dataType: "json"
        error: =>
          # Fallback to the old method for the moment.
          AssetFetch.get "https://secure.lonelyplanet.com/sign-in/status", () =>
            @auth.update()
        success: (user) =>
          # The data returned is defined in community at: app/controllers/users_controller.rb@status
          window.lp.user = user

          # Legacy, keep until the old stuff is discarded and Authenticator has been refactored.
          window.lpLoggedInUsername = user.username || "";
          window.facebookUserId = user.facebook_uid;
          window.surveyEnabled = "false";
          window.timestamp = user.timestamp;
          window.referer = "null";

          @auth.update()

    initAds: ->
      AdManager.init(@adConfig(), 'ad-leaderboard') # Remove the second param when dropping the old ad manager

    showUserBasket: ->
      shopCart = new ShoppingCart()

    initialiseSelectGroupManager: ->
      new SelectGroupManager()

    showCookieComplianceMsg: ->
      if LocalStore.get('cookie-compliance') is undefined or LocalStore.get('cookie-compliance') is null
        args =
          content: "<p class='cookie-text'><strong>Hi there,</strong> we use cookies to improve your experience on our website. You can <a class='cookie-link' href='http://www.lonelyplanet.com/legal/cookies'>update your settings</a> by clicking the Cookie Policy link at the bottom of the page.</p>"
          style: "row--cookie-compliance js-cookie-compliance"
          userOptions :
            close: true
            more: true
          delegate:
            onRemove : ->
              $('div.js-cookie-compliance').removeClass('is-open')
              $('div.js-cookie-compliance').addClass('is-closed')
            onAdd : ->
              window.setTimeout( ( => $('div.js-cookie-compliance').addClass('is-open')), 1)
        msg = new Msg(args)
        LocalStore.set('cookie-compliance', true)

    addNavTracking: ->
      $('#js-primary-nav').on 'click', '.js-nav-item', ->
        window.s.linkstacker($(@).text())

      $('#js-primary-nav').on 'click', '.js-nav-cart', ->
        window.s.linkstacker("shopping-cart")

      $('#js-primary-nav').on 'submit', '.js-nav-search', ->
        window.s.linkstacker("search")

      $('#js-secondary-nav').on 'click', '.js-nav-item', ->
        window.s.linkstacker($(@).text() + "-sub")

      $('#js-breadcrumbs').on 'click', '.js-nav-item', ->
        window.s.linkstacker("breadcrumbs")

      $('#js-footer-nav').on 'click', '.js-nav-item', ->
        window.s.linkstacker("footer")

    scrollPerf: ->

      if ($('html.ie7, html.ie8, body.browserIE7, body.browserIE8').length is 0 && !!window.addEventListener)
        # Used to track the enabling of hover effects
        enableTimer = false

        # Listen for a scroll and use that to remove the possibility of hover effects
        window.addEventListener 'scroll', ->
          clearTimeout(enableTimer);
          document.documentElement.style.pointerEvents = "none"

          enableTimer = setTimeout ->
            document.documentElement.style.pointerEvents = "auto"
          , 300
        , false
)
