class StyleguideController < GlobalController

  layout 'styleguide'

  def index
    render '/styleguide/index'
  end

  def navigation
    render '/styleguide/navigation'
  end

  def colours
    render '/styleguide/colours'
  end

  def uiColours
    render '/styleguide/ui_colours'
  end

end