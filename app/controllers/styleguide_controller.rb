class StyleguideController < GlobalController

  include LayoutSupport
  layout proc{|c| c.request.xhr? ? false : "styleguide" }
  before_filter :setup

  def setup
    @app = StyleGuide.new(request.fullpath)
  end

  def show
    render "/styleguide/#{params[:section]}", locals: layout_defaults.merge(legacy_options[:styleguide])
  end

end
