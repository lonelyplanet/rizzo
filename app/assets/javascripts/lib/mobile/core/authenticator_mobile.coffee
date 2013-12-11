define ['jsmin'], ($)->

  class Authenticator

    @version = '0.0.1'
    
    constructor: () ->
      @options = @createUrls(@getDomain())
      @$el = $('.js-user-nav')
      unless @$el.length is 0
        @userState = @userSignedIn()
        @signonWidget()
    
    getDomain: ->
      if window.location.hostname is "www.lpstaging.com" then "lpstaging.com" else "lonelyplanet.com"

    getLocation: ->
      window.location

    createUrls: (baseDomain)->
      forumPostsUrlTemplate: "//www.#{baseDomain}/thorntree/profile.jspa?username=[USERNAME]"
      membersUrl: "//www.#{baseDomain}/members"
      messagesUrl: "//www.#{baseDomain}/members/messages"
      registerLink: "https://secure.#{baseDomain}/members/registration/new"
      signOutUrl: "https://secure.#{baseDomain}/sign-in/logout"

    userSignedIn: ->
      @lpUserName = @getLocalData('lp-uname')
      if (@lpUserName and (@lpUserName isnt '') and (@lpUserName isnt 'undefined')) then true else false

    signonWidget: ->
      if @userState is true
        @showUserBox()
        @addSignOutLink()
      else
        @showLoginAndRegister()

    addSignOutLink: ->
      primaryNav = document.getElementById('js-nav--primary')
      signOutLink = document.createElement('a')
      signOutLink.href = @options.signOutUrl
      signOutLink.textContent = "Sign out"
      signOutLink.className = "nav__item nav__item--primary nav__item--primary--signout--mobile"
      iconElement = document.createElement('i')
      iconElement.className = "nav__icon icon--sign-out--before icon--white--before"
      signOutLink.appendChild(iconElement)
      primaryNav.appendChild(signOutLink)

    showLoginAndRegister: ()->
      # For the mobile version we will combine them into one link
      @emptyUserNav()
      joinElement = "<a class='nav__item nav__item--primary js-user-join js-nav-item' href=" + @signInUrl() + "><i class='nav__icon icon--sign-in--before icon--white--before'></i> Join / sign in</a>"
      @$el.innerHTML += joinElement

    showUserBox: ->
      @emptyUserNav()
      @$el.classList.add('is-signed-in')
      userBoxElement = document.createElement('div')
      userBoxElement.className = 'nav__item nav__item--user user-box js-user-box nav__submenu__trigger';
      userImage = "<img class='user-box__img js-box-handler' src='#{@userAvatar()}'/>"
      userMenu = @userOptionsMenu()
      userBoxElement.innerHTML = userImage + userMenu
      @$el.appendChild(userBoxElement)

    emptyUserNav: -> 
      @$el.classList.remove('is-signed-in')
      signedInElems = $('a.js-user-join, a.js-user-signin, div.js-user-box')
      for i in signedInElems
        i.remove()

    userOptionsMenu: ->
      userOptions = [
        {title: 'My Profile', uri: "#{@options.membersUrl}", style:"js-user-profile"},
        {title: 'Settings', uri: "#{@options.membersUrl}/#{@lpUserName}/edit",  style:"js-user-settings"},
        {title: 'Messages', uri: "#{@options.messagesUrl}", style:"js-user-msg"},
        {title: 'Forum Activity', uri: "#{@options.forumPostsUrlTemplate.replace('[USERNAME]', @lpUserName)}", style:"nav-user-options__item--forum js-user-forum" },
        {title: 'Sign-Out', uri: "#{@options.signOutUrl}", style:"nav-user-options__item--signout js-user-signout" }
      ]
      optionElements =  ("<a class='nav__item nav__submenu__item nav__submenu__link nav-user-options__item js-nav-item #{u.style}' href='#{u.uri}'>#{u.title}#{u.extra || ''}</a>" for u in userOptions).join('')
      userMenu = "<span class='wv--hidden nav--offscreen__title'>#{@lpUserName}</span><div class='nav__submenu nav__submenu--user'><div class='nav--stacked nav__submenu__content nav__submenu__content--user nav-user-options js-user-options'><div class='nav__submenu__item nav__submenu__title'>#{@lpUserName}</div>#{optionElements}</div></div>"
    
    signInUrl:->
      "https://secure.lonelyplanet.com/sign-in/login?service=#{escape(@getLocation())}"
    
    userAvatar: ->
      "#{@options.membersUrl}/#{@lpUserName}/mugshot/small"

    update: ->
      @setLocalData("lp-uname", window.lpLoggedInUsername)
      prevState = @userState
      @userState = @userSignedIn()
      if(@userState is not prevState)
        @signonWidget()

    signOut: ->
      window.location= @options.signOutUrl

    getLocalData:(k)->
      if (@supportStorage())
        window.localStorage.getItem(k)
      else
        @localDataFallback(k)
    
    setLocalData:(k,v)->
      if (@supportStorage())
        window.localStorage.setItem(k,v)
      else
        window[k] = v
    
    delAllLocalData:()->
      if (@supportStorage())
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

    supportStorage: ->
      try
        (window.localStorage) && (window['localStorage'] != null)
      catch error
        false

