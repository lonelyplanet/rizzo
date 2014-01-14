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
    render '/styleguide/tiles'
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

  def colours
    render '/styleguide/ui-components/colours'
  end

  def uiColours
    render '/styleguide/ui-components/ui_colours'
  end

  def activeIcons
    render '/styleguide/ui-components/active-icons'
  end

  def inactiveIcons
    render '/styleguide/ui-components/inactive-icons'
  end

  def pagination
    render '/styleguide/ui-components/pagination'
  end

  def forms
    render '/styleguide/ui-components/forms'
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

  #===== yeoman hook =====#
  # NB! The above line is required for our yeoman generator and should not be changed.
end
