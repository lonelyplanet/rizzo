define( ['jquery','lib/utils/asset_fetch', 'lib/core/authenticator','lib/core/shopping_cart', 'lib/core/msg', 'lib/utils/local_store', 'lib/managers/select_group_manager', 'lib/core/ad_manager_v2', 'lib/core/nav_search'], ($, AssetFetch, Authenticator, ShoppingCart, Msg, LocalStore, SelectGroupManager, AdManager, NavSearch) ->

  class Base

    constructor: (args={})->
      @showUserBasket()
      @initAds() unless args.secure
      @showCookieComplianceMsg()
      @initialiseSelectGroupManager()
      @addNavTracking()
      @addAutocomplete()

    initAds: ->
      if (window.lp && window.lp.ads)
        @adManager = new AdManager(window.lp.ads)

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
              
        msg = new Msg(args)
        LocalStore.set('cookie-compliance', true)

    addNavTracking: ->
      $('#js-primary-nav').on 'click', '.js-nav-item', ->
        window.s.linkstacker($(@).text())

      $('#js-primary-nav').on 'click', '.js-nav-cart', ->
        window.s.linkstacker("shopping-cart")

      $('#js-secondary-nav').on 'click', '.js-nav-item', ->
        window.s.linkstacker($(@).text() + "-sub")

      $('#js-breadcrumbs').on 'click', '.js-nav-item', ->
        window.s.linkstacker("breadcrumbs")

      $('#js-footer-nav').on 'click', '.js-nav-item', ->
        window.s.linkstacker("footer")

    addAutocomplete: ->
      new NavSearch(".js-primary-search")
)
