class StyleguideController < GlobalController

  layout 'styleguide'

  def secondaryNavigation
    render '/styleguide/secondary_nav'
  end

  def leftNavigation
    render '/styleguide/left_nav'
  end

  def cards
    render '/styleguide/cards'
  end

  def buttons
    render '/styleguide/buttons'
  end

  def typography
    render '/styleguide/typography'
  end

  def colours
    render '/styleguide/colours'
  end

  def uiColours
    render '/styleguide/ui_colours'
  end

  def pagination
    render '/styleguide/pagination'
  end

  def forms
    render '/styleguide/forms'
  end

  def activity_list
    render '/styleguide/activity_list'
  end

end