define ['jquery', 'lib/utils/page_state'], ($, PageState)->

  class Authenticator extends PageState

    @version = '0.0.13'

    constructor: () ->
      @options = @createUrls(@getDomain())
      @userState = @userSignedIn()
      @el = $('.js-user-nav')
      @signonWidget()

    getDomain: ->
      if window.location.hostname is "www.lpstaging.com" then "lpstaging.com" else "lonelyplanet.com"

    createUrls: (baseDomain)->
      # If there's a user object in our lp namespace, we know we're using the new community stuff.
      if window.lp.user
        url = if /lonelyplanet\.com/.test(window.location.hostname) then "/thorntree" else ""

        registerLink: "#{url}/users/sign_up"
        signInUrl: "#{url}/users/sign_in"
        signOutUrl: "#{url}/users/sign_out"
        membersUrl: "#{url}/profiles/#{lp.user.profile_slug}"
        forumPostsUrlTemplate: "#{url}/profiles/#{lp.user.profile_slug}/activities"
        profileEditUrl: "#{url}/forums/settings"
        messagesUrl: "#{url}/profiles/#{lp.user.profile_slug}/messages"
      else
        forumPostsUrlTemplate: "//www.#{baseDomain}/thorntree/profile.jspa?username=[USERNAME]"
        membersUrl: "//www.#{baseDomain}/members"
        messagesUrl: "//www.#{baseDomain}/members/messages"
        registerLink: "https://secure.#{baseDomain}/members/registration/new"
        profileEditUrl: "//www.#{baseDomain}/members/[USERNAME]/edit"
        signInUrl: "https://secure.#{baseDomain}/sign-in/login?service=#{escape(window.location)}"
        signOutUrl: "https://secure.#{baseDomain}/sign-in/logout"

    getNewStatusUrl: ->
      if /https?:\/\/(www\.|[a-zA-Z-.]*community\.)?lonelyplanet\.com/.test(@getUrl()) then "/thorntree/users/status" else "/users/status"

    getUserOptions: ->
      [
        {title: 'My profile', uri: "#{@options.membersUrl.replace('[USERNAME]', @lpUserName)}", style:"js-user-profile", icon:"user"},
        {title: 'Settings', uri: "#{@options.profileEditUrl.replace('[USERNAME]', @lpUserName)}",  style:"js-user-settings", icon:"settings"},
        {title: 'Messages', uri: "#{@options.messagesUrl.replace('[USERNAME]', @lpUserName)}", style:"js-user-msg", icon:"envelope"},
        {title: 'Forum activity', uri: "#{@options.forumPostsUrlTemplate.replace('[USERNAME]', @lpUserName)}", style:"nav-user-options__item--forum js-user-forum", icon:"comment" },
        {title: 'Sign out', uri: "#{@options.signOutUrl}", style:"nav-user-options__item--signout js-user-signout", icon:"sign-out" }
      ]

    userSignedIn: ->
      @lpUserName = @getLocalData('lp-uname')
      if (@lpUserName and (@lpUserName isnt '') and (@lpUserName isnt 'undefined')) then true else false

    signonWidget: ->
      if @userState is true
        @showUserBox()
      else
        @showLoginAndRegister()

    showLoginAndRegister: ()->
      @emptyUserNav()
      joinElement = "<a class='nav__item nav__item--primary js-user-join js-nav-item' href='#{@options.registerLink}'><i class='nav__icon icon--sign-in--before icon--white--before'></i>Join</a>"
      signinElement = "<a class='nav__item nav__item--primary js-user-signin js-nav-item' href='#{@options.signInUrl}'><i class='nav__icon icon--user--before icon--white--before'></i>Sign in</a>"
      @el.append("<div class='wv--nav--inline nav__item--user-menu'>"+signinElement + joinElement+"</div>")
      @el.append("<div class='wv--nav--inline nav__item--user-menu--wv'>"+signinElement + joinElement+"</div>")

    showUserBox: ->
      @emptyUserNav()
      @el.addClass('is-signed-in')
      userBoxElement = "<div class='nav__item nav__item--user user-box js-user-box nav__submenu__trigger icon--chevron-down--white--after'><img class='user-box__img js-box-handler' src='#{@userAvatar()}'/></div>"
      @el.append(userBoxElement)
      @el.append(@responsiveOptionsMenu())
      $('.js-user-box').append(@userOptionsMenu())

      if window.lp.user and lp.user.unread_message_count > 0
        $('.js-box-handler').after("<span class='notification-badge notification-badge--unread-messages wv--inline-block'>#{lp.user.unread_message_count}</span>")
        $('.js-user-msg').append($("<span>#{lp.user.unread_message_count}</span>").addClass("nav__submenu__notification"))

    emptyUserNav: ->
      @el.removeClass('is-signed-in')
      $('div.js-user-box, div.nav__item--user-menu, .nav__item--user-menu--wv').remove()

    userOptionsMenu: ->
      userOptions = @getUserOptions()
      optionElements = ("<a class='nav__item nav__submenu__item nav__submenu__link nav-user-options__item js-nav-item #{u.style}' href='#{u.uri}'>#{u.title}#{u.extra || ''}</a>" for u in userOptions).join('')
      userMenu = "<span class='wv--hidden nav--offscreen__title'>#{@lpUserName}</span><div class='nav__submenu nav__submenu--user'><div class='nav--stacked nav__submenu__content icon--tapered-arrow-up--after icon--custom--after nav__submenu__content--user nav-user-options js-user-options'><div class='nav__submenu__item nav__submenu__title'>#{@lpUserName}</div>#{optionElements}</div></div>"

    responsiveOptionsMenu: ->
      userOptions = @getUserOptions()
      responsiveOptionElements =  ("<a class='nav__item nav__item--primary' href='#{u.uri}'><i class='nav__icon copy--icon--before icon--#{u.icon}--before icon--white--before'></i>#{u.title}#{u.extra || ''}</a>" for u in userOptions).join('')
      resonsiveMenu = "<div class='wv--nav--inline nav__item--user-menu'>#{responsiveOptionElements}</div>"

    userAvatar: ->
      if window.lp.user
        window.lp.user.avatar
      else
        "//www.#{@getDomain()}/thorntree/placeholders/avatars/small.png"

    update: ->
      @options = @createUrls(@getDomain())
      @setLocalData("lp-uname", window.lpLoggedInUsername)
      prevState = @userState
      @userState = @userSignedIn()
      @signonWidget()

    signOut: ->
      window.location= @options.signOutUrl

    getLocalData:(k)->
      if (window.lp.supports.localStorage)
        window.localStorage.getItem(k)
      else
        @localDataFallback(k)

    setLocalData:(k,v)->
      if (window.lp.supports.localStorage)
        window.localStorage.setItem(k,v)
      else
        window[k] = v

    delAllLocalData:()->
      if (window.lp.supports.localStorage)
        window.localStorage.clear()

    delLocalData:(k)->
      window.localStorage.removeItem(k)

    localDataFallback:(k)->
      switch(k)
        when 'lp-uname'
          window.lpLoggedInUsername
        when 'lp-unread-msg' then 0
        when 'lp-received-msg' then 0
        when 'lp-sent-msg' then 0
        else null
