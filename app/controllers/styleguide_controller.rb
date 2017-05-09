class StyleguideController < ActionController::Base

  include LayoutSupport
  layout proc { |c| c.request.xhr? ? false : "styleguide" }
  before_action :setup

  def setup
    @app = StyleGuide.new(request.fullpath)
  end

  def show
    @fixed_width_layout = true
    render "/styleguide/#{params[:section]}", locals: get_layout_config(:styleguide)
  end

end
