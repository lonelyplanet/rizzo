define ['jquery'], ($)->

  class Msg

    @version = '0.0.1'

    constructor: (@args = {}) ->
      @options =
        target: 'body'
        delay: 1000
      @add(@build(@args.content))

    build: () ->
      @msg = "<div class='row row--fluid #{@args.style}'><div class='wv--split--left cookie-msg'>#{@args.content}</div><div class='wv--split--right cookie-buttons'>#{@userOptions(@args.userOptions)}</div></div>"
      
    userOptions: (options, output="")->
      output += "<a class='btn btn--slim btn--green js-close-msg'>No worries</a>" unless options.close is false
      output += "<a class='btn btn--slim btn--grey js-more-msg' href='http://www.lonelyplanet.com/legal/cookies/'>Learn more</a>" unless options.more is false

    add: (el) ->
      $(@options.target).prepend(el)
      $('a.js-close-msg').on('click', (e)=> @removeMsg(e))
      if @args.delegate and @args.delegate.onAdd()
        @args.delegate.onAdd()

    removeMsg: (e)->
      $("div.#{@args.style}").remove()
      if @args.delegate and @args.delegate.onRemove()
        @args.delegate.onRemove()


