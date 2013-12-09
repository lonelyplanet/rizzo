# LP Gallery 
# A simple gallery widget that orchestrates two Lp Swipe components.
#
# Arguments: 
#   args [Object]
#     target             : [string]   A container to append the main gallery element.
#     index              : [number]   A starter index for the slides.
#     title              : [string]   The gallery title.
#     style              : [string]   A style to apply to the main gallery component (defaults to 'lp-gallery-box').
#     preload            : [number]   The number of slides to preload (defaults to 3).
#     data               : [array]    An array of hashes with the src and thumb for each asset.
#     stageTemplate      : [string]   The stage slide template.
#     thumbsTemplate     : [string]   The thumbs slide template.
#     stageSlidesPerSet  : [function] The number of slides per set on stage (should return a number).
#     thumbsSlidesPerSet : [function] The number of slides per set on thumbs (should return a number).
#
# Dependencies:
#   Jquery
#   lp.swipe
#  
# Example:
#   var args = {
#     index: 0
#     data: [
#       {src:'a.png', thumb:'a-thumb.png'},
#       {src:'b.png', thumb:'b-thumb.png'},
#       {src:'c.png', thumb:'c-thumb.png'},
#       {src:'d.png', thumb:'d-thumb.png'}
#     ]
#     target: 'section.gallery-section'
#     delegate: {
#       onClose: function(){
#           //on close code here
#         }
#       }
#     };
#
#   var gallery = new window.lp.Gallery(args)
#   gallery.show()
#
#

define ['jquery','lib/components/swipe'], ($, Swipe) ->

  class Gallery
    @version: '0.0.22'
    @options:
      index: 0
      preload: 3
      style: 'lp-gallery-box'
      target: 'body'
      title: undefined
      stageTemplate: "<div class='lp-gallery-img-wrap lp-item-loading' data-src='{{src}}' data-src='{{thumb}}'>{{src}}</div>"
      thumbTemplate: "<div class='lp-gallery-thumb-wrap'><div class='lp-gallery-image' style='background: url({{thumb}}) 50% 50% no-repeat #fff; background-size: 105%;'></div></div>"
      stageSlidesPerSet: -> 1
      thumbsSlidesPerSet: -> 8

    constructor: (@args={})->
      @args = $.extend Gallery.options, @args
      @prepare()

    prepare: ->
      @container = $('<div>').attr({id:'lp-gallery'})
      $(@args.target).append(@container)
      $(@container).append(@header())
      @bindEvents()
      @populateStage()
      @populateThumbs()

    header:() ->
      toolbar = $('<div>').addClass('lp-gallery-toolbar icon--cross icon--white')
      if @args.title
        title = $('<div>').addClass('lp-gallery-title').text(@args.title)
        $(toolbar).append(title)
      @btn_close = $(toolbar)

    populateStage:() ->
      options =
        target: '#lp-gallery'
        handlers: true
        template: @args.stageTemplate
        slidesPerSet: @args.stageSlidesPerSet
        speed: 400
        index: @args.index
        start: false
        style: 'lp-gallery-stage'
        msg: 'loading_images'
        transform: 'opacity'
        delegate :
          onUpdate: @onStageUpdate
      @stage = new Swipe(options)
      @stage.render(@args.data)

    onStageUpdate: (_bind, _i)=>
      for a in [0...(@args.preload)]
        @onSelect(_i)
        do (a) =>
          asset = $($(_bind.container).children()[_bind.index + a])
          if asset
            asset = asset.find('div.lp-gallery-img-wrap')
            unless $(asset).data("state")
              src = asset.data('src')
              $(asset).data('state','true')
              $(asset).empty().append($('<img>').attr({src:src}))

    onSelect: (_i)->
      elements = $(@thumb.container).find('li')
      $(elements).removeClass('current')
      $(elements[_i]).addClass('current')
      @thumb.slideToSet(_i)

    populateThumbs: ->
      options =
        target: '#lp-gallery'
        handlers: true
        template: @args.thumbTemplate
        slidesPerSet: @args.thumbsSlidesPerSet
        width: @args.width
        speed: 400
        style: 'lp-gallery-thumbs'
        msg: 'loading_thumbs'
        transform: 'translateX'
        delegate :
          onSelect:(e,i) => @displaySlide(e,i)
      @thumb = new Swipe(options)
      @thumb.render(@args.data)
      @stage.start()

    displaySlide: (_e, _index)->
      @stage.transform(_index)
      @stage.stopSlideShow()
      @onSelect(_index)

    show: ()->
      $('html').addClass('lp-gallery-active')

    close: ()->
      @dump()
      @args.delegate.onClose() if (@args.delegate && @args.delegate.onClose)

    dump: ()->
      $('html').removeClass('lp-gallery-active')
      $('#lp-gallery').remove()
      @container.remove()
      $(document).unbind('keydown')

    bindEvents: ()->
      $(document).on('keydown', (e)=> @keyListener(e))
      @btn_close.on('click', (e)=> @close())

    keyListener: (e)->
      @close() if(e.which is 27)
      @stage.prev() if e.which is 37
      @stage.next() if e.which is 39
