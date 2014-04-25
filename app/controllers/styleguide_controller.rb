class StyleguideController < GlobalController

  layout proc{|c| c.request.xhr? ? false : "styleguide" }

  def secondaryNavigation
    render '/styleguide/ui-components/secondary_nav'
  end

  def leftNavigation
    render '/styleguide/ui-components/left_nav'
  end

  def cards
    render '/styleguide/ui-components/cards'
  end

  def tiles
    render '/styleguide/ui-components/tiles'
  end

  def buttons
    render '/styleguide/ui-components/buttons'
  end

  def badges
    render '/styleguide/ui-components/badges'
  end

  def typography
    render '/styleguide/ui-components/typography'
  end

  def pageTitle
    render '/styleguide/ui-components/page_title'
  end

  def headers
    render '/styleguide/ui-components/headers'
  end

  def colours
    render '/styleguide/ui-components/colours'
  end

  def uiColours
    render '/styleguide/ui-components/ui_colours'
  end

  def icons
    render '/styleguide/ui-components/icons'
  end

  def inactiveIcons
    render '/styleguide/ui-components/inactive-icons'
  end

  def pagination
    render '/styleguide/ui-components/pagination'
  end

  def inputs
    render '/styleguide/ui-components/inputs'
  end

  def dropdown
    render '/styleguide/ui-components/dropdown'
  end

  def rangeSlider
    render '/styleguide/ui-components/range_slider'
  end

  def proportionalGrid
    render '/styleguide/ui-components/proportional-grid'
  end

  def cardsGrid
    render '/styleguide/ui-components/cards-grid'
  end

  def activity_list
    render '/styleguide/ui-components/activity_list'
  end

  def navigational_dropdown
    render '/styleguide/ui-components/navigational_dropdown'
  end

  def toggle_active
    render '/styleguide/js-components/toggle-active'
  end

  def tags
    render '/styleguide/tags'
  end

  def proximity_loader
    render '/styleguide/js-components/proximity-loader'
  end

  def asset_reveal
    render '/styleguide/js-components/asset-reveal'
  end

  def image_helper
    render '/styleguide/js-components/image-helper'
  end

  def alerts
    render '/styleguide/ui-components/alerts'
  end

  def utilityClasses
    render '/styleguide/css-utilities/utility-classes'
  end

  def legacy
    render '/styleguide/css-utilities/legacy'
  end

  def noJs
    render '/styleguide/css-utilities/no-js'
  end

  def lpSpecificClasses
    render '/styleguide/css-utilities/lp-specific-classes'
  end

  def responsive
    render '/styleguide/css-utilities/responsive'
  end

  def tooltips
    render '/styleguide/ui-components/tooltips'
  end

  def utilityPlaceholders
    render '/styleguide/css-utilities/utility-placeholders'
  end

  def lpSpecificPlaceholders
    render '/styleguide/css-utilities/lp-specific-placeholders'
  end

  def iconPlaceholders
    render '/styleguide/css-utilities/icon-placeholders'
  end

  def responsiveMixins
    render '/styleguide/css-utilities/responsive-mixins'
  end

  def mediaMixins
    render '/styleguide/css-utilities/media-mixins'
  end

  def utilityMixins
    render '/styleguide/css-utilities/utility-mixins'
  end

  def lightbox
    render '/styleguide/js-components/lightbox'
  end

  def konami
    render '/styleguide/js-components/konami'
  end

  def template
    render '/styleguide/js-components/template'
  end

  def swipe
    render '/styleguide/js-components/swipe'
  end

  def adUnits
    render '/styleguide/ui-components/ad-units'
  end

  def link_to
    render '/styleguide/js-components/link-to'
  end

  #===== yeoman hook =====#
  # NB! The above line is required for our yeoman generator and should not be changed.
end
